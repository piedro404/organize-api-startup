export interface MetaResponse {
    total?: number;
    page?: number;
    perPage?: number;
    lastPage?: number;
    [key: string]: any;
}