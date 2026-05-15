const express = require('express');

const app = express();

app.use("/hello",(req,res)=>{
    console.log("payload : \n")
    console.log(req);
    res.send("Hello hello");
})

app.use("/test",(req,res)=>{
    console.log("payload : \n")
    console.log(req);
    res.send("Hello from the server")
})

app.use("/new",(req,res)=>{
    console.log("payload : \n")
    console.log(req);
    res.send("Hello new")
})


app.listen(3000, ()=>{
    console.log("server listening on port 3000");
});