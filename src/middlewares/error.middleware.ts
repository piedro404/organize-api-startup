import { logger } from "@config/logger";
import { NextFunction, Request, Response } from "express";
import { HttpException } from "src/exceptions/root";
import { ErrorCodes, HTTP_STATUS } from "src/utils/constants";
import { failure } from "src/utils/response";
import z from "zod";

export const errorMiddleware = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof z.ZodError) {
        return res
            .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
            .json(
                failure(
                    "Validation Error",
                    ErrorCodes.VALIDATION_ERROR,
                    error?.issues
                )
            );
    }

    if (error instanceof HttpException) {
        return res
            .status(error.statusCode)
            .json(failure(error.message, error.errorCode, error.errors));
    }

    logger.error({ error: error }, "Internal Server Error");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
        message: error.message,
    });
};
