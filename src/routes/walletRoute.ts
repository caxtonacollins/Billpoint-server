import {Router} from 'express'
import WalletController from '../controllers/walletController'

const router = Router()

router.get("/:id", WalletController.getWalletById)
router.get("/user/:id", WalletController.getWalletByUserId)

export default router
