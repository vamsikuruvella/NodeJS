const validator = require('validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
function validate(req, res, next) {
    try {
        console.log("validation 4 " + JSON.stringify(req.body));
        const { firstName, lastName, password, emailId } = req.body;
        console.log("validation 6 " + firstName, lastName, password, emailId);
        if (!firstName || !lastName) {
            res.status(401).send("Enter valid Name");
        }
        if (!validator.isEmail(emailId)) {
            res.status(401).send("Not Valid Email");
        }
        if (!validator.isStrongPassword(password)) {
            res.status(401).send("Not a strong Password");
        }
        next();
    } catch (err) {
        console.log("Validation 16 " + err);
        throw new Error(err);
        next();
    }
}
function isUpdateAllowed(req, res, next) {
    //Restrict Invalid updation
    const allowedFld = new Set(["userId", "firstName", "lastName", "skills", "gender", "photoUrl", "about"]);

    const objKeys = Object.keys(req.body);

    for (const key of objKeys) {        // for...of gives values, not indexes
        if (!allowedFld.has(key)) {
            return res.status(400).send("Can't update " + key);
        }
    }
    next();
}


async function isPWDUpdateAllowed(req, res, next) {
    try {//Restrict Invalid updation
        const allowedFld = new Set(["oldPassword", "newPassword"]);

        const objKeys = Object.keys(req.body);

        //is old password matching
        const { oldPassword } = req.body;
        console.log("Line 46 " + req.currentUser);
        //Get matching user
        const user = await User.findById(req.currentUser);
        if (!user) {
            throw new Error("User Not Found");
        }

        //Password compare
        const isPwdValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPwdValid) {
            throw new Error("Old Password not matching");
        }

        for (const key of objKeys) {        // for...of gives values, not indexes
            if (!allowedFld.has(key)) {
                return res.status(400).send("Can't update " + key);
            }
        }
        next();
    } catch (ex) {
        next(ex);
    }
}

function isStrongPassword(req, res, next) {
    const { newPassword } = req.body;
    if (!validator.isStrongPassword(newPassword)) {
        res.status(401).send("Not a strong Password");
    }
    next();
}


module.exports = { validate, isUpdateAllowed, isPWDUpdateAllowed, isStrongPassword };