import express from "express";
import { getUrlData } from "../logics/users.js";

const router = express.Router();

router.get("/url",async (req,res)=>{
    try {
   const urlData = await getUrlData();
   res.status(200).json({data:urlData});
        
    } catch (error) {
        res.send(error.message)
    }
})

export const dataRouter = router;