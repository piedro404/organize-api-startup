import { Task } from "@prisma/client";

export type TaskResource = Omit<Task, 'id' | 'userId' | 'userHash'>;

export function toTaskResource(Task: Task): TaskResource {
  const { id, userId, userHash, ...rest } = Task;
  return {
    ...rest,
  };
}

export function toTasksResource(Tasks: Task[]): TaskResource[] {
  return Tasks.map(toTaskResource);
}

export function toGroupedTasksResource(groupedTasks: Record<string, Task[]>): Record<string, TaskResource[]> {
  const resource: Record<string, TaskResource[]> = {};
  for (const status in groupedTasks) {
    resource[status] = toTasksResource(groupedTasks[status]);
  }
  return resource;
}