import { MongoClient } from "mongodb";

const url ="mongodb+srv://MadhanR:Madhan23@cluster0.diey8bl.mongodb.net/?retryWrites=true&w=majority"

async function createConnection(){
    const client = new MongoClient(url);
    await client.connect();
console.log("mongodb server connected")
return client; 
}

export const client = await createConnection();