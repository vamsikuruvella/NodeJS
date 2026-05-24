const mongoose = require('mongoose');

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
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
        max: 120
    },
    gender: {
        type: String,
        validate(value) {
            value.toLowerCase();
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Not valid gender");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://picsum.photos/200/300"
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

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;