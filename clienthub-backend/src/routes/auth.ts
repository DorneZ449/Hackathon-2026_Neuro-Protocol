import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.get('/me', authMiddleware, getMe);

export default router;
