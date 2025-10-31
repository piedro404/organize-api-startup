import { ErrorCodes, HTTP_STATUS } from "src/utils/constants";
import { HttpException } from "./root";

export class BadRequestException extends HttpException {
    constructor(message: string, errorCode: ErrorCodes, errors: any = null) {
        super(message, errorCode, HTTP_STATUS.BAD_REQUEST, errors);
    }
}