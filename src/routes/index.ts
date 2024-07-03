import express from "express";
import userRouter from "./userRoute";
import authRouter from "./authRoute";
import walletRouter from "./walletRoute";
import dataRouter from "./dataRoute";
import airtimeRouter from "./airtimeRoute";
import cableRouter from "./cableRoute";
import electricRouter from "./electricRoute";
import beneficiaryRouter from "./beneficiaryRoute";
import educationRouter from "./educationRoute"
import notificationsRouter from "./notificationRoute"

const router = express.Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/wallet", walletRouter);
router.use("/data", dataRouter);
router.use("/airtime", airtimeRouter);
router.use("/cable", cableRouter);
router.use("/electric", electricRouter);
router.use("/beneficiary", beneficiaryRouter);
router.use("/education", educationRouter);
router.use("/notifications", notificationsRouter);

export default router;
