import { Router } from "express";
import electricService from "../services/electricService";
import {verifyCustomer} from '../helpers/vtpassHelpers'

const router = Router();

router.post("/purchase", electricService.electricProduct);
router.get('/verifyCustomer', verifyCustomer)

export default router;
