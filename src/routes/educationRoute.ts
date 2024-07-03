import { Router } from 'express';
import educationService from '../services/educationalService';

const router = Router();

router.post('/WAEC-tokenPurchase', educationService.educationPurchase);

export default router;
