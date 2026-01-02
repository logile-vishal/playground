import {
  PAGINATION_EVENT_TYPE,
  PAGINATION_SIZE,
} from "@/core/constants/pagination";

import type { defaultProps } from "./index.type";

export type DirectResponse<T> = {
  data: T;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};

export type Pagination = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage?: boolean | null;
  hasNextPage?: boolean | null;
};

export type PaginationActionProps =
  (typeof PAGINATION_EVENT_TYPE)[keyof typeof PAGINATION_EVENT_TYPE];

export type PaginationSizeProps =
  (typeof PAGINATION_SIZE)[keyof typeof PAGINATION_SIZE];

export type PaginationProps = defaultProps & {
  size?: PaginationSizeProps;
  onChange?: (args: Pagination) => void;
  pagination: Pagination;
  className?: string;
  walkMeIdPrefix: string[];
  pageSizeOptions?: Array<{ label: string; value: number }>;
};
