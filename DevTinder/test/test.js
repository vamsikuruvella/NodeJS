const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user');
const req = require('express/lib/request');
const validate = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');


// helps handle JSON body in api calls
app.use(express.json());
// helps read cookies
app.use(cookieParser());

//Restrict Invalid updation
const allowedFld = new Set(["userId", "firstName", "lastName", "skills", "gender", "photoUrl", "about"]);

function isUpdateAllowed(req, res, next) {
    const objKeys = Object.keys(req.body);

    for (const key of objKeys) {        // for...of gives values, not indexes
        if (!allowedFld.has(key)) {
            return res.status(400).send("Can't update " + key);
        }
    }

    next();
}

app.get('/feed', async (req, res) => {

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

app.use("/", (req, res) => {
    res.send("No Response");
})

connectDB().then(() => {
    console.log("Connected Successfully to DevTinder Database");
    app.listen(3000, "0.0.0.0", () => {
        console.log("Listening on port 3000");
    })
}).catch((err) => {
    console.log("Failed with: " + err.message);
})

