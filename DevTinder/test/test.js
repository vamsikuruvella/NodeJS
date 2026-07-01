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
const userRouter = require('./routes/user');
const cors = require('cors');

//cors error handling
const whitelist = [
  "https://urban-space-xylophone-jw9v9gv54rvc5xg-3000.app.github.dev",
  "https://localhost"
];

const corsOptions = {
  origin: (incomingOrigin, callback) => {
    // If no Origin header (e.g. same‐origin) or it’s in our whitelist, allow it
    if (!incomingOrigin || whitelist.includes(incomingOrigin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
// helps handle JSON body in api calls
app.use(express.json());
// helps read cookies
app.use(cookieParser());


app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);


app.use("/", (req, res) => {
    res.send("No Matching APIs");
})

connectDB().then(() => {
    console.log("Connected Successfully to DevTinder Database");
    app.listen(3000, "0.0.0.0", () => {
        console.log("Listening on port 3000");
    })
}).catch((err) => {
    console.log("Failed with: " + err.message);
})

