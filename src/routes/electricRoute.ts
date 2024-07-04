import { Router } from "express";
import { verifyCustomer } from "../helpers/vtpassHelpers";
import electricController from "../controllers/electricController";

const router = Router();

router.post("/purchase", electricController.purchaseElectricity);
router.get("/verifyCustomer", verifyCustomer);

export default router;
