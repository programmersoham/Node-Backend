const mongoose = require("mongoose");
const db =
    "mongodb+srv://soham:FlRhj0AZsHPpPvgw@cluster0.zntuept.mongodb.net/?retryWrites=true&w=majority";
/* Connection string from mongo cloud db */

mongoose.set("strictQuery", true, "useNewUrlParser", true);

const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log("MongoDB is Connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
module.exports = connectDB;