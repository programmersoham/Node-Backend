const express = require("express");
const bcrypt = require("bcrypt");

const auth = require("../Auth/auth");
const db = require("../db");
const { authorize, Roles } = require("../Auth/auth");
const User = require('../Models/Users');
const router = express.Router();

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailId:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Error creating user
 */
router.post("/user", async (req, res) => {
    try {
        const { emailId, password, role, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            emailId,
            password: hashedPassword,
            role,
            isActive: true
        });

        await newUser.save();

        const token = auth.issueToken(newUser);

        res.status(200).json({ ...newUser._doc, token });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error: Could not add user" });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User authentication and login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       400:
 *         description: Error getting user details
 *       401:
 *         description: Incorrect credentials
 */
router.post("/auth/login", async (req, res) => {
    const { emailId, password } = req.body;

    try {
        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(401).json({ message: "Incorrect Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Incorrect Credentials" });
        }

        const token = auth.issueToken(user);

        res.status(200).json({ ...user._doc, token });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error: Could not get user details" });
    }
});

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       400:
 *         description: Error getting user profile
 */
router.get("/user/profile", authorize(Roles.All), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(400).json({ message: "Error: Could not get user profile" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error: Could not get user profile" });
    }
});

/**
 * @swagger
 * /user/status:
 *   patch:
 *     summary: Update user status
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User data updated successfully
 *       400:
 *         description: Error updating user data
 */
router.patch("/user/status", authorize(Roles.Admin), async (req, res) => {
    const { userId, isActive } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, { isActive });

        if (!user) {
            return res.status(400).json({ message: "Error: Could not update user data" });
        }

        res.status(200).json({ message: "User data updated" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error: Could not update user data" });
    }
});
module.exports = router;
