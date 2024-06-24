import { Router } from "express";
import AuthController from "../controllers/authController";
import { Authenticate } from "../middlewares/guard/Authenticate";

const router = Router();

router.post("/verify-email", AuthController.verifyEmail);

router.post("/set-transaction-pin", Authenticate, AuthController.setTransactionPin);

router.post("/login", AuthController.login);

router.post("/checkIfEmailExistAndSendToken", AuthController.checkIfEmailExistAndSendToken);

router.post("/verifyOtp", AuthController.verifyOtp);

router.post("/setPassword", AuthController.setPassword);

router.post("/resendOtp", AuthController.resendOtp)

export default router;
