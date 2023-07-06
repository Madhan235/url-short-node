import express from "express";
import { addUser, findUser, generateForgetToken, generateJwtToken } from "../logics/users.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

const router = express.Router();

router.post("/signup", async (req,res)=>{
try {
const {email,password} = req.body

    if(email === "" || password === ""){
        return res.status(400).json({data:{error:"Invalid details"}})
            }
    const user = await findUser(email);
    if(user){
        return res.status(400).json({data:{error:"Email already Registered"}})
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const hashedUser = {...req.body,password:hashedPassword}
await addUser(hashedUser)
res.status(200).json({data:hashedUser})    
} catch (error) {
    console.log(error)
    res.status(500).json({data:"code error"})
}
})

router.post("/login",async (req,res)=>{
try {
const {email,password} = req.body
    if(email === "" || password === ""){
        return res.status(400).json({data:{error:"Invalid details"}})
            }
const user = await findUser(email)
if(!user) {
    return res.status(400).json({data:{error:"Invalid email, New user ! Please Signup"}})
}
const validatePass = 
await bcrypt.compare(password,user.password)
if(!validatePass){
    return res.status(400).json({data:{error:"Invalid password"}})
}
const token = generateJwtToken(user._id)
res.status(200).json({data:{user:user,token:token}})
} catch (error) {
    console.log(error)
    res.status(400).json({data:{error:"code error"}})
}
})

router.post("/forget",async function(req,res){
    const {email} = req.body;
const user = findUser(email)
if(!user){
    
    return res.status(404).json({data:{error:"email not registered"}})
}
const token =  generateForgetToken(user._id,user.password)
const link = `https://madhan235-url-short-node.onrender.com
/users/reset${user._id}/${token}`

let transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"msouljar@gmail.com",
        pass:"yhqilsstocvicqoc"
    },
});

let mailDetails = {
    from:"msouljar@gmail.com",
    to:`${email}`,
    subject:"Reset Password Link",
    text:`${link}`
}
transporter.sendMail(mailDetails,function(err){
    if(err){
        console.log(err)
        res.status(400).json({error:err})
    } else{
        console.log("email sent successfully")
        res.status(200).json({data:"email successfully sent"})
    }

})

})

// router.get('/reset',)

export const userRouter = router;