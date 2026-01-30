const express=require("express");
const router=express.Router();

router.post("/generate",async(req,res)=>{
    const{name,email,phone,skills,education,experience}=req.body;
    const resume=`${name} ${email} ${phone} ${skills} ${education} ${experience}`;
    res.json({resume})

});
module.exports=router;