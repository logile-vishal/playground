import type { Pagination, PaginationProps } from "@/core/types/pagination.type";
import { PAGINATION_SIZE } from "@/core/constants/pagination";
import { vi } from "vitest";

/**
 * Mock pagination data for testing
 */
export const mockPaginationData: Pagination = {
  currentPage: 1,
  pageSize: 50,
  totalPages: 10,
  totalItems: 500,
  hasPreviousPage: false,
  hasNextPage: true,
};

export const mockPaginationDataSinglePage: Pagination = {
  currentPage: 1,
  pageSize: 50,
  totalPages: 1,
  totalItems: 10,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const mockPaginationDataMiddlePage: Pagination = {
  currentPage: 5,
  pageSize: 50,
  totalPages: 10,
  totalItems: 500,
  hasPreviousPage: true,
  hasNextPage: true,
};

export const mockPaginationDataLastPage: Pagination = {
  currentPage: 10,
  pageSize: 50,
  totalPages: 10,
  totalItems: 500,
  hasPreviousPage: true,
  hasNextPage: false,
};

export const mockPaginationDataEmpty: Pagination = {
  currentPage: 1,
  pageSize: 50,
  totalPages: 0,
  totalItems: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const mockPaginationDataSmallDataset: Pagination = {
  currentPage: 1,
  pageSize: 50,
  totalPages: 1,
  totalItems: 5,
  hasPreviousPage: false,
  hasNextPage: false,
};

/**
 * Mock page size options
 */
export const mockPageSizeOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

export const mockCustomPageSizeOptions = [
  { label: "5", value: 5 },
  { label: "15", value: 15 },
  { label: "25", value: 25 },
];

/**
 * Mock onChange handler function
 */
export const mockOnChange = vi.fn();

/**
 * Mock generateId function
 */
export const mockGenerateId = vi.fn((paths: string[]) => {
  if (paths.length === 0 || !Array.isArray(paths)) return undefined;
  return `LOGILE-TEST-${paths.join("-").toUpperCase()}`;
});

/**
 * Mock useWalkmeId hook
 */
export const mockUseWalkmeId = {
  generateId: mockGenerateId,
};

/**
 * Mock useCommonTranslation hook
 */
export const mockUseCommonTranslation = {
  PAGINATION: {
    pageLabel: "Page",
    ofLabel: "of",
  },
};

/**
 * Default props for CPagination component
 */
export const mockDefaultPaginationProps: PaginationProps = {
  pagination: mockPaginationData,
  walkMeIdPrefix: ["test"],
  onChange: mockOnChange,
  size: PAGINATION_SIZE.large,
  showPagination: true,
  pageSizeOptions: mockPageSizeOptions,
};

export const mockSmallSizePaginationProps: PaginationProps = {
  pagination: mockPaginationData,
  walkMeIdPrefix: ["test"],
  onChange: mockOnChange,
  size: PAGINATION_SIZE.small,
  showPagination: true,
};

export const mockPaginationPropsWithCustomOptions: PaginationProps = {
  pagination: mockPaginationData,
  walkMeIdPrefix: ["test"],
  onChange: mockOnChange,
  pageSizeOptions: mockCustomPageSizeOptions,
  showPagination: true,
};

export const mockPaginationPropsHidden: PaginationProps = {
  pagination: mockPaginationData,
  walkMeIdPrefix: ["test"],
  onChange: mockOnChange,
  showPagination: false,
};

export const mockPaginationPropsNoCallback: PaginationProps = {
  pagination: mockPaginationData,
  walkMeIdPrefix: ["test"],
  showPagination: true,
};

/**
 * Reset all mocks
 */
export const resetMocks = () => {
  mockOnChange.mockClear();
  mockGenerateId.mockClear();
};
