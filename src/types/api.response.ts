export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data?: T;
    errorCode?: string;
    errors?: string[];
}