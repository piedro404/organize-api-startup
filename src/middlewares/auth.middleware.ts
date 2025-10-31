import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@config/index";
import UserRepository from "src/repository/user.repository";
import { logger } from "@config/logger";
import { UnauthorizedException } from "src/exceptions/unauthorized";
import { ErrorCodes } from "src/utils/constants";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new UnauthorizedException("No token provided", ErrorCodes.TOKEN_MISSING);
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : authHeader.trim();

    if (!token) {
        throw new UnauthorizedException("No token provided", ErrorCodes.TOKEN_MISSING);
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        const user = await UserRepository.findByExternalId(payload.externalId);

        if (!user) {
            throw new UnauthorizedException("Token is invalid", ErrorCodes.TOKEN_INVALID);
        }

        req.user = user;
        next();
    } catch (error) {
        throw new UnauthorizedException("Token is invalid", ErrorCodes.TOKEN_INVALID);
    }
};

export default authMiddleware;
