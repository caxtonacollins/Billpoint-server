import { Router } from "express";
import dataService from "../services/dataService";

const router = Router();

router.get("/serviceId", dataService.getServiceId);

router.get("/variationCode", dataService.getVariationCodes);

router.post("/dataPurchase", dataService.buyData);

export default router;
