import Box from "@mui/material/Box";
import moment from "moment";

import {
  Attachment,
  Calculator,
  Scan,
  Scenary,
  Temperature,
} from "@/core/constants/icons";

import type { SortOption } from "../types/template-constants.type";
import type { PreviewButtonConfigProp } from "../types/template-preview.type";
import { useTemplateLibraryTranslations } from "../translation/useTemplateLibraryTranslations";

export const TEMPLATE_LIST_PAGE_SIZE = 50;

export const TEMPLATE_SEARCH_TABS = {
  RECENT: {
    label: "Recent",
    value: "RECENT",
  },
  ADVANCE: {
    label: "Advanced Search",
    value: "ADVANCE",
  },
};

export const TEMPLATE_TASK_TYPE_OPTIONS = [
  { label: "Select Task Type", value: "" },
  { label: "Checklist", value: "Checklist" },
  { label: "Radio", value: "Radio" },
];

export const TEMPLATE_STATUS_OPTIONS = [
  { label: "Assigned", value: "Assigned" },
  { label: "Not In Use", value: "Not_In_Use" },
  { label: "Incomplete", value: "Not_Completed" },
];

/**
 * @function getTemplateSorting
 * @description Returns template sorting options with translated labels
 * @return {Record<string, SortOption[]>} Template sorting configuration
 */
export const getTemplateSorting = (
  TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS
): Record<string, SortOption[]> => {
  return {
    NAME: [
      {
        getLabel: () => (
          <Box
            display="flex"
            alignItems="center"
            fontSize="14px"
            fontWeight="400"
          >
            {TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameAsc}
          </Box>
        ),
        key: "ASC",
        name: "templateName",
      },
      {
        getLabel: () => (
          <Box
            display="flex"
            alignItems="center"
            fontSize="14px"
            fontWeight="400"
          >
            {TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameDesc}
          </Box>
        ),
        key: "DESC",
        name: "templateName",
      },
    ],
    CREATED: [
      {
        getLabel: () => (
          <Box>{TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortAsc}</Box>
        ),
        key: "ASC",
        name: "createdTime",
      },
      {
        getLabel: () => (
          <Box>{TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortDesc}</Box>
        ),
        key: "DESC",
        name: "createdTime",
      },
    ],
    MODIFIED: [
      {
        getLabel: () => (
          <Box>{TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortAsc}</Box>
        ),
        key: "ASC",
        name: "lastModifiedTime",
      },
      {
        getLabel: () => (
          <Box>{TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortDesc}</Box>
        ),
        key: "DESC",
        name: "lastModifiedTime",
      },
    ],
  };
};

export const TEMPLATE_SORTING = () => {
  const { TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS } =
    useTemplateLibraryTranslations();
  return getTemplateSorting(TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS);
};

/**
 * @function getReportSorting
 * @description Returns report sorting options with translated labels
 * @return {Record<string, SortOption[]>} Report sorting configuration
 */
export const getReportSorting = (
  TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS
): Record<string, SortOption[]> => {
  return {
    NAME: [
      {
        getLabel: () => (
          <Box
            display="flex"
            alignItems="center"
            fontSize="14px"
            fontWeight="400"
          >
            {TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameAsc}
          </Box>
        ),
        key: "ASC",
        name: "name",
      },
      {
        getLabel: () => (
          <Box
            display="flex"
            alignItems="center"
            fontSize="14px"
            fontWeight="400"
          >
            {TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameDesc}
          </Box>
        ),
        key: "DESC",
        name: "name",
      },
    ],
    SAVED_DATE: [
      {
        getLabel: () => (
          <Box>{TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortAsc}</Box>
        ),
        key: "ASC",
        name: "savedDate",
      },
      {
        getLabel: () => (
          <Box>{TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortDesc}</Box>
        ),
        key: "DESC",
        name: "savedDate",
      },
    ],
  };
};

export const REPORT_SORTING = () => {
  const { TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS } =
    useTemplateLibraryTranslations();
  return getReportSorting(TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS);
};

export const TEMPLATE_TABLE_COLUMNS = {
  ICON_NAME: "iconName",
  TEMPLATE_NAME: "templateName",
  TAG_TYPE: "tagType",
  STATUS: "status",
  CREATED_TIME: "createdTime",
  LAST_MODIFIED_TIME: "lastModifiedTime",
  ACTIONS: "actions",
};

export const formatDate = (dateString: string): string => {
  return moment(dateString).format("DD/MM/YY");
};

export const LIB_TYPE = {
  TEMPLATE: "template",
  REPORT: "report",
};

export const TEMPLATE_TYPE = {
  CHECKLIST: "CHECKLIST",
  FORM: "FORM",
  GRID: "GRID",
  SPREADSHEET: "SPREADSHEET",
};

/**
 * @function getQuestionTypes
 * @description Returns question types with translated labels
 * @param {Object} QUESTION_TYPES - Question types translations
 * @return {Object} Question types configuration
 */
export const getQuestionTypes = (QUESTION_TYPES) => {
  return {
    NUMERIC: { label: QUESTION_TYPES.numeric, value: "Numeric" },
    DROPDOWN: { label: QUESTION_TYPES.dropdown, value: "Dropdown" },
    RADIO_BUTTON: {
      label: QUESTION_TYPES.radioButton,
      value: "Radio Button",
    },
    CHECKBOX: { label: QUESTION_TYPES.checkbox, value: "Checkbox" },
    USER_INPUT: { label: QUESTION_TYPES.userInput, value: "User Input" },
    LONG_USER_INPUT: {
      label: QUESTION_TYPES.longUserInput,
      value: "Long User Input",
    },
    LABEL: { label: QUESTION_TYPES.label, value: "Label" },
    REMINDER: { label: QUESTION_TYPES.reminder, value: "Reminder" },
    TITLE: { label: QUESTION_TYPES.title, value: "Title" },
    RESPONSE_TEMPLATE: {
      label: QUESTION_TYPES.responseTemplate,
      value: "Response Template",
    },
    DYNAMIC_DROPDOWN: {
      label: QUESTION_TYPES.dynamicDropdown,
      value: "Dynamic Dropdown",
    },
    UPC_BARCODE_SCAN: {
      label: QUESTION_TYPES.upcBarcodeScan,
      value: "UPC Barcode Scan",
    },
  };
};

/**
 * @function getUserInputTypes
 * @description Returns user input types with translated labels
 * @param {Object} DATE_INPUT_TYPE - User input types translations
 * @return {Object} User input types configuration
 */
export const getUserInputTypes = (DATE_INPUT_TYPE) => {
  return {
    DATE: { label: DATE_INPUT_TYPE.date, value: "Date" },
    TIME: { label: DATE_INPUT_TYPE.time, value: "Time" },
    DATE_AND_TIME: {
      label: DATE_INPUT_TYPE.dateAndTime,
      value: "Date & Time",
    },
  };
};

/**
 * @function getQuestionAttachment
 * @description Returns question attachment types with translated labels
 * @param {Object} QUESTION_ATTACHMENT - Question attachment translations
 * @return {Object} Question attachment types configuration
 */
export const getQuestionAttachment = (QUESTION_ATTACHMENT) => {
  return {
    PHOTO: { label: QUESTION_ATTACHMENT.photo, value: "Photo" },
    BARCODE: { label: QUESTION_ATTACHMENT.barcode, value: "Barcode" },
    TEMPERATURE_PROBE: {
      label: QUESTION_ATTACHMENT.temperatureProbe,
      value: "Temperature Probe",
    },
    NUMERIC: { label: QUESTION_ATTACHMENT.numeric, value: "Numeric" },
    ATTACHMENT: { label: QUESTION_ATTACHMENT.attachment, value: "Attachment" },
  };
};

export const QUESTION_ATTACHMENT_TYPE = {
  photo: "Photo",
  barcode: "Barcode",
  temperatureProbe: "Temperature Probe",
  numeric: "Numeric",
  attachment: "Attachment",
};

/**
 * @function getPreviewButtonConfig
 * @description Returns preview button configuration with translated labels
 * @param {Object} ATTACHMENT_BUTTON_CONFIG - Preview button translations
 * @return {PreviewButtonConfigProp} Preview button configuration
 */
export const getPreviewButtonConfig = (
  ATTACHMENT_BUTTON_CONFIG
): PreviewButtonConfigProp => {
  return {
    [QUESTION_ATTACHMENT_TYPE.photo]: {
      label: ATTACHMENT_BUTTON_CONFIG.capturePhoto,
      icon: Scenary,
    },
    [QUESTION_ATTACHMENT_TYPE.temperatureProbe]: {
      label: ATTACHMENT_BUTTON_CONFIG.captureTemperature,
      icon: Temperature,
    },
    [QUESTION_ATTACHMENT_TYPE.numeric]: {
      label: ATTACHMENT_BUTTON_CONFIG.enterValue,
      icon: Calculator,
    },
    [QUESTION_ATTACHMENT_TYPE.barcode]: {
      label: ATTACHMENT_BUTTON_CONFIG.scanItem,
      icon: Scan,
    },
    [QUESTION_ATTACHMENT_TYPE.attachment]: {
      label: ATTACHMENT_BUTTON_CONFIG.chooseFile,
      icon: Attachment,
      type: "filetype",
    },
  };
};

export const TEMPLATE_TABLE_DATA = {
  reportTask: "Report Task",
  active: "Active",
};

export const TABLE_PAGINATION_OPTIONS = [
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];
