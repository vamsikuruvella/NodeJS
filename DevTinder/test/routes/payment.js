const route = require('express');
const razorpayInstance = require('../utils/razorpay');
const { userAuth } = require('../middlewares/auth');
const paymentRouter = route.Router();
const payment = require('../models/payment');
const User = require('../models/user');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');


const USER_SAFE_DATA = ['firstName', 'lastName', 'photoUrl', 'emailId', 'gender', 'age', 'about', 'skills'];

paymentRouter.post('/payment/create', userAuth, async (req, res) => {
    try {
        const plan = req.body.plan;
        const isMonthly = req.body.isMonthly;
        if (!plan || !['basic', 'pro'].includes(plan)) {
            return res.status(400).send("Invalid plan selected");
        }
        const amount = plan === 'basic' ? (isMonthly ? 10000 : 100000) : (isMonthly ? 35000 : 3500000); // Amount in paise
        // Create an order using Razorpay API
        const order = await razorpayInstance.orders.create({
            amount: amount, // Amount in paise (e.g., 50000 paise = 500 INR)
            currency: 'INR',
            receipt: 'receipt#1',
            payment_capture: 1 ,
            notes: {
                userId: req.currentUser,
                plan: plan
            }
        });
        // Save the order details in database
        const paymentObj = new payment({
            orderId: order.id,
            userId: req.currentUser,
            status: 'created',
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: {
                plan: plan
            }
        });
        const savedPayment = (await paymentObj.save())
        // Populate the userId field with safe user data
        const populatedPayment = await savedPayment.populate("userId", USER_SAFE_DATA);
        res.json({...populatedPayment._doc, key_id: process.env.RAZORPAY_KEY_ID});

    }catch (err) {
        console.error(err);
        res.status(500).send("Server Error payment");
    }
});

paymentRouter.post('/payment/webhook' , async (req, res) => {
    try{
        console.log("Webhook received: ", req.body);
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        const isValid = validateWebhookSignature(JSON.stringify(req.body), req.headers['x-razorpay-signature'], secret);
        if (!isValid) {
            return res.status(400).send("Invalid webhook signature");
        }
        //Update the payment status in the database based on the webhook event
        const paymentDetails = req.body.payload.payment.entity;
        const paymentRecord = await payment.findOne({ orderId: paymentDetails.order_id });
        if (!paymentRecord) {
            return res.status(404).send("Payment record not found");
        }
        paymentRecord.status = paymentDetails.status;
        await paymentRecord.save();
       
        const user = await User.findById(paymentRecord.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        if(req.body.event === 'payment.captured') {
            //Payment captured successfully, update the payment status in the database
            user.isPremium = true;
            user.membershipPlan = paymentRecord.notes.plan;
            await user.save();
        }
        // if(req.body.event === 'payment.failed') {
        //     //Payment failed, update the payment status in the database
        //     user.isPremium = false;
        //     user.membershipPlan = null;
        //     await user.save();
        // }
        return res.status(200).send("Webhook received");
    }catch (err) {
        console.error(err);
        res.status(500).send("Server Error payment webhook");
    }
});

module.exports = paymentRouter;