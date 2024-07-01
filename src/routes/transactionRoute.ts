import {Router} from 'express'
import TransactionController from '../controllers/transactionController'

const router = Router()

router.get("/:id", TransactionController.getTransactionById)
router.get("/user/:id", TransactionController.getTransactionByUserId)

export default router
