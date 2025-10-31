import { ApiResponse } from '../types/api.response.js';
import { ErrorCodes } from './constants.js';

/**
 * Monta uma resposta de sucesso
 * @param data - dados do payload
 * @param message - mensagem opcional
 */
export function success<T>(message = 'Success', data?: T): ApiResponse<T> {
  return {
    status: true,
    message,
    data,
  };
}

/**
 * Monta uma resposta de erro
 * @param message - mensagem do erro
 * @param errorCode - código do erro opcional
 * @param error - descrição interna do erro
 */
export function failure(message: string, errorCode: ErrorCodes, errors?: any[]): ApiResponse<null> {
  return {
    status: false,
    message,
    errorCode, 
    errors,
  };
}
