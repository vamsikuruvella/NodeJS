const express = require('express');
const connectDB = require('../config/database')
const app = express();
const User = require('../models/user');
const req = require('express/lib/request');
const { validate } = require('../utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');



const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res, next) => {
    try {
        const status = req.params.status;
        if (!['ignore', 'interested'].includes(status)) {
            throw new Error("Invalid Status")
        }
        const fromUserId = req.currentUser;
        const toUserId = req.params.toUserId;

        //fromUserId same as toUserId, this or pre check will do same
        if (fromUserId == toUserId) {
            return res.status(404).send("from user id cant be same as to user id")
        }

        //is Valid users
        const isvaliduser = await User.findById(toUserId);
        if (!isvaliduser) {
            return res.status(404).send("Not a Valid toUserId");
        }

        // is already connected or ignored, third condition is really not needed but keeping it here for understanding
        const isConnected0rIgnored = await connectionRequest.findOne({
            $or: [
                {
                    fromUserId, toUserId
                },
                {
                    fromUserId: toUserId, toUserId: fromUserId
                }, {
                    fromUserId: toUserId, toUserId: fromUserId, status: "ignored"
                }
            ]
        })
        if (isConnected0rIgnored) {
            return res.status(400).json({ message: "Already connected or Ignored" });
        }



        //Add connection
        const currentRequest = new connectionRequest({
            fromUserId, toUserId, status,
        });
        console.log(req.currentUser);
        console.log(req.params.toUserId);
        const data = await currentRequest.save();
        return res.json({ message: "New connection added", data: data });
    } catch (ex) {
        console.log(ex);
        return res.status(404).send("Error: " + ex.message);
    }
})


requestRouter.post('/request/review/:status/:reqId', userAuth, async (req, res, next) => {
    try {
        const status = req.params.status;
        if (!['accepted', 'rejected'].includes(status)) {
            throw new Error("Invalid Status")
        }
        const reqId = req.params.reqId;

        // toUserID same as logged in user
        const loggedinuser = req.currentUser;
        const curReq = await connectionRequest.findOne({
            _id: reqId,
            toUserId: loggedinuser,
            status: "interested"
        });

        if (!curReq) {
            throw new Error("Invalid or inactive connection request");
        }

        const data = await curReq.updateOne({ status: status });
        // The below code will do the same.
        // curReq.status=status;
        // await curReq.save();
        return res.json({ message: "Connection Request Updated", data: data });
    } catch (ex) {
        return res.status(404).send("Error: " + ex.message);
    }
})





// Global Error Handler Middleware
requestRouter.use((err, req, res, next) => {
    // Read the status code we attached, or default to 500 Server Error
    const statusCode = err.statusCode || 500;

    console.error(`Error intercepted: ${err.message}`);

    // Send a clean, unified response back to the client
    return res.status(statusCode).json({
        success: false,
        message: err.message
    });
});

module.exports = requestRouter;