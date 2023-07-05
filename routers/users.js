import express from "express";
import { addUser, findUser } from "../logics/users.js";
import bcrypt from "bcrypt";


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
console.log(user)
if(!user) {
    return res.status(400).json({data:{error:"Invalid email, New user ! Please Signup"}})
}
const validatePass = 
await bcrypt.compare(password,user.password)
if(!validatePass){
    return res.status(400).json({data:{error:"Invalid password"}})
}
const token = generatejwtToken(user._id)
res.status(200).json({data:{token:token}})
} catch (error) {
    console.log(error)
    res.status(400).json({data:{error:"code error"}})
}
})

export const userRouter = router;