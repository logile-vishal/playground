import { useEffect, useMemo, useState } from "react";
import { Box, type SelectChangeEvent } from "@mui/material";

import type {
  PaginationActionProps,
  PaginationProps,
} from "@/core/types/pagination.type";
import {
  PAGINATION_EVENT_TYPE,
  PAGINATION_SIZE,
} from "@/core/constants/pagination";
import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";
import { ChevronLeft, ChevronRight } from "@/core/constants/icons";
import CSelect from "@/core/components/select/Select";
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
}) => {
  const [initialPageSize] = useState(pagination?.pageSize);
  const [numberOfPages, setNumberOfPages] = useState<number>(
    pagination?.totalPages
  );
  const { PAGINATION } = useCommonTranslation();
  const { generateId } = useWalkmeId();

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
      pagination.currentPage < numberOfPages
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
   * @description Generates page number options for dropdown (1 to numberOfPages).
   * @returns {Array<{ label: number; value: number }>} Array of page options
   */
  const currentPageOption = useMemo(() => {
    const arr = [];
    if (isNonEmptyValue(numberOfPages)) {
      for (let i = 1; i <= numberOfPages; i++) {
        arr.push({ label: i, value: i });
      }
    }
    return arr;
  }, [numberOfPages]);

  /**
   * @method pageSizeOption
   * @description Generates page size options incrementing by 10 from initialPageSize.
   * @returns {Array<{ label: number; value: number }>} Array of page size options
   */
  const defaultPageSizeOption = useMemo(() => {
    const arr = [];
    if (
      isNonEmptyValue(initialPageSize) &&
      isNonEmptyValue(pagination?.totalPages)
    ) {
      for (let i = initialPageSize; i <= pagination?.totalPages; i += 10) {
        arr.push({ label: i, value: i });
      }
    }
    return arr;
  }, [pagination, initialPageSize]);

  useEffect(() => {
    const newPaginationData = { ...pagination };
    newPaginationData.totalPages = Math.ceil(
      pagination.totalPages / pagination.pageSize
    );
    setNumberOfPages(Math.ceil(pagination.totalPages / pagination.pageSize));
  }, [pagination]);

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
            onClick={() => handleChange(PAGINATION_EVENT_TYPE.prev)}
            disabled={pagination?.currentPage === 1}
            className={clsx({
              "pagination__action-btn": true,
              "pagination__prev-button": true,
              "pagination__prev-button--disabled":
                pagination?.currentPage === 1,
            })}
            data-walkme-id={generateId([
              ...walkMeIdPrefix,
              "paginator",
              "prev button",
            ])}
          >
            <CSvgIcon
              size={20}
              color="secondary"
              component={ChevronLeft}
            />
          </CIconButton>
          {/* Current Page dropdown */}
          <CSelect
            className="pagination__current-page-select"
            options={currentPageOption}
            value={pagination?.currentPage}
            defaultValue={1}
            optionLabelKey="label"
            onChange={(e) => handleChange(PAGINATION_EVENT_TYPE.currentPage, e)}
          />
          {/* Next button */}
          <CIconButton
            onClick={() => handleChange(PAGINATION_EVENT_TYPE.next)}
            disabled={pagination?.currentPage === numberOfPages}
            className={clsx({
              "pagination__action-btn": true,
              "pagination__next-button": true,
              "pagination__next-button--disabled":
                pagination?.currentPage === numberOfPages,
            })}
            data-walkme-id={generateId([
              ...walkMeIdPrefix,
              "paginator",
              "next button",
            ])}
          >
            <CSvgIcon
              size={20}
              color="secondary"
              component={ChevronRight}
            />
          </CIconButton>
        </Box>
        <Box>
          {PAGINATION.ofLabel} {numberOfPages}
        </Box>
      </Box>
      {/* Page size */}
      <Box>
        <CSelect
          options={
            !isNonEmptyValue(pageSizeOptions)
              ? defaultPageSizeOption
              : pageSizeOptions
          }
          optionLabelKey="label"
          defaultValue={1}
          onChange={(e) => handleChange(PAGINATION_EVENT_TYPE.pageSize, e)}
          renderValue={() => (
            <div>
              {pagination?.pageSize} / {PAGINATION.pageLabel}
            </div>
          )}
        />
      </Box>
    </Box>
  );
};

export default CPagination;
