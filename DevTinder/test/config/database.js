const mongoose = require('mongoose');

const urldevTinder = process.env.DB_SECRET;

const connectDB =async ()=>{
    await mongoose.connect(urldevTinder);
}

module.exports = connectDB;
