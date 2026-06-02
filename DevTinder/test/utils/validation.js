const validator = require('validator');
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

module.exports = { validate, isUpdateAllowed };