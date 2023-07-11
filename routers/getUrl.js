import express from "express";

const router = express.Router();

router.get("/url",async ()=>{
    res.send("working fine")
})

export const dataRouter = router;