const express = require('express');
const connectDB = require('../config/database')
const app = express();
const User = require('../models/user');
const req = require('express/lib/request');
const {validate} = require('../utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middlewares/auth');




const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest',(req, res) => {
    res.send("Building");
})

module.exports=requestRouter;