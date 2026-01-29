import { useMemo } from "react";
import { Box, type SelectChangeEvent } from "@mui/material";

import type {
  PaginationActionProps,
  PaginationProps,
} from "@/core/types/pagination.type";
import {
  DEFAULT_PAGINATION_SIZE_OPTIONS,
  PAGINATION_EVENT_TYPE,
  PAGINATION_SIZE,
} from "@/core/constants/pagination";
import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";
import { ChevronLeft, ChevronRight } from "@/core/constants/icons";
import CSelect from "@/core/components/form/select/Select";
import CSvgIcon from "@/core/components/icon/Icon";
import CIconButton from "@/core/components/button/IconButton";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";

import "./Pagination.scss";

const defaultPagination = {
  currentPage: 1,
  pageSize: 50,
  totalPages: 1,
  totalItems: 0,
};

const CPagination: React.FC<PaginationProps> = ({
  size = PAGINATION_SIZE.large,
  onChange,
  className,
  pagination = defaultPagination,
  walkMeIdPrefix = [],
  pageSizeOptions = [],
  showPagination = true,
}) => {
  const { PAGINATION } = useCommonTranslation();

  /**
   * @method handlePageClick
   * @description Updates current page for previous/next navigation.
   * @param {PaginationActionProps} actionType - Navigation type: "prev" or "next"
   * @returns {typeof pagination} Updated pagination data
   */
  const handlePageClick = (actionType: PaginationActionProps) => {
    const newPaginationData = { ...pagination };
    if (
      actionType === PAGINATION_EVENT_TYPE.prev &&
      pagination.currentPage > 1
    ) {
      newPaginationData.currentPage = pagination.currentPage - 1;
    } else if (
      actionType === PAGINATION_EVENT_TYPE.next &&
      pagination.currentPage < pagination?.totalPages
    ) {
      newPaginationData.currentPage = pagination.currentPage + 1;
    }

    return newPaginationData;
  };

  /**
   * @method handlePageSizeChange
   * @description Updates page size and resets current page to 1.
   * @param {SelectChangeEvent<unknown>} e - Select change event with new page size
   * @returns {typeof pagination} Updated pagination data
   */
  const handlePageSizeChange = (e: SelectChangeEvent<unknown>) => {
    const option: { value: number } = e?.target.value as { value: number };
    const newPageSize = option.value as number;
    return {
      ...pagination,
      pageSize: newPageSize,
      currentPage: 1,
    };
  };

  /**
   * @method handleCurrentPageChange
   * @description Updates the current page number.
   * @param {SelectChangeEvent<unknown>} e - Select change event with new page number
   * @returns {typeof pagination} Updated pagination data
   */
  const handleCurrentPageChange = (e: SelectChangeEvent<unknown>) => {
    const option: { value: number } = e?.target.value as { value: number };
    const newCurrentPage = option.value as number;
    return {
      ...pagination,
      currentPage: newCurrentPage,
    };
  };

  /**
   * @method handleChange
   * @description Delegates pagination changes to appropriate handler and triggers onChange callback.
   * @param {PaginationActionProps} type - Action type: "prev", "next", "pageSize", or "currentPage"
   * @param {SelectChangeEvent<unknown>} [event] - Optional event object for dropdown changes
   * @returns {void}
   */
  const handleChange = (
    type: PaginationActionProps,
    event?: SelectChangeEvent<unknown>
  ) => {
    let newPaginationData: typeof pagination;

    switch (type) {
      case PAGINATION_EVENT_TYPE.prev:
      case PAGINATION_EVENT_TYPE.next:
        newPaginationData = handlePageClick(type);
        break;
      case PAGINATION_EVENT_TYPE.pageSize:
        newPaginationData = handlePageSizeChange(event);
        break;
      case PAGINATION_EVENT_TYPE.currentPage:
        newPaginationData = handleCurrentPageChange(event);
        break;
      default:
        newPaginationData = pagination;
    }

    if (onChange) {
      onChange(newPaginationData);
    }
  };

  /**
   * @method currentPageOption
   * @description Generates page number options for dropdown (1 to  pagination totalPages).
   * @returns {Array<{ label: number; value: number }>} Array of page options
   */
  const currentPageOption = useMemo(() => {
    const arr = [];
    if (isNonEmptyValue(pagination?.totalPages)) {
      for (let i = 1; i <= pagination?.totalPages; i++) {
        arr.push({ label: i, value: i });
      }
    }
    return arr;
  }, [pagination?.totalPages]);

  /**
   * @method isPaginationRequired
   * @description Checks if pagination is required based on total items and page size options.
   * @returns {boolean} True if pagination is needed, false otherwise
   */
  const isPaginationRequired = () => {
    return (
      (pageSizeOptions &&
        Math.min(...pageSizeOptions.map((option) => option.value)) <
          pagination?.totalItems) ||
      Math.min(
        ...DEFAULT_PAGINATION_SIZE_OPTIONS.map((option) => option.value)
      ) < pagination?.totalItems
    );
  };

  if (!showPagination || !isPaginationRequired()) {
    return null;
  }

  return (
    <Box
      className={clsx({
        pagination: true,
        [`pagination--${size}`]: true,
        [className]: !!className,
      })}
    >
      {/* Page navigation */}
      <Box className="pagination__navigation">
        <Box>{PAGINATION.pageLabel}</Box>
        <Box className="pagination__navigation-controls">
          {/* Previous button */}
          <CIconButton
            size="large"
            onClick={() => handleChange(PAGINATION_EVENT_TYPE.prev)}
            disabled={pagination?.currentPage === 1}
            className={clsx({
              "pagination__action-btn": true,
              "pagination__prev-button": true,
              "pagination__prev-button--disabled":
                pagination?.currentPage === 1,
            })}
            walkMeId={[...walkMeIdPrefix, "paginator", "prev button"]}
          >
            <CSvgIcon component={ChevronLeft} />
          </CIconButton>
          {/* Current Page dropdown */}
          <CSelect
            className="pagination__current-page-select"
            options={currentPageOption}
            value={String(pagination?.currentPage)}
            optionLabelKey="label"
            onChange={(e) => handleChange(PAGINATION_EVENT_TYPE.currentPage, e)}
          />
          {/* Next button */}
          <CIconButton
            size="large"
            onClick={() => handleChange(PAGINATION_EVENT_TYPE.next)}
            disabled={pagination?.currentPage === pagination?.totalPages}
            className={clsx({
              "pagination__action-btn": true,
              "pagination__next-button": true,
              "pagination__next-button--disabled":
                pagination?.currentPage === pagination?.totalPages,
            })}
            walkMeId={[...walkMeIdPrefix, "paginator", "next button"]}
          >
            <CSvgIcon component={ChevronRight} />
          </CIconButton>
        </Box>
        <Box>
          {PAGINATION.ofLabel} {pagination?.totalPages}
        </Box>
      </Box>
      {/* Page size */}
      <Box>
        <CSelect
          options={
            !isNonEmptyValue(pageSizeOptions)
              ? DEFAULT_PAGINATION_SIZE_OPTIONS
              : pageSizeOptions
          }
          optionLabelKey="label"
          onChange={(e) => handleChange(PAGINATION_EVENT_TYPE.pageSize, e)}
          templates={{
            inputValueTemplate: () => {
              return (
                <div>
                  {pagination?.pageSize} / {PAGINATION.pageLabel}
                </div>
              );
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default CPagination;
