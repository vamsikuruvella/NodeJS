const express = require('express');
const connectDB = require('../config/database')
const app = express();
const User = require('../models/user');
const req = require('express/lib/request');
const { validate, isUpdateAllowed, isPWDUpdateAllowed, isStrongPassword } = require('../utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middlewares/auth');




const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res, next) => {
    try {
        console.log(res.userObj)
        res.send(res.userObj);
    } catch (err) {
        console.log(err);
        res.status(401).send(err.message);;
    }
})

profileRouter.patch('/profile/edit', userAuth, isUpdateAllowed, async (req, res, next) => {
    const currentUser = req.currentUser;
    const data = req.body;
    try {
        const ret = await User.findByIdAndUpdate({ _id: currentUser }, data, { returnDocument: "after" });
        res.send("User Updated Successfully " + ret);
    } catch (err) {
        res.status(500).send("Server Error " + err.message);
    }
})

profileRouter.get('/profile/view', userAuth, async (req, res, next) => {
    const currentUser = req.currentUser;
    const data = req.body;
    try {
        const ret = await User.findById(currentUser);
        res.json(ret);
    } catch (err) {
        res.status(500).send("Server Error " + err.message);
    }
})

const pwdarr = [userAuth, isPWDUpdateAllowed, isStrongPassword];

profileRouter.patch('/profile/password', userAuth, isPWDUpdateAllowed, isStrongPassword, async (req, res, next) => {
    const currentUser = req.currentUser;
    const pwdHash = await bcrypt.hash(req.body.newPassword, 10);
    const data = { "password": pwdHash };
    try {
        const ret = await User.findByIdAndUpdate({ _id: currentUser }, data, { returnDocument: "after" });
        res.send("User Password Successfully Updated");
    } catch (err) {
        res.status(500).send("Server Error " + err.message);
    }
})

// Global Error Handler Middleware
profileRouter.use((err, req, res, next) => {
    // Read the status code we attached, or default to 500 Server Error
    const statusCode = err.statusCode || 500;
    
    console.error(`Error intercepted: ${err.message}`);

    // Send a clean, unified response back to the client
    res.status(statusCode).json({
        success: false,
        message: err.message
    });
});

module.exports = profileRouter;