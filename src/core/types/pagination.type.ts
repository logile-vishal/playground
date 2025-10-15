export type DirectResponse<T> = {
  success: boolean,
  message: string,
  data: T;
}

export type PaginatedResponse<T> = {
  success: boolean,
  message: string,
  data: T[];
  pagination: Pagination;
}

export type Pagination = {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasPreviousPage?: boolean | null;
    hasNextPage?: boolean | null;
}