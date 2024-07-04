import { Router } from 'express';
import ReferralService from '../services/referralService';

const router = Router();

router.post('/reward/:referralId', async (req, res) => {
  try {
    const { referralId } = req.params;
    const result = await ReferralService.rewardReferral(referralId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
