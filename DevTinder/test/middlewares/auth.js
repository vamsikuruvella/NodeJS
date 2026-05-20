const adminAuth = (req,res,next)=>{
    const token = "hbiub";
    const isAuthorized = token==="ubiu";
    
    if(!isAuthorized){
        
        res.status(401).send("Not Authorized");
    }else{
        res.isAuthorized=true;
    }
}

module.exports ={adminAuth};