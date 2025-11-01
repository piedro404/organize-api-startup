import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "src/exceptions/unauthorized";
import TaskRepository from "src/repository/task.repository";
import {
    toGroupedTasksResource,
    toTaskResource,
} from "src/resources/task.resource";
import {
    CreateTaskRequest,
    createTaskSchema,
    UpdateTaskRequest,
    updateTaskSchema,
} from "src/schemas/task.schema";
import TaskService from "src/services/task.service";
import UserService from "src/services/user.service";
import { QueryRequest } from "src/types/query.request";
import { ErrorCodes, HTTP_STATUS } from "src/utils/constants";
import { success } from "src/utils/response.js";

export async function getTasks(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { user, userHash } = await UserService.getUser(req);
        const filters: QueryRequest = req.query;
        const tasksGroupedByStatus =
            await TaskRepository.getTasksGroupedByStatus(
                filters,
                user?.id,
                userHash
            );

        return res.status(HTTP_STATUS.OK).json(
            success("Tarefas recuperadas com sucesso", {
                tasks: toGroupedTasksResource(tasksGroupedByStatus),
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function getTask(req: Request, res: Response, next: NextFunction) {
    try {
        const externalId: string = req.params.externalId;
        const { user, userHash } = await UserService.getUser(req);
        const existingTask = await TaskService.getTaskByUser(
            externalId,
            user?.id,
            userHash
        );

        return res.status(HTTP_STATUS.OK).json(
            success("Tarefa recuperada com sucesso", {
                task: toTaskResource(existingTask),
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function createTask(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const taskData: CreateTaskRequest = createTaskSchema.parse(req.body);
        const { user, userHash } = await UserService.getUser(req);

        let newTaskData: any = {
            ...taskData,
        };
        newTaskData.user_id = user?.id;
        newTaskData.user_hash = userHash;

        const newTask = await TaskRepository.createTask(newTaskData);

        return res.status(HTTP_STATUS.CREATED).json(
            success("Tarefa criada com sucesso", {
                task: toTaskResource(newTask),
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function updateTask(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const externalId: string = req.params.externalId;
        const taskUpdatedData: UpdateTaskRequest = updateTaskSchema.parse(
            req.body
        );
        const { user, userHash } = await UserService.getUser(req);
        const existingTask = await TaskService.getTaskByUser(
            externalId,
            user?.id,
            userHash
        );

        const updatedTask = await TaskRepository.updateTask(
            existingTask.id,
            taskUpdatedData,
            existingTask
        );

        return res.status(HTTP_STATUS.NO_CONTENT).json(
            success("Tarefa atualizada com sucesso", {
                task: toTaskResource(updatedTask),
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function deleteTask(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const externalId: string = req.params.externalId;
        const { user, userHash } = await UserService.getUser(req);
        const existingTask = await TaskService.getTaskByUser(
            externalId,
            user?.id,
            userHash
        );

        await TaskRepository.deleteTask(existingTask.id);

        return res
            .status(HTTP_STATUS.NO_CONTENT)
            .json(success("Tarefa deletada com sucesso", null));
    } catch (err) {
        return next(err);
    }
}
