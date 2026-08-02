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

let body = ` 
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:#ff4458;padding:30px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:30px;">
                ❤️ DevTinder
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">
              <h2 style="margin-top:0;color:#333333;">
                You have a new Friend Request! 🎉
              </h2>

              <p style="font-size:16px;color:#555555;line-height:1.7;">
                Someone is interested in connecting with you on
                <strong>DevTinder</strong>.
              </p>

              <p style="font-size:16px;color:#555555;line-height:1.7;">
                Open the app to view the request and start a conversation.
              </p>

              <div style="text-align:center;margin:35px 0;">
                <a href="https://devtinder.vamsikuruvella.in"
                  style="
                    background:#ff4458;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 30px;
                    border-radius:8px;
                    display:inline-block;
                    font-size:16px;
                    font-weight:bold;">
                  View Request →
                </a>
              </div>

              <hr style="border:none;border-top:1px solid #eeeeee;">

              <p style="font-size:13px;color:#888888;text-align:center;">
                You're receiving this email because you have a DevTinder account.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

const requestRouter = express.Router();

const sendEmail = require("../utils/sendEmail");

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

        // const emailRes = await sendEmail.run(
        //     "A new friend request",
        //     body,
        //     "kuruvellasaivamsi1@gmail.com"
        // );

        // console.log(emailRes);

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