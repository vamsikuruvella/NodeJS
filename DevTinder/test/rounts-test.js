const express = require('express');

const app = express();




app.listen(3000, ()=>{
    console.log("server listening on port 3000");
});

/*
// app.use returns same response for all http methods, use app.get, app.post etc for specific methods
app.use("/route1",(req,res)=>{
    console.log("payload : \n")
    console.log(req);
    res.send("Hello hello");
})

app.use("/route1/subroute",(req,res)=>{
    console.log("payload : \n")
    console.log(req);
    res.send("Hello from the server")
})

app.use("/",(req,res)=>{
    console.log("payload : \n")
    console.log(req);
    res.send("Hello new")
})

app.listen(3000, ()=>{
    console.log("server listening on port 3000");
});
*/

