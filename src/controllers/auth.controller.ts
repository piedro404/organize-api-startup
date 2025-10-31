import { Request, Response, NextFunction } from "express";
import { success } from "src/utils/response.js";
import {
    LoginRequest,
    RegisterRequest,
    registerSchema,
    loginSchema,
    UpdateProfileRequest,
    updateProfileSchema,
} from "src/schemas/auth.schema.js";
import { ErrorCodes, HTTP_STATUS } from "src/utils/constants.js";
import { comparePassword, hashPassword } from "src/utils/encryption.js";
import UserRepository from "src/repository/user.repository.js";
import jwt from "jsonwebtoken";
import { AWS_CONFIG, JWT_EXPIRES_IN, JWT_SECRET } from "@config/index";
import { toUserResource } from "src/resources/user.resource";
import { BadRequestException } from "src/exceptions/bad-requests";
import { ConflictException } from "src/exceptions/conflict";
import { UnauthorizedException } from "src/exceptions/unauthorized";
import { NotFoundException } from "src/exceptions/not-found";
import { deleteFromAWSS3, uploadToAWSS3 } from "src/services/aws-s3.service";
import { UnprocessableEntityException } from "src/exceptions/validation";
import { isFileTypeValid } from "src/utils/file-utils";
import { logger } from "@config/logger";

export async function signup(req: Request, res: Response, next: NextFunction) {
    try {
        const registerData: RegisterRequest = registerSchema.parse(req.body);
        const files = req.files as Express.Multer.File[];
        const avatar = files?.find((f) => f.fieldname === "avatar");
        
        if (avatar) {
            isFileTypeValid(avatar, ["image/jpeg", "image/png", "image/jpg", "image/webp"], ["avatar"]);
        }

        let user = await UserRepository.findByEmail(registerData.email);
        if (user) {
            throw new ConflictException("User already exists!", ErrorCodes.EMAIL_ALREADY_EXISTS);
        }

        user = await UserRepository.createUser({
            ...registerData,
            password: await hashPassword(registerData.password),
        });

        if (avatar) {
            const { key } = await uploadToAWSS3(
                {
                    bucket: AWS_CONFIG.bucket,
                    file: avatar,
                    folder: `users/${user.externalId}/`
                }
            )

            user = await UserRepository.updateUser(user.id, { avatar: key } as any);
        }

        return res.status(HTTP_STATUS.CREATED).json(
            success("User registered successfully", {
                user: toUserResource(user),
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const loginData: LoginRequest = loginSchema.parse(req.body);

        let user = await UserRepository.findByEmail(loginData.login);
        if (!user) {
            throw new NotFoundException("User does not exists!", ErrorCodes.USER_NOT_FOUND);
        }
        if (!(await comparePassword(loginData.password, user.password))) {
            throw new UnauthorizedException("Invalid credentials!", ErrorCodes.INVALID_CREDENTIALS);
        }

        const token = jwt.sign({ externalId: user.externalId }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        return res.status(HTTP_STATUS.OK).json(
            success("User logged in successfully", {
                user: toUserResource(user),
                token,
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function me(req: Request, res: Response, next: NextFunction) {
    try {
        return res.status(HTTP_STATUS.OK).json(
            success("User retrieved successfully", {
                user: toUserResource(req.user!),
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const updateData: UpdateProfileRequest = updateProfileSchema.parse(req.body);
        const files = req.files as Express.Multer.File[];
        const avatar = files?.find((f) => f.fieldname === "avatar");

        if (avatar) {
            isFileTypeValid(avatar, ["image/jpeg", "image/png", "image/jpg", "image/webp"], ["avatar"]);
        }

        let user = req.user!;

        if (updateData.password) {
            if (!(await comparePassword(updateData.oldPassword!, user.password))) {
                throw new UnprocessableEntityException("Old password is incorrect", [
                    {
                        code: "custom",
                        path: ["oldPassword"],
                        message: "A senha antiga está incorreta."
                    }
                ]);
            }

            updateData.password = await hashPassword(updateData.password);
        }

        if (avatar) {
            if(user.avatar) {
                await deleteFromAWSS3(AWS_CONFIG.bucket, user.avatar);
            }

            const { key } = await uploadToAWSS3(
                {
                    bucket: AWS_CONFIG.bucket,
                    file: avatar,
                    folder: `users/${user.externalId}/`
                }
            )

            updateData.avatar = key;
        }

        user = await UserRepository.updateUser(user.id, updateData);

        return res.status(HTTP_STATUS.NO_CONTENT).json(
            success("User profile updated successfully")
        );
    } catch (err) {
        return next(err);
    }
}