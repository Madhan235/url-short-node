import express from "express";
import { addUser, findUser, generateForgetToken, generateJwtToken, updatePassword } from "../logics/users.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";

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
const user = await findUser(email)
if(!user){
    return res.status(404).json({data:{error:"email not registered"}})
}
const token =  generateForgetToken(user._id,user.password);
const link = `http://localhost:3000/reset/${user._id + user.password}`

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
        res.status(200).json({data:{id:user._id,token:token,message:"email successfully sent"}})
    }

})

})

// router.get('/reset/:id/:token', async (req,res,next)=>{
//    try {
//     const {id , token} = req.params;
//     const user = await findUserbyId(id)
//     if(!user){
//         res.status(404).json({data:{error:"Invalid user_id"}})
//     }
//     if(!token){
//         return res.status(404).json({data:{error:"Invalid token"}})}
//     jwt.verify(token,process.env.secretkey)
//      next();
//    } catch (error) {
//     console.log(error)
//     res.send({error:error})
//    } 
// })

router.post("/reset",async (req,res)=>{

    try {
        const {email,password,confirm} = req.body
        const user = await loginUser(email);
    

if(password === "" ||  confirm === ""){
  return res.status(400).json({data:{error:"invalid details"}})  
}
if(password !== confirm) {
  return res.status(400).json({data:{error:"password doesnot match"}})  

}

const salt = await bcrypt.genSalt(10);

const newhashedPassword = await bcrypt.hash(password,salt)
const newhashedUser = {...req.body,password:newhashedPassword}
    const result = await updatePassword(email,newhashedUser)
    
    const token = generateJwtToken(email)
    
    res.status(200).json({data:{newUser:result,
        message:" password successfully changed",token:token}})

    } catch (error) {
        console.log(error)
        res.status(400).json({data:{error:error}})
    }
})


export const userRouter = router;