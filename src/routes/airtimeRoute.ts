import { Router } from "express";
import airtimeService from "../services/airtimeService";

const router = Router();

router.post("/purchase", airtimeService.buyAirtime);

export default router;
