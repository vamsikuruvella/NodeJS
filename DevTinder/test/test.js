const expresss = require('express');
const connectDB = require('./config/database')
const app = expresss();



connectDB().then(() => {
    console.log("Connected Successfully to DevTinder Database");
    app.listen(7777, () => {
        console.log("Listening on port 7777");
    })
}).catch((err) => {
    console.log("Failed with: " + err);
})

