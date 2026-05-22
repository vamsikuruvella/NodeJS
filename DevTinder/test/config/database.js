const mongoose = require('mongoose');

const urldevTinder = "mongodb+srv://vamsi:vamsi@cluster0.rpx0i0o.mongodb.net/devTinder?appName=Cluster0/"

const connectDB =async ()=>{
    await mongoose.connect(urldevTinder);
}

module.exports = connectDB;
