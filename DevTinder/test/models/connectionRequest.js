const req = require('express/lib/request');
const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const validator = require('validator');


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
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
connectionRequestSchema.pre("save", function (next) {
    const connectionreq = this;
    //since both are object we cant directly user ==
    if (connectionreq.fromUserId.equals(connectionreq.toUserId)) {
        throw new Error("Schema Error: Cant connect you yourself")
    }
    next();
})

const connectionModel = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = connectionModel;