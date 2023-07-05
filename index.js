import express from "express";
import dotenv from "dotenv";
import {userRouter}  from "./routers/users.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/users",userRouter)







app.listen( process.env.PORT,()=>console.log("localhost running on process.env.Port"))