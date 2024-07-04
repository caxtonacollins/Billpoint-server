import { Router } from "express";
import dataService from "../services/dataService";
import dataController from "../controllers/dataController";

const router = Router();

router.get("/serviceId", dataController.getServiceId);

router.get("/variationCode", dataController.getVariationCodes);

router.post("/dataPurchase", dataController.purchaseData);

export default router;
