import { vi } from "vitest";
import type { MRT_ColumnDef, MRT_TableOptions } from "material-react-table";
import type { Pagination } from "@/core/types/pagination.type";
import type { TemplateType } from "@/pages/template-library/types/template-library.type";
import type { TableProps } from "../../DataTable";

// Mock data
export const mockTemplateData: TemplateType[] = [
  {
    templateId: 1,
    templateName: "Template 1",
    status: "Active",
    createdTime: "2024-01-01",
    lastModifiedTime: "2024-01-02",
    iconName: "icon1",
    iconColour: "blue",
  },
  {
    templateId: 2,
    templateName: "Template 2",
    status: "Inactive",
    createdTime: "2024-01-03",
    lastModifiedTime: "2024-01-04",
    iconName: "icon2",
    iconColour: "red",
  },
  {
    templateId: 3,
    templateName: "Template 3",
    status: "Active",
    createdTime: "2024-01-05",
    lastModifiedTime: "2024-01-06",
    iconName: "icon3",
    iconColour: "green",
  },
];

export const mockPagination: Pagination = {
  currentPage: 1,
  pageSize: 10,
  totalPages: 5,
  totalItems: 50,
  hasPreviousPage: false,
  hasNextPage: true,
};

export const mockColumns: MRT_ColumnDef<TemplateType>[] = [
  {
    accessorKey: "templateName",
    header: "Template Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdTime",
    header: "Created Time",
  },
];

export const mockTableOptions: MRT_TableOptions<TemplateType> = {
  columns: mockColumns,
  data: mockTemplateData,
  enablePagination: false,
  enableSorting: true,
  enableColumnActions: false,
  enableColumnFilters: false,
  enableGlobalFilter: false,
  enableRowSelection: false,
};

// Mock functions
export const mockHandlePaginationChange = vi.fn();
export const mockIsRowSelected = vi.fn((rowData: TemplateType) => {
  return rowData.templateId === 1;
});

// Mock props
export const mockDefaultProps: TableProps = {
  tableProps: mockTableOptions,
  pagination: mockPagination,
  walkMeIdPrefix: ["test", "datatable"],
  handlePaginationChange: mockHandlePaginationChange,
  isLoading: false,
  showPagination: true,
};

export const mockPropsWithRowSelection: TableProps = {
  ...mockDefaultProps,
  isRowSelected: mockIsRowSelected,
};

export const mockPropsWithLoading: TableProps = {
  ...mockDefaultProps,
  isLoading: true,
};

export const mockPropsWithoutPagination: TableProps = {
  ...mockDefaultProps,
  showPagination: false,
};

export const mockPropsWithCustomStyles: TableProps = {
  ...mockDefaultProps,
  muiTableStyleProps: {
    maxHeight: "500px",
    backgroundColor: "lightgray",
  },
};

export const mockPropsWithPaginationOptions: TableProps = {
  ...mockDefaultProps,
  pageSizeOptions: [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
  ],
  paginationClassName: "custom-pagination-class",
};

export const mockPropsWithEmptyData: TableProps = {
  ...mockDefaultProps,
  tableProps: {
    ...mockTableOptions,
    data: [],
  },
};

export const mockUpdatedPagination: Pagination = {
  currentPage: 2,
  pageSize: 20,
  totalPages: 5,
  totalItems: 50,
  hasPreviousPage: true,
  hasNextPage: true,
};

// Reset function
export const resetAllMocks = () => {
  mockHandlePaginationChange.mockReset();
  mockIsRowSelected.mockReset();
};
