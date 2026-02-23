import {
  type MRT_RowData,
  type MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, type SxProps, type Theme, CircularProgress } from "@mui/material";
import { type ReactElement, useCallback, useRef, useEffect } from "react";

import type { TemplateType } from "@/pages/template-library/types/template-library.type";
import type { Pagination } from "@/core/types/pagination.type";
import CPagination from "@/core/components/pagination/Pagination";
import { useIsDesktopViewport } from "@/utils/get-viewport-size";
import clsx from "@/utils/clsx";

import "./DataTable.scss";

const SCROLL_THRESHOLD_PIXELS = 300; // Minimum pixels from bottom to trigger
const SCROLL_THRESHOLD_PERCENTAGE = 0.7; // Trigger when scrolled 80% of content
const SCROLL_DEBOUNCE_MS = 100;

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
  enableInfiniteScroll?: boolean;
  onLoadMore?: () => void;
  resetScrollKey?: string | number;
};

export const CDataTable = ({
  tableProps,
  isRowSelected,
  pagination,
  walkMeIdPrefix,
  handlePaginationChange,
  paginationClassName,
  pageSizeOptions,
  isLoading = false,
  showPagination = true,
  enableInfiniteScroll = false,
  onLoadMore,
  resetScrollKey,
  ...props
}: TableProps): ReactElement => {
  const isDesktopView = useIsDesktopViewport();
  const scrollTimeoutRef = useRef<number | null>(null);
  const lastScrollTopRef = useRef<number>(0);
  const isLoadingMoreRef = useRef<boolean>(false);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const shouldUseInfiniteScroll = enableInfiniteScroll || !isDesktopView;
  const hasMoreData = pagination.currentPage < pagination.totalPages;
  const hasExistingData = (tableProps.data?.length ?? 0) > 0;
  const isFirstPage = pagination.currentPage === 1;

  // Show loading indicator only during infinite scroll load more (not initial load)
  // Only show when: infinite scroll enabled + loading + has data + NOT on first page
  const showInfiniteScrollLoader =
    shouldUseInfiniteScroll && isLoading && hasExistingData && !isFirstPage;

  // Reset scroll to top when resetScrollKey changes (e.g., directory change)
  useEffect(() => {
    if (resetScrollKey !== undefined && tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
      lastScrollTopRef.current = 0;
    }
  }, [resetScrollKey]);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      // Only process if scrolling down
      if (scrollTop <= lastScrollTopRef.current) {
        lastScrollTopRef.current = scrollTop;
        return;
      }

      lastScrollTopRef.current = scrollTop;

      if (
        !shouldUseInfiniteScroll ||
        !hasMoreData ||
        isLoading ||
        isLoadingMoreRef.current
      ) {
        return;
      }

      // Calculate scroll position
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Trigger load more when either:
      // 1. Within pixel threshold from bottom, OR
      // 2. Scrolled past percentage threshold
      const isNearBottom =
        distanceFromBottom < SCROLL_THRESHOLD_PIXELS ||
        scrollPercentage >= SCROLL_THRESHOLD_PERCENTAGE;

      if (isNearBottom && onLoadMore) {
        // Debounce to prevent multiple calls
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = window.setTimeout(() => {
          if (!isLoadingMoreRef.current) {
            isLoadingMoreRef.current = true;
            onLoadMore();
            // Reset after a delay to allow next load
            setTimeout(() => {
              isLoadingMoreRef.current = false;
            }, 300);
          }
        }, SCROLL_DEBOUNCE_MS);
      }
    },
    [shouldUseInfiniteScroll, hasMoreData, isLoading, onLoadMore]
  );

  const table = useMaterialReactTable({
    ...tableProps,
    enableStickyHeader: true,
    enablePagination: false,
    enableBottomToolbar: false,
    muiTableContainerProps: shouldUseInfiniteScroll
      ? {
          ref: tableContainerRef,
          onScroll: handleScroll,
        }
      : undefined,
    muiTableBodyRowProps: ({ row }: { row: MRT_Row<MRT_RowData> }) => {
      const bodyRowProps =
        tableProps?.muiTableBodyRowProps &&
        typeof tableProps?.muiTableBodyRowProps === "function"
          ? tableProps?.muiTableBodyRowProps({ row })
          : {};
      return {
        ...bodyRowProps,
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
      };
    },
  });

  return (
    <Box className="data-table">
      <Box
        className={clsx({
          "data-table__table-container": true,
          "data-table__table-container--with-pagination":
            showPagination && !enableInfiniteScroll && isDesktopView,
          "data-table__table-container--infinite-scroll":
            shouldUseInfiniteScroll,
        })}
      >
        <MaterialReactTable
          table={table}
          {...props}
        />
        {showInfiniteScrollLoader && (
          <Box className="data-table__infinite-scroll-loader">
            <CircularProgress
              size={24}
              sx={{ color: "var(--logile-bg-primary)" }}
            />
          </Box>
        )}
      </Box>
      {!isLoading &&
        showPagination &&
        !enableInfiniteScroll &&
        isDesktopView && (
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
