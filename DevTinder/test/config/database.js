const mongoose = require('mongoose');

const urldevTinder = "mongodb+srv://vamsi:vamsi@cluster0.rpx0i0o.mongodb.net/?appName=Cluster0/devTinder"

const connectDB =async()=>{
    await mongoose.connect(urldevTinder);
}

module.exports = connectDB;
