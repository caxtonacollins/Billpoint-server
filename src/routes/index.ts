import express from "express";
import userRouter from "./userRoute";
import authRouter from "./authRoute";

const router = express.Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);

export default router;
