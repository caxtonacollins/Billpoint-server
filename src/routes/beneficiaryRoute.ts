import { Router } from 'express';
import { addBeneficiary, getBeneficiaries } from '../controllers/beneficiaryController';

const router = Router();

router.post('/', addBeneficiary);
router.get('/', getBeneficiaries);

export default router;
