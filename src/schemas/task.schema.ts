import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, "Titulo é obrigatório"),
  description: z.string().optional(),
  status: z.enum(['to_do', 'in_progress', 'completed']).optional(),
  dueDate: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskRequest = z.infer<typeof createTaskSchema>;
export type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;
