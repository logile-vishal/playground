import type { SortOption } from "../../types/template-constants.type";

type SortingOptions = Record<string, string>;

/**
 * @function getTemplateSorting
 * @description Returns template sorting options with translated labels
 * @param {SortingOptions} TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS - Sorting option translations
 * @returns {Record<string, SortOption[]>} Template sorting configuration
 */
export const getTemplateSorting = (
  TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS: SortingOptions
): Record<string, SortOption[]> => {
  return {
    NAME: [
      {
        label: TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameAsc,
        value: "ASC",
        fieldName: "templateName",
      },
      {
        label: TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameDesc,
        value: "DESC",
        fieldName: "templateName",
      },
    ],
    CREATED: [
      {
        label: TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortAsc,
        value: "ASC",
        fieldName: "createdTime",
      },
      {
        label: TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortDesc,
        value: "DESC",
        fieldName: "createdTime",
      },
    ],
    MODIFIED: [
      {
        label: TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortAsc,
        value: "ASC",
        fieldName: "lastModifiedTime",
      },
      {
        label: TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortDesc,
        value: "DESC",
        fieldName: "lastModifiedTime",
      },
    ],
  };
};

/**
 * @function getReportSorting
 * @description Returns report sorting options with translated labels
 * @param {SortingOptions} TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS - Sorting option translations
 * @returns {Record<string, SortOption[]>} Report sorting configuration
 */
export const getReportSorting = (
  TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS: SortingOptions
): Record<string, SortOption[]> => {
  return {
    NAME: [
      {
        label: TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameAsc,
        value: "ASC",
        fieldName: "name",
      },
      {
        label: TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameDesc,
        value: "DESC",
        fieldName: "name",
      },
    ],
    SAVED_DATE: [
      {
        label: TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortAsc,
        value: "ASC",
        fieldName: "savedDate",
      },
      {
        label: TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortDesc,
        value: "DESC",
        fieldName: "savedDate",
      },
    ],
  };
};
