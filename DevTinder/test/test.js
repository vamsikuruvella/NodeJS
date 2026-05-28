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



app.post('/signup', validate, async (req, res, next) => {
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

app.post('/login', async (req, res) => {
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

app.post('/isUserLoggedin', userAuth, async (req,res,next)=>{
    res.send(res.userObj.firstName+" logged in");
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        console.log(res.userObj)
        res.send(res.userObj);
    } catch (err) {
        console.log(err);
        res.status(401).send(err.message);;
    }
})

app.delete("/user", async (req, res) => {
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

app.patch('/user', isUpdateAllowed, async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const ret = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after" });
        res.send("User Updated Successfully " + ret);
    } catch (err) {
        res.status(500).send("Server Error " + err.message);
    }
});

app.put('/user', isUpdateAllowed, async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const ret = await User.replaceOne({ _id: userId }, data);
        res.send("User replaced Successfully " + ret.modifiedCount);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

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

