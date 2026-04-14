import { Router } from 'express';
import { updateProfile } from '../controllers/profileController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.put('/update', authMiddleware, updateProfile);

export default router;
