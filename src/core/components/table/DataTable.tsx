import {
  type MRT_RowData,
  type MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, type SxProps, type Theme } from "@mui/material";

import type { TemplateType } from "@/pages/template-library/types/template-library.type";
import type { Pagination } from "@/core/types/pagination.type";
import CPagination from "@/core/components/pagination/Pagination";

import "./DataTable.scss";

export type TableProps = {
  tableProps;
  isRowSelected?: (rowData: TemplateType) => boolean;
  muiTableStyleProps?: SxProps<Theme>;
  pagination: Pagination;
  walkMeIdPrefix: string[];
  isLoading?: boolean;
  showPagination?: boolean;
  handlePaginationChange: (newPagination: Pagination) => void;
  paginationClassName?: string;
  pageSizeOptions?: Array<{ label: string; value: number }>;
};

export const CDataTable = ({
  tableProps,
  isRowSelected,
  muiTableStyleProps,
  pagination,
  walkMeIdPrefix,
  handlePaginationChange,
  paginationClassName,
  pageSizeOptions,
  isLoading = false,
  showPagination = true,
  ...props
}: TableProps) => {
  const table = useMaterialReactTable({
    ...tableProps,
    enableStickyHeader: true,
    muiTableContainerProps: {
      sx: {
        "& .MuiTableHead-root": {
          backgroundColor: "var(--logile-bg-table-header)",
        },
        "& tbody": {
          bgcolor: "var(--logile-bg-table-row)",
        },
        "& th": {
          backgroundColor: "var(--logile-bg-table-header)",
        },
        "& td": {
          color: "var(--logile-text-primary)",
        },
        "& tr.MuiTableRow-root:hover": {
          backgroundColor: "var(--logile-bg-primary-x-subtle)",
        },
        "& .MuiTableRow-root:hover td:after": {
          backgroundColor: "transparent",
        },
        ...(muiTableStyleProps && muiTableStyleProps),
      },
    },
    muiTableBodyRowProps: ({ row }: { row: MRT_Row<MRT_RowData> }) => ({
      hover:
        isRowSelected && isRowSelected(row.original as TemplateType)
          ? false
          : true,
      sx: {
        backgroundColor:
          isRowSelected && isRowSelected(row.original as TemplateType)
            ? "var(--logile-bg-primary-x-subtle)"
            : "inherit",
        transition: "backgroundColor 1s",
      },
    }),
  });
  return (
    <Box className="data-table">
      <Box className="data-table__table-container">
        <MaterialReactTable
          table={table}
          {...props}
        />
      </Box>
      {!isLoading && (
        <Box className="data-table__pagination-container">
          <CPagination
            pagination={pagination}
            walkMeIdPrefix={walkMeIdPrefix}
            size="large"
            onChange={handlePaginationChange}
            className={paginationClassName}
            pageSizeOptions={pageSizeOptions}
            showPagination={showPagination}
          />
        </Box>
      )}
    </Box>
  );
};
