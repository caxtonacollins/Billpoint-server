import { Router } from "express";
import dataService from "../services/dataService";
import dataController from "../controllers/dataController";
import { Authenticate } from "../middlewares/guard/Authenticate";

const router = Router();

router.get("/serviceId", dataController.getServiceId);

router.get("/variationCode", dataController.getVariationCodes);

router.post("/dataPurchase", Authenticate, dataController.purchaseData);

export default router;
