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

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user')

// helps handle JSON body in api calls
app.use(express.json());
// helps read cookies
app.use(cookieParser());


app.use('/', authRouter);
app.use('/',userRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);


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

