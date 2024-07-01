import express from "express";
import userRouter from "./userRoute";
import authRouter from "./authRoute";
import walletRouter from './walletRoute'

const router = express.Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/wallet", walletRouter);

export default router;
