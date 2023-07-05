import jwt from "jsonwebtoken"

export function isAuthenticated (req,res,next){
const token = req.headers["auth-token"]
if(!token){
     return res.status(400).json({data:{error:"Invalid Authorization"}})
    }
jwt.verify(token,process.env.secretkey)
        next();
}