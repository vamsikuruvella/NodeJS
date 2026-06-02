const express = require('express');
const connectDB = require('../config/database')
const app = express();
const User = require('../models/user');
const req = require('express/lib/request');
const { validate, isUpdateAllowed } = require('../utils/validation');
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
    const currentUser = res.currentUser;
    const data = req.body;
    try {
        const ret = await User.findByIdAndUpdate({ _id: currentUser }, data, { returnDocument: "after" });
        res.send("User Updated Successfully " + ret);
    } catch (err) {
        res.status(500).send("Server Error " + err.message);
    }
})


module.exports = profileRouter;