import { Router } from "express";
import eduController from "../controllers/educationController";

const router = Router();

router.post("/WAEC-tokenPurchase", eduController.purchaseEdu);

export default router;
