import { ErrorCodes } from "src/utils/constants";

export class HttpException extends Error {
    message: string;
    errorCode: ErrorCodes;
    statusCode: number;
    errors: any;

    constructor(message: string, errorCode: ErrorCodes, statusCode: number, errors: any = null) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors;
    }
}