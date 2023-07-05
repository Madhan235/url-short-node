import jwt from "jsonwebtoken"

export async function isAuthenticated (req,res,next){
const token = req.headers["auth-token"]
if(!token){
     return res.status(400).json({data:{error:"Invalid Authorization"}})
    }
const verfiedToken = jwt.verify(token,process.env.secretkey)
if(!verfiedToken){ 
    return  res.status(400).json({data:
        {error:"Token not match"}})
    }
        next();
}