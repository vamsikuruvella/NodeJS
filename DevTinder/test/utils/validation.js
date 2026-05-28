const validator = require('validator');
function validate(req, res, next) {
    try {
        console.log("validation 4 "+JSON.stringify(req.body));
        const { firstName, lastName, password, emailId } = req.body;
        console.log("validation 6 "+firstName,lastName,password,emailId);
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
        console.log("Validation 16 "+err);
        throw new Error(err);
        next();
    }
}

module.exports = validate;