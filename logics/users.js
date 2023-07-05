import { client } from "../db.js";

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