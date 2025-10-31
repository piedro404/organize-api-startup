import { signup, login, me, updateProfile } from '@controllers/auth.controller';
import { Router } from 'express';
import authMiddleware from 'src/middlewares/auth.middleware';

const router = Router();

export default router;
