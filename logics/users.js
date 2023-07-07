import { client, ObjectId} from "../db.js";
import jwt from "jsonwebtoken";

export function  addUser(req){
return client.db("bwd45")
.collection("users")
.insertOne(req)
}

export function findUser(userEmail){
    return client.db("bwd45")
    .collection("users")
    .findOne({email:userEmail})
}

export function generateJwtToken(id){
return jwt.sign({id},process.env.secretkey,{expiresIn:"10d"})
}

export function generateForgetToken(id,password){
return jwt.sign({id,password},process.env.secretkey,{expiresIn:"20s"})
}

export function findUserbyId(id){
    return client.db("bwd45")
    .collection("users")
    .findOne({_id: new ObjectId(id)})
}

export function updatePassword(userEmail,newpassword){
    return client.db("bwd45")
    .collection("users")
    .findOneAndUpdate({_id:new ObjectId(id)},{$set:{password:newpassword}})
    }
    