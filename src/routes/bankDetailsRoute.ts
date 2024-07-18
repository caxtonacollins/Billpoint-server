import {Router} from 'express'
import bankDetailsController from '../controllers/bankDetailsController'
import { Authenticate } from '../middlewares/guard/Authenticate'

const router = Router()

router.post("/", Authenticate, bankDetailsController.createOrUpdateBankDetails)
router.get("/", Authenticate, bankDetailsController.getBankDetails)
export default router