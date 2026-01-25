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
        getLabel: () => TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameAsc,
        key: "ASC",
        name: "templateName",
      },
      {
        getLabel: () => TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameDesc,
        key: "DESC",
        name: "templateName",
      },
    ],
    CREATED: [
      {
        getLabel: () => TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortAsc,
        key: "ASC",
        name: "createdTime",
      },
      {
        getLabel: () => TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortDesc,
        key: "DESC",
        name: "createdTime",
      },
    ],
    MODIFIED: [
      {
        getLabel: () => TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortAsc,
        key: "ASC",
        name: "lastModifiedTime",
      },
      {
        getLabel: () => TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortDesc,
        key: "DESC",
        name: "lastModifiedTime",
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
        getLabel: () => TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameAsc,
        key: "ASC",
        name: "name",
      },
      {
        getLabel: () => TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameDesc,
        key: "DESC",
        name: "name",
      },
    ],
    SAVED_DATE: [
      {
        getLabel: () => TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortAsc,
        key: "ASC",
        name: "savedDate",
      },
      {
        getLabel: () => TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortDesc,
        key: "DESC",
        name: "savedDate",
      },
    ],
  };
};
