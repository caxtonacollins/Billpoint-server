import { Router } from "express";
import airtimeService from "../services/airtimeService";
import airtimeController from "../controllers/airtimeController";

const router = Router();

router.post("/purchase", airtimeController.purchaseAirtime);

export default router;
