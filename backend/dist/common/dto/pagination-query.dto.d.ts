export declare class PaginationQueryDto {
    page?: number;
    limit?: number;
}
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}
export declare function resolvePagination(query: PaginationQueryDto): {
    page: number;
    limit: number;
    skip: number;
};
export declare function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta;
