import { Router } from "express";
import cableController from "../services/cableService";

const router = Router();

router.post('/purchase', cableController.cablePurchase)

export default router