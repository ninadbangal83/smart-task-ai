import { Router } from 'express';
import { AuthController } from '@api/controllers/auth.controller';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

export { router as authRouter };
export const handleAuthRoutes = undefined; // Clean up old reference if any, or just omit
