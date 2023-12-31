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
    const secret = process.env.secretkey + password
return jwt.sign({id},secret,{expiresIn:"1m"})
}

export function findUserbyId(id){
    return client.db("bwd45")
    .collection("users")
    .findOne({_id: new ObjectId(id)})
}

export function updatePassword(id,newpassword){
    return client.db("bwd45")
    .collection("users")
    .findOneAndUpdate({_id: new ObjectId(id)},{$set:{password:newpassword}})
    }
    
    export function addUrl(req){
        return client.db("bwd45")
        .collection("url")
        .insertOne(req)
    }
    
    export function getUrlData(){
        return client.db("bwd45")
        .collection("url")
        .find().toArray()
    }