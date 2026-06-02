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



const authRouter = express.Router();

authRouter.post('/signup', validate, async (req, res, next) => {
    try {
        console.log("line 30");
        //Request Body Validation
        // await validate(req, res, next);
        console.log("line 33");
        const { firstName, lastName, password, emailId, skills, gender, photoUrl, about } = req.body;
        console.log("line 35");
        //Encrypt Password
        const pwdHash = await bcrypt.hash(password, 10);
        console.log("line 38");
        console.log(pwdHash);
        req.body.password = pwdHash;

        const userObj = { firstName, lastName, password: pwdHash, emailId, skills, gender, photoUrl, about };
        console.log(userObj)
        const user = new User(userObj);
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        //Email and password Validation
        const { emailId, password } = req.body;

        //Get matching user
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }

        //Password compare
        const isPwdValid = await bcrypt.compare(password, user.password);

        if (!isPwdValid) {
            throw new Error("Invalid Credentials");
        } else {
            const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790",{'expiresIn':"1h"});
            console.log(token);
            res.cookie('token', token);
            res.send("Login Successfully");
        }
    } catch (err) {
        res.status(400).send("Failed with erorr: " + err.message);
    }
})

authRouter.post('/logout', async (req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
    res.send("User Logged out successfully");
})

module.exports= authRouter;