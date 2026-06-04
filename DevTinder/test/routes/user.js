const express = require('express');
const connectDB = require('../config/database')
const app = express();
const User = require('../models/user');
const req = require('express/lib/request');
const {validate, isUpdateAllowed} = require('../utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middlewares/auth');




const userRouter = express.Router();


userRouter.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        // console.log(userId)
        const del = await User.findByIdAndDelete(userId);
        console.log(del);
        res.send("User by Name: " + del.firstName + " " + del.lastName + " is Deleted.")
    }
    catch (err) {
        res.status(500).send("Server Error");
    }
})

userRouter.patch('/user', isUpdateAllowed, async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const ret = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after" });
        res.send("User Updated Successfully " + ret);
    } catch (err) {
        res.status(500).send("Server Error " + err.message);
    }
});

userRouter.put('/user', isUpdateAllowed, async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const ret = await User.replaceOne({ _id: userId }, data);
        res.send("User replaced Successfully " + ret.modifiedCount);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

app.get('/user/feed', async (req, res) => {

    try {
        console.log(req.body);
        if (req.body != undefined) {
            const email = req.body.emailId;
            const user = await User.find({ emailId: email });
            if (user.length) {
                res.send(user)
            } else {
                res.send("No User Found");
            }
        } else {
            const user = await User.find({});
            console.log(user);
            if (user.length) {
                res.send(user)
            } else {
                res.send("No User Found");
            }
        }

    } catch (err) {
        res.status(500).send("Server Error")
    }

});

userRouter.post('/isUserLoggedin', userAuth, async (req,res,next)=>{
    res.send(res.userObj.firstName+" logged in");
})

// Global Error Handler Middleware
userRouter.use((err, req, res, next) => {
    // Read the status code we attached, or default to 500 Server Error
    const statusCode = err.statusCode || 500;
    
    console.error(`Error intercepted: ${err.message}`);

    // Send a clean, unified response back to the client
    res.status(statusCode).json({
        success: false,
        message: err.message
    });
});

module.exports=userRouter;