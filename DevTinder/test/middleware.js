const express = require('express');

const app = express();

app.use('/admin',(req,res,next)=>{
    const token = "hbiub";
    const isAuthorized = token==="ubiu";
    
    if(!isAuthorized){
        
        res.status(401).send("Not Authorized");
    }else{
        res.isAuthorized=true;
    }
})

app.get('/admin/getData',(req,res)=>{
    res.send("All Data User Authorized: "+res.isAuthorized);
});

// app.user('/user',[cb1,cb2,cb3,cb4]);

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