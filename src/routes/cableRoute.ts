import { Router } from "express";
import cableController from "../controllers/cableController";

const router = Router();

router.post('/purchase', cableController.cablePurchase)

export default router