const req = require('express/lib/request');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email Address");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    membershipPlan: {
        type: String,
    },
    age: {
        type: Number,
        min: 18,
        max: 120
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Not valid gender");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://picsum.photos/200/300",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo URL");
            }
        }
    },
    about: {
        type: String,
        default: "This is Default"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
})

userSchema.index({ firstName: 1, lastName: 1 });

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;