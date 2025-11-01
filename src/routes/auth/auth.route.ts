import { signup, login, me, updateProfile } from '@controllers/auth.controller';
import { Router } from 'express';
import taskRouter from './tasks/task.route'

import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.post('/login', login);

router.post('/register', signup);

router.use(authMiddleware);

router.get('/me', me);

router.put('/update-profile', updateProfile);

router.use('/tasks', taskRouter)

export default router;
