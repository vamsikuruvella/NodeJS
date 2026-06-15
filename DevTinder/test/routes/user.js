const express = require('express');
const connectDB = require('../config/database')
const app = express();
const User = require('../models/user');
const req = require('express/lib/request');
const { validate, isUpdateAllowed } = require('../utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');



const userRouter = express.Router();
const USER_SAFE_DATA = ['firstName', 'lastName', 'photoUrl', 'age', 'about', 'skills'];

userRouter.delete("/user", async (req, res) => {
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

userRouter.patch('/user', isUpdateAllowed, async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const ret = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after" });
        res.send("User Updated Successfully " + ret);
    } catch (err) {
        res.status(500).send("Server Error " + err.message);
    }
});

userRouter.put('/user', isUpdateAllowed, async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const ret = await User.replaceOne({ _id: userId }, data);
        res.send("User replaced Successfully " + ret.modifiedCount);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

//GET all pending connection requests
userRouter.get('/user/requests/received', userAuth, async (req, res, next) => {
    try {
        console.log("line 56");
        const data = await connectionRequest.find({
            status: "interested",
            toUserId: req.currentUser
        }).populate('fromUserId', USER_SAFE_DATA)

        // building relation btw to collections
        console.log("line 61");
        if (data.length === 0) {
            console.log("line 63");
            res.json({ message: "No active Connection requests" });
        } else {
            console.log("line 66" + data);
            res.json(data);
        }
    } catch (ex) {
        console.log("line 70");
        res.status(404).json({ message: "Error", errorMsg: ex });
    }
})
// GET all connections
userRouter.get('/user/connections', userAuth, async (req, res, next) => {
    try {
        const connections = await connectionRequest.find({
            $or: [
                {
                    toUserId: req.currentUser,
                    status: "accepted"
                },
                {
                    fromUserId: req.currentUser,
                    status: "accepted"
                }
            ]
        }).populate('fromUserId', USER_SAFE_DATA).populate('toUserId', USER_SAFE_DATA)
        const cleanConnections = connections.map(row => {
            if (row.fromUserId._id.toString() === req.currentUser.toString()) return row.toUserId;
            return row.fromUserId
        });
        if (cleanConnections.length === 0) {
            res.json({ message: "No connections" });
        } else {

            // const uniqueConnections = new Set();
            // for (let i of connections) {
            //     uniqueConnections.add(i.fromUserId.toString());
            //     uniqueConnections.add(i.toUserId.toString());
            // }
            // console.log("currentUser =", req.currentUser);
            // console.log("currentUser string =", req.currentUser.toString());
            // console.log("Set values =", [...uniqueConnections]);
            // uniqueConnections.delete(req.currentUser.toString());
            // const connectedUsers = await User.find({
            //     _id: { $in: [...uniqueConnections] }
            // })
            if (cleanConnections.length === 0) {
                res.json({ message: "No Connected users" });
            } else {
                res.json(cleanConnections);
            }
        }
    } catch (ex) {
        res.status(404).json({ message: "Failed with following Error: " + ex })
    }
});

userRouter.get('/feed', userAuth, async (req, res, next) => {

    try {
        const limitNum = parseInt(req.query?.limit) || 10;
        const skipNum= (parseInt(req.query?.page)-1)*limitNum || 0;

        limitNum = limitNum>50?50:limitNum;
        
        const connectionRequests = await connectionRequest.find({
            $or: [
                { fromUserId: req.currentUser },
                { toUserId: req.currentUser }
            ]
        }).select(['fromUserId', 'toUserId']);
        const hideUsersFromFeed = new Set();
        for (let i = 0; i < connectionRequests.length; i++) {
            hideUsersFromFeed.add(connectionRequests[i].fromUserId.toString());
            hideUsersFromFeed.add(connectionRequests[i].toUserId.toString());
        };

        const users = await User.find({
            _id : {$nin: Array.from(hideUsersFromFeed)}
        }).select(USER_SAFE_DATA).skip(skipNum).limit(limitNum)

        res.send(users);
    } catch (err) {
        res.status(500).send("Server Error: " + err)
    }

});

userRouter.post('/isUserLoggedin', userAuth, async (req, res, next) => {
    res.send(res.userObj.firstName + " logged in");
})

// Global Error Handler Middleware
userRouter.use((err, req, res, next) => {
    // Read the status code we attached, or default to 500 Server Error
    const statusCode = err.statusCode || 500;

    console.error(`Error intercepted: ${err.message}`);

    // Send a clean, unified response back to the client
    res.status(statusCode).json({
        success: false,
        message: err.message
    });
});

module.exports = userRouter;