const jwt = require('jsonwebtoken');
const User = require("../models/user");
const userAuth = async (req, res, next) => {
    try {// Read token from cookies
        const cookies = req.cookies;
        const token = cookies?.token;
        //validate the token
        const decodeObj = await jwt.verify(token, "DEV@Tinder$790");
        const { _id } = decodeObj;
        req.currentUser = _id;
        console.log(res.currentUser)
        // is valid user
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        } 
        res.userObj=user;
        next();
    } catch (err) {
        res.status(400).send("Error: "+err.message);
    }
}
module.exports = { userAuth };