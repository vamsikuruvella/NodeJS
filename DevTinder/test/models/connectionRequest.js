const req = require('express/lib/request');
const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const validator = require('validator');


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //creating connection to user collection
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //creating connection to user collection
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['ignore', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is incorrect status type'
        },
        required: true
    },

}, { timestamps: true })

// Compound Indexing
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//pre check for save
connectionRequestSchema.pre("save", function () {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("Schema Error: Can't connect to yourself");
    }
});

const connectionModel = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = connectionModel;