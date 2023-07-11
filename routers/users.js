import express from "express";
import { addUrl, addUser, findUser, findUserbyId, generateForgetToken, generateJwtToken, updatePassword } from "../logics/users.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import shortid from "shortid";
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
    res.status(400).json({data:{error:error.message}})
}
})

router.post("/forget",async function(req,res){
   try {
    const {email} = req.body;
const user = await findUser(email)
if(!user){
    return res.status(404).json({data:{error:"email not registered"}})
}
const token =  generateForgetToken(user._id,user.password);
const link = `https://mellifluous-lebkuchen-9bef5e.netlify.app/${user._id}/${token}`

let transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"msouljar@gmail.com",
        pass:"yhqilsstocvicqoc",
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
       return  res.send(err.message)
    } else{
        console.log("email sent successfully")
        res.status(200).json({data:{id:user._id,token:token,message:"email successfully sent"}})
    }
})

   } catch (error) {
    res.send(error.message);
   }    
})

router.post(`/reset/:id/:token`,async (req,res)=>{
    try {
        const id = req.params.id; 
        const token = req.params.token;
        
          
        const {password,confirm} = req.body
    const user = await findUserbyId(id);
    const secret = process.env.secretkey + user.password;
    const verifyToken = jwt.verify(token,secret) 
    if(!user){
        return res.status(404).json({data:{error:"Invalid Id"}})
    }
 
if(password === "" ||  confirm === ""){
  return res.status(400).json({data:{error:"invalid details"}})  
}
if(password !== confirm) {
  return res.status(400).json({data:{error:"password doesnot match"}})  
}
const salt = await bcrypt.genSalt(10);
const newhashedPassword = await bcrypt.hash(password,salt)
// const newhashedUser = {...req.body,password:newhashedPassword}
    const result = await updatePassword(id,newhashedPassword)
    
     
    
    res.status(200).json({data:{result:result,
        message:"password successfully changed"}})

    } catch (error) {
        console.log(error)
        res.status(400).json({data:{error:error.message}})
    }
})

router.post("/shortner",async (req,res)=>{
    try {
        const {url} = req.body
        if(!url){
          return res.status(400).json({data:{error:"no url"}})
        }
       const shortUrl =  shortid.generate(url)
   const newUrl = {longUrl:url,shortUrl:shortUrl}
         const dataInfo = await addUrl(newUrl);
         res.status(200).json({data:{longUrl:url,shortUrl:shortUrl,dataInfo:dataInfo}});
    
    } catch (error) {
        res.send(error.message)
    }
    })

export const userRouter = router;