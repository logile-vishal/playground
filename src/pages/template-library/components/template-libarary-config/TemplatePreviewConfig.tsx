import moment from "moment";

import {
  Attachment,
  Calculator,
  Scan,
  Scenary,
  Temperature,
} from "@/core/constants/icons";
import type { PreviewButtonConfigProp } from "../../types/template-preview.type";
import { QUESTION_ATTACHMENT_TYPE } from "../../constants/constant";

type TranslationOptions = Record<string, string>;
type QuestionTypeConfig = Record<string, { label: string; value: string }>;

/**
 * @function formatDate
 * @description Formats a date string to DD/MM/YY format using moment.js
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date in DD/MM/YY format
 */
export const formatDate = (dateString: string): string => {
  return moment(dateString).format("DD/MM/YY");
};

/**
 * @function getQuestionTypes
 * @description Returns question types with translated labels
 * @param {TranslationOptions} QUESTION_TYPES - Question types translations
 * @returns {QuestionTypeConfig} Question types configuration
 */
export const getQuestionTypes = (
  QUESTION_TYPES: TranslationOptions
): QuestionTypeConfig => {
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
 * @param {TranslationOptions} DATE_INPUT_TYPE - User input types translations
 * @returns {QuestionTypeConfig} User input types configuration
 */
export const getUserInputTypes = (
  DATE_INPUT_TYPE: TranslationOptions
): QuestionTypeConfig => {
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
 * @param {TranslationOptions} QUESTION_ATTACHMENT - Question attachment translations
 * @returns {QuestionTypeConfig} Question attachment types configuration
 */
export const getQuestionAttachment = (
  QUESTION_ATTACHMENT: TranslationOptions
): QuestionTypeConfig => {
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

/**
 * @function getPreviewButtonConfig
 * @description Returns preview button configuration with translated labels
 * @param {TranslationOptions} ATTACHMENT_BUTTON_CONFIG - Preview button translations
 * @returns {PreviewButtonConfigProp} Preview button configuration
 */
export const getPreviewButtonConfig = (
  ATTACHMENT_BUTTON_CONFIG: TranslationOptions
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
