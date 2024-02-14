const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Documentation for the API endpoints',
    },
    servers: [
        {
            url: 'http://localhost:8082',
            description: 'Development server',
        },
    ],
};

// Options for the swagger jsdoc
const options = {
    swaggerDefinition,
    // Path to the API docs
    apis: ['./API/*.js'], // You may need to adjust this path based on your file structure
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Serve swagger docs
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
