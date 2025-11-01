import { Request } from "express";
import { UnauthorizedException } from "src/exceptions/unauthorized";
import { ErrorCodes } from "src/utils/constants";

export default class UserService {
    static async getUser(req: Request) {
        const user = req.user;
        const authHeader = req.headers.authorization_hash;
        const userHash = Array.isArray(authHeader) ? authHeader[0] : authHeader;

        if (!user && !userHash) {
            throw new UnauthorizedException(
                "Não tem nenhum usuário autenticado ou hash de usuário fornecido.",
                ErrorCodes.UNAUTHORIZED
            );
        }

        return { user, userHash };
    }
}
