import { Router } from 'express';
import AdminController from '../controllers/adminController';

const router = Router();

router.get('/totalUsers', AdminController.getTotalUsers);
router.get('/totalWalletBalance', AdminController.getTotalWalletBalance);
router.get('/totalTransactions', AdminController.getTotalTransactions);
router.get('/totalTodayTransactions', AdminController.getTotalTodayTransactions);
router.get('/totalAgents', AdminController.getTotalAgents);
router.get('/totalSalesForTheDay', AdminController.getTotalSalesForTheDay);
router.get('/totalCommissionForTheDay', AdminController.getTotalCommissionForTheDay);

export default router;