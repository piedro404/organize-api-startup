import { UnprocessableEntityException } from "src/exceptions/validation"; 

export function isFileTypeValid(file: Express.Multer.File, validTypes: string[], path: string[]): void {
    if (!file || !file.mimetype) {
        throw new UnprocessableEntityException("File is required");
    }
    if (!validTypes.includes(file.mimetype)) {
        throw new UnprocessableEntityException("Invalid file type", [
            {
                code: "custom",
                path: path,
                message: "Tipo de arquivo inválido. Esperado: " + validTypes.join(", ") + ".",
            }
        ]);
    }
}