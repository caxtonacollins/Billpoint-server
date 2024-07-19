import { Router } from "express";
import TransactionController from "../controllers/transactionController";
import { Authenticate } from "../middlewares/guard/Authenticate";

const router = Router();

router.post("/withDrawFromWallet", Authenticate, TransactionController.withDrawFromWallet);
router.post("/authorizeTransfer", Authenticate, TransactionController.authorizeTransfer);
router.get("/:id", TransactionController.getTransactionById);
router.get("/user/:id", TransactionController.getTransactionByUserId);

export default router;
