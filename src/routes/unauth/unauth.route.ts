import { Router } from 'express';
import taskRouter from './tasks/task.route'

const router = Router();

router.use('/tasks', taskRouter);

export default router;
