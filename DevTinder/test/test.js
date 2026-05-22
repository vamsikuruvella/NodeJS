const expresss=require('express');
require('./config/database')
const app = expresss();



app.listen(7777,()=>{
    console.log("Listening on port 7777")
})