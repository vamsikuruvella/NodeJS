const expresss = require('express');
const connectDB = require('./config/database')
const app = expresss();
const USer = require('./models/user')

app.post('/signup', async (req, res) => {
    const userObj = {
        firstName: "Vamsi",
        lastName: "Kuruvella",
        emailId: "test@gmail.com",
        password: "xxxxx",
        age: 23,
        gender: "Male"
    }
    const user = new USer(userObj);
    await user.save();
    res.send("User added successfully");
})

connectDB().then(() => {
    console.log("Connected Successfully to DevTinder Database");
    app.listen(7777, () => {
        console.log("Listening on port 7777");
    })
}).catch((err) => {
    console.log("Failed with: " + err);
})

