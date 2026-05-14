import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Ruta de registro
router.post('/register', AuthController.register);

// Ruta de login
router.post('/login', AuthController.login);

// Actualizar perfil (protegido)
router.put('/profile', authMiddleware, AuthController.updateProfile);

export default router;
