require('dotenv').config();
require('./utils/cronJob');
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
const paymentRouter = require('./routes/payment');
const cors = require('cors');


//cors error handling
const whitelist = [
  "https://urban-space-xylophone-jw9v9gv54rvc5xg-3000.app.github.dev",
  "https://localhost"
];

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174", "https://urban-space-xylophone-jw9v9gv54rvc5xg-3000.app.github.dev/","https://urban-space-xylophone-jw9v9gv54rvc5xg-5173.app.github.dev/","https://urban-space-xylophone-jw9v9gv54rvc5xg-5174.app.github.dev/"],
  credentials: true
};

// app.use(cors({
//   origin: '*',
//   methods: ['GET','POST','PUT','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization']
// }));


app.use(cors(corsOptions));
// helps handle JSON body in api calls
app.use(express.json());
// helps read cookies
app.use(cookieParser());


app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', paymentRouter);

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

