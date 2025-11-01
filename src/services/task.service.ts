import { Request } from "express";
import { UnauthorizedException } from "src/exceptions/unauthorized";
import TaskRepository from "src/repository/task.repository";
import { ErrorCodes } from "src/utils/constants";

export default class TaskService {
    static async getTaskByUser(
        externalId: string,
        userId?: number,
        userHash?: string
    ) {
        const existingTask = await TaskRepository.findByExternalId(externalId);
        if (!existingTask) {
            throw new UnauthorizedException(
                "Tarefa não encontrada.",
                ErrorCodes.NOT_FOUND
            );
        }

        if (
            (userId && existingTask.userId !== userId) ||
            (userHash && existingTask.userHash !== userHash)
        ) {
            throw new UnauthorizedException(
                "Você não tem permissão para atualizar esta tarefa.",
                ErrorCodes.UNAUTHORIZED
            );
        }

        return existingTask;
    }
}
