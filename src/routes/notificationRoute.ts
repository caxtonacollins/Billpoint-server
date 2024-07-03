import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController';

const router = Router();

router.get('/:user', getNotifications);
router.put('/:id/read', markAsRead);

export default router;
