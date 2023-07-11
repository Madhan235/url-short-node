import express from "express";

const router = express.Router();

router.get("/url",async ()=>{
    try {
   res.send("working fine")
        
    } catch (error) {
        res.send(error.message)
    }
})

export const dataRouter = router;