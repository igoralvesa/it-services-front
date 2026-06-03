import { Router } from 'express';
import { changePassword, login, me, registerClient } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';

export const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.post('/change-password', changePassword);
authRoutes.post('/register', registerClient);
authRoutes.get('/me', authenticate, me);
