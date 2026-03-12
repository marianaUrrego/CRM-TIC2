import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// Ruta de registro
router.post('/register', AuthController.register);

// Ruta de login
router.post('/login', AuthController.login);

export default router;
