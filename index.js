import express from "express";
import dotenv from "dotenv";
import {userRouter}  from "./routers/users.js";
import cors from "cors";
import { isAuthenticated } from "./routers/auth.js";
import { urlRouter } from "./routers/urlShortner.js";
import nodemailer from "nodemailer";
import { findUserbyId } from "./logics/users.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/users",userRouter)
app.use("/url",isAuthenticated,urlRouter)

 const userid ='64a3f5322262c4fe0ecaf0f3';
 const user = await findUserbyId(userid);
 console.log(user);





app.listen( process.env.PORT,()=>console.log("localhost running on process.env.Port"))