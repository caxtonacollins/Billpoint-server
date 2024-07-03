import {Router} from 'express'
import WalletController from '../controllers/walletController'
import { vtpassWalletBalance } from '../helpers/vtpassHelpers'

const router = Router()

// VTPass Wallet Balance
router.get("/balance", vtpassWalletBalance)

// Bill Point
router.get("/:id", WalletController.getWalletById)
router.get("/user/:id", WalletController.getWalletByUserId)

export default router
