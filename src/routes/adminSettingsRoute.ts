import { Router } from 'express';
import AdminSettingsController from '../controllers/adminSettingsController';

const router = Router();

router.get('/', AdminSettingsController.getSettings);
router.post('/', AdminSettingsController.createSettings);
router.put('/', AdminSettingsController.updateSettings);
router.delete('/', AdminSettingsController.deleteSettings);

export default router;
