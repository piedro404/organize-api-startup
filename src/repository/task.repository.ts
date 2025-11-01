import { prismaClient } from "@config/database";
import { Prisma, Task } from "@prisma/client";
import { CreateTaskRequest, UpdateTaskRequest } from "src/schemas/task.schema";
import { QueryRequest } from "src/types/query.request";
import { TaskStatus } from "src/utils/constants";

export interface CreateTaskDTO extends CreateTaskRequest {
    userId: number;
    userHash: string;
}

export default class TaskRepository {
    static async findById(id: number) {
        return await prismaClient.task.findUnique({ where: { id } });
    }

    static async findByExternalId(externalId: string) {
        return await prismaClient.task.findUnique({ where: { externalId } });
    }

    static async findByUser(
        filters: QueryRequest,
        userId?: number,
        userHash?: string
    ) {
        const { name } = filters;
        const where: Prisma.TaskWhereInput = {
            ...(name ? { name: { contains: name } } : {}),
            ...(userId ? { userId } : {}),
            ...(userHash && !userId ? { userHash } : {}),
        };

        return await prismaClient.task.findMany({
            where,
            orderBy: { updatedAt: "asc" },
        });
    }

    static async getTasksGroupedByStatus(
        filters: QueryRequest,
        userId?: number,
        userHash?: string
    ) {
        const tasks = await this.findByUser(filters, userId, userHash);

        const grouped = tasks.reduce((acc, task) => {
            const status = task.status || "unknown";
            if (!acc[status]) acc[status] = [];
            acc[status].push(task);
            return acc;
        }, {} as Record<string, typeof tasks>);

        return grouped;
    }

    static async createTask(data: CreateTaskDTO) {
        const createData: any = {
            title: data.title,
            description: data.description || null,
            status: data.status || TaskStatus.TO_DO,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            userId: data.userId,
        };

        if (!data.userId && data.userHash) {
            createData.userHash = data.userHash;
        }

        return await prismaClient.task.create({
            data: createData,
        });
    }

    static async updateTask(id: number, data: UpdateTaskRequest, model?: Task) {
        const updateData: any = {
            title: data.title,
            description: data.description,
            status: data.status,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        };

        if (model && data.status !== undefined) {
            if (model.status !== TaskStatus.COMPLETED && updateData.status === TaskStatus.COMPLETED) {
                updateData["completedAt"] = new Date();
            } else {
                updateData["completedAt"] = null;
            }
        }

        return await prismaClient.task.update({
            where: { id },
            data: updateData,
        });
    }

    static async deleteTask(id: number) {
        return await prismaClient.task.delete({
            where: { id },
        });
    }
}
