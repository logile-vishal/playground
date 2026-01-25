import type { SortOption } from "../../types/template-constants.type";
import { useTemplateLibraryTranslations } from "../../translation/useTemplateLibraryTranslations";
import { getTemplateSorting, getReportSorting } from "./sorting-config";

/**
 * @function TEMPLATE_SORTING
 * @description Hook to get template sorting options with translations
 * @returns {Record<string, SortOption[]>} Template sorting configuration
 */
export const TEMPLATE_SORTING = (): Record<string, SortOption[]> => {
  const { TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS } =
    useTemplateLibraryTranslations();
  return getTemplateSorting(TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS);
};

/**
 * @function REPORT_SORTING
 * @description Hook to get report sorting options with translations
 * @returns {Record<string, SortOption[]>} Report sorting configuration
 */
export const REPORT_SORTING = (): Record<string, SortOption[]> => {
  const { TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS } =
    useTemplateLibraryTranslations();
  return getReportSorting(TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS);
};
