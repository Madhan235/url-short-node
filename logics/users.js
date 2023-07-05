import { client } from "../db.js";
import jwt from "jsonwebtoken";

export function  addUser(req){
return client.db("bwd45")
.collection("users")
.insertOne(req)
}

export function  findUser(email){
    return client.db("bwd45")
    .collection("users")
    .findOne({email:email})
}

export function generateJwtToken(id){
return jwt.sign({id},process.env.secretkey,{expiresIn:"10d"})
}