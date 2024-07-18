import { Router } from "express";
import TransactionController from "../controllers/transactionController";
import { Authenticate } from "../middlewares/guard/Authenticate";

const router = Router();

router.get("/:id", TransactionController.getTransactionById);
router.get("/user/:id", TransactionController.getTransactionByUserId);
router.post("/withDrawFromWallet", Authenticate, TransactionController.withDrawFromWallet);

export default router;
