const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user');
const req = require('express/lib/request');


//Restrict Invalid updation
const allowedFld = new Set(["userId","firstName", "lastName", "skills", "gender", "photoUrl", "about"]);

function isUpdateAllowed(req, res, next) {
  const objKeys = Object.keys(req.body);
  
  for (const key of objKeys) {        // for...of gives values, not indexes
    if (!allowedFld.has(key)) {
      return res.status(400).send("Can't update " + key);
    }
  }
  
  next();
}

// helps handle JSON body in api calls
app.use(express.json());

app.post('/signup', async (req, res) => {
    try {
        const userObj = req.body
        console.log(userObj)
        const user = new User(userObj);
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(500).send(err);
    }
});

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

app.patch('/user',isUpdateAllowed, async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const ret = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after" });
        res.send("User Updated Successfully " + ret);
    } catch (err) {
        res.status(500).send("Server Error "+err);
    }
});

app.put('/user',isUpdateAllowed, async (req, res) => {
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
    console.log("Failed with: " + err);
})

