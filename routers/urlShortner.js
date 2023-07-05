import express from "express";

const router = express.Router();

router.get("/shortner",(req,res)=>{
res.send("Authenticated");
})

export const urlRouter = router;