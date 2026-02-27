import type {
  QuestionType,
  AnswerType,
  GridPreviewType,
  TemplatePreviewType,
} from "@/pages/template-library/types/template-questions.type";
import {
  EXPORT_COLUMN_KEYS,
  EXPORT_PLACEHOLDER,
  EXPORT_MESSAGES,
  QUESTION_TYPE_IDENTIFIER,
  TEMPLATE_TYPE,
} from "@/pages/template-library/constants/constant";
import type { TemplateType } from "@/pages/template-library/types/template-library.type";

/**
 * @description Type alias for export record objects containing string or number values
 */
type ExportRecord = Record<string, string | number>;

/**
 * @method flattenChecklistQuestions
 * @description Recursively flattens nested checklist questions into a flat array.
 * Processes each question and its sub-questions, extracting relevant data
 * (Index, Question content, Type, and Answers) into a flat structure suitable for export.
 * @param {QuestionType | null | undefined} question - The question object to flatten
 * @param {ExportRecord[]} result - The accumulator array for flattened questions
 * @returns {ExportRecord[]} Flattened array of question records with Index, Question, Type, and Answers fields
 */
const flattenChecklistQuestions = (
  question: QuestionType | null | undefined,
  result: ExportRecord[] = []
): ExportRecord[] => {
  if (!question) return result;

  // Add current question if it's not a title or has content
  if (
    question.qcontent &&
    question.questionType !== QUESTION_TYPE_IDENTIFIER.TITLE
  ) {
    const answers =
      question.answers?.map((a: AnswerType) => a.value).join(", ") ||
      EXPORT_PLACEHOLDER;
    result.push({
      [EXPORT_COLUMN_KEYS.INDEX]: question.index || EXPORT_PLACEHOLDER,
      [EXPORT_COLUMN_KEYS.QUESTION]: question.qcontent,
      [EXPORT_COLUMN_KEYS.TYPE]: question.questionType || EXPORT_PLACEHOLDER,
      [EXPORT_COLUMN_KEYS.ANSWERS]: answers,
    });
  }

  // Recursively process sub-questions
  if (Array.isArray(question.subQuestions)) {
    question.subQuestions.forEach((subQ: QuestionType) => {
      flattenChecklistQuestions(subQ, result);
    });
  }

  return result;
};

/**
 * @method extractChecklistData
 * @description Extracts all questions from a checklist template preview.
 * Iterates through the top-level sub-questions and recursively flattens
 * all nested questions using flattenChecklistQuestions helper.
 * @param {QuestionType | null | undefined} checkListPreview - The checklist preview data containing sub-questions
 * @returns {ExportRecord[]} Array of flattened question records ready for export
 */
const extractChecklistData = (
  checkListPreview: QuestionType | null | undefined
): ExportRecord[] => {
  const result: ExportRecord[] = [];

  if (checkListPreview?.subQuestions) {
    checkListPreview.subQuestions.forEach((question: QuestionType) => {
      flattenChecklistQuestions(question, result);
    });
  }

  return result;
};

/**
 * @method extractGridData
 * @description Extracts grid template data for export by creating a proper table structure.
 * Processes grid columns and rows to create a 2D table structure where:
 * - The first column "Content" contains row labels with index numbers
 * - Subsequent columns are derived from column headers (Title type questions)
 * - Each row contains answers mapped to their respective columns
 * @param {GridPreviewType[] | GridPreviewType | null | undefined} gridsPreview - The grid preview data containing columns and rows
 * @returns {ExportRecord[]} Array of records representing the grid structure with Content column first, followed by column headers
 */
const extractGridData = (
  gridsPreview: GridPreviewType[] | GridPreviewType | null | undefined
): ExportRecord[] => {
  if (!gridsPreview) return [];

  // Handle array of grids - use the first grid for preview
  const gridData = Array.isArray(gridsPreview) ? gridsPreview[0] : gridsPreview;

  if (!gridData) return [];

  const columns = gridData.columns || [];
  const rows = gridData.rows || [];

  // Get column headers from columns array (Title types)
  const columnHeaders: string[] = columns
    .filter(
      (col: QuestionType) => col.questionType === QUESTION_TYPE_IDENTIFIER.TITLE
    )
    .map((col: QuestionType) => col.qcontent || EXPORT_PLACEHOLDER);

  // Build grid export data - iterate through ALL rows
  const exportRows: ExportRecord[] = [];
  let rowIndex = 1;

  rows.forEach((row: QuestionType) => {
    // Create row with Content first, then columns
    const rowData: ExportRecord = {};

    // Content column: index + qcontent or just qcontent
    const contentValue = row.index
      ? `${rowIndex}. ${row.qcontent || EXPORT_PLACEHOLDER}`
      : `${rowIndex}. ${row.qcontent || EXPORT_PLACEHOLDER}`;
    rowData[EXPORT_COLUMN_KEYS.CONTENT] = contentValue;

    // For each column header, check if this row has answers
    columnHeaders.forEach((colName: string) => {
      if (row.answers && row.answers.length > 0) {
        // Row has answers - show them
        const answers = row.answers.map((a: AnswerType) => a.value).join(", ");
        rowData[colName] = answers;
      } else {
        // No answers (Title type) - show dash
        rowData[colName] = EXPORT_PLACEHOLDER;
      }
    });

    exportRows.push(rowData);
    rowIndex++;
  });

  // Store column headers for later use (Content first, then column names)
  (exportRows as ExportRecord[] & { columnHeaders?: string[] }).columnHeaders =
    columnHeaders;

  return exportRows.length > 0
    ? exportRows
    : [
        {
          [EXPORT_COLUMN_KEYS.CONTENT]: EXPORT_MESSAGES.NO_GRID_DATA,
        },
      ];
};

/**
 * @method templateTableExportData
 * @description Transforms an array of template data into a format suitable for table export.
 * Maps each template to an object containing Template Name, Created date, Type, Last Modified date, and Status.
 * @param {TemplateType[]} exportData - Array of template objects from the template library
 * @returns {ExportRecord[]} Array of formatted records for table export
 */
export const templateTableExportData = (
  exportData: TemplateType[]
): ExportRecord[] => {
  return exportData?.map((item: TemplateType) => ({
    [EXPORT_COLUMN_KEYS.TEMPLATE_NAME]: item?.templateName,
    [EXPORT_COLUMN_KEYS.TYPE]: item?.tagType,
    [EXPORT_COLUMN_KEYS.STATUS]: item?.status,
    [EXPORT_COLUMN_KEYS.CREATED]: item?.createdTime,
    [EXPORT_COLUMN_KEYS.LAST_MODIFIED]: item?.lastModifiedTime,
  }));
};

/**
 * @method templatePreviewExportData
 * @description Converts template preview data to a flat, exportable format.
 * Delegates to getTemplatePreviewData for the actual transformation.
 * Used for PDF, Excel, and CSV exports of template preview content.
 * @param {TemplatePreviewType} exportData - The template preview data containing checklist or grid data
 * @returns {ExportRecord[]} Array of records ready for export to file formats
 */
export const templatePreviewExportData = (
  exportData: TemplatePreviewType
): ExportRecord[] => {
  return getTemplatePreviewData(exportData);
};

/**
 * @method getTemplatePreviewData
 * @description Converts template preview data to exportable format based on template type.
 * Handles both GRID and CHECKLIST template types:
 * - GRID: Extracts grid data with Content column first, followed by column headers
 * - CHECKLIST: Extracts flattened question data with Index, Question, Type, and Answers
 * Ensures proper column ordering for consistent export output.
 * @param {TemplatePreviewType} exportData - The template preview data containing template type and preview content
 * @returns {ExportRecord[]} Array of records ready for export, properly ordered by columns
 */
export const getTemplatePreviewData = (
  exportData: TemplatePreviewType
): ExportRecord[] => {
  const templateBaseType = exportData?.templateBaseType?.toUpperCase();
  let exportRecords: ExportRecord[] = [];
  let columnHeaders: string[] = [];

  switch (templateBaseType) {
    case TEMPLATE_TYPE.GRID:
      exportRecords = extractGridData(
        exportData?.gridsPreview as GridPreviewType[] | GridPreviewType | null
      );
      // Get column headers from the extracted data
      columnHeaders =
        (exportRecords as ExportRecord[] & { columnHeaders?: string[] })
          .columnHeaders || [];
      break;
    default:
      exportRecords = extractChecklistData(
        exportData?.checkListPreview as QuestionType | null
      );
  }

  if (exportRecords.length === 0) {
    return [
      {
        [EXPORT_COLUMN_KEYS.TEMPLATE_NAME]: exportData?.templateName || "",
        [EXPORT_COLUMN_KEYS.TYPE]: exportData?.templateBaseType || "",
        [EXPORT_COLUMN_KEYS.TEMPLATE_ID]: exportData?.templateId || "",
      },
    ];
  }

  // For grid templates, ensure proper column order
  let allColumns: string[] = [];

  if (columnHeaders.length > 0) {
    // Grid template: Content first, then columns
    allColumns = [EXPORT_COLUMN_KEYS.CONTENT, ...columnHeaders];

    // Reorder all rows to match column order
    exportRecords = exportRecords.map((row: ExportRecord) => {
      const reorderedRow: ExportRecord = {};
      allColumns.forEach((col) => {
        reorderedRow[col] = row[col] || "";
      });
      return reorderedRow;
    });
  } else {
    // Other templates: use natural key order from first row
    allColumns = Object.keys(exportRecords[0]);
  }

  // Return data without template name row (used for print)
  return exportRecords;
};
