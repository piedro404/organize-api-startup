import { createTask, deleteTask, getTask, getTasks, updateTask } from '@controllers/task.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getTasks)

router.post('/', createTask)

router.get('/:externalId', getTask)

router.put('/:externalId', updateTask)

router.delete('/:externalId', deleteTask)

export default router;
