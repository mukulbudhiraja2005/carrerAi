const jwt=require("jsonwebtoken");
const User=require("../models/User");
const { headers } = require("next/headers");
const protect=async(req,res,next)=>{
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token=req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return res.status(401).json({
                message:"not authorized,no token"
            });
        }

        // verify token
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        // GET USER FROM DB
        req.user=await User.findById(decoded.id).select("-password");
        next();
        console.log("TOKEN =>", token);
console.log("SECRET =>", process.env.JWT_SECRET);

    }
    catch(error){
        console.log(error);
        res.status(401).json({
            message:"not authorized,token failed"
        });
    }
}
module.exports=protect;