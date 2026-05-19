const express = require('express');

const app = express();

app.use('/user',(req,res,next)=>{ 
    // app.use, app.get, app.post etc can take multiple callbacks, res.send will stop the callback there
    // next moves execution to next callback
    console.log("First app.use");
    next();
},(req,res)=>{
    console.log("second app.use");
    res.send("2nd Response");
})

app.listen(3000,()=>{
    console.log("listening one port 3000");
})