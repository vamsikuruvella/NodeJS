const express = require('express');
const connectDB = require('../config/database')
const app = express();
const User = require('../models/user');
const req = require('express/lib/request');
const {validate} = require('../utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middlewares/auth');




const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest',(req, res) => {
    res.send("Building");
})

// Global Error Handler Middleware
requestRouter.use((err, req, res, next) => {
    // Read the status code we attached, or default to 500 Server Error
    const statusCode = err.statusCode || 500;
    
    console.error(`Error intercepted: ${err.message}`);

    // Send a clean, unified response back to the client
    res.status(statusCode).json({
        success: false,
        message: err.message
    });
});

module.exports=requestRouter;