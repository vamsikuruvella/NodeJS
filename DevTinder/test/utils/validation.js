const validator = require('validator');
function validate(req){
    const {firstName, lastName, password, emailID}=req.body;

    if(!firstName || !lastName){
        res.status(401).send("Enter valid Name");
    }
    if(!validate.isEmail(emailID)){
        res.status(401).send("Not Valid Email");
    }
    if(!validate.isStrongPassword(password)){
        res.status(401).send("Not a strong Password");
    }
    next();
}

module.exports=validate;