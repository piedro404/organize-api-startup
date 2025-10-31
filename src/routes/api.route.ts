import { home } from '@controllers/app.controller';
import { Router } from 'express';
import authRouter from './auth/auth.route';
import unauthRouter from './unauth/unauth.route';

const router = Router();

router.get('/', home);

router.use('/unauth', unauthRouter);

router.use('/auth', authRouter);

export default router;
