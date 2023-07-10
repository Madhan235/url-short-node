import express from "express";

const router = express.Router();

router.get("/geturl",async ()=>{
    console.log("working fine")
})

export const dataRouter = router;