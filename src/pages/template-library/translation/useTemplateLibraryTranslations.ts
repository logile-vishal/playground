import { useTranslation } from "react-i18next";
import { EmptyState } from "@/core/constants/icons";

export const useTemplateLibraryTranslations = () => {
  const { t } = useTranslation("template-library");

  const TEMPLATE_LIBRARY_HEADING = {
    createTemplate: t("TEMPLATE_LIBRARY_HEADING.createTemplate"),
    folderTree: t("TEMPLATE_LIBRARY_HEADING.folderTree"),
    template: t("TEMPLATE_LIBRARY_HEADING.template"),
    templateLibrary: t("TEMPLATE_LIBRARY_HEADING.templateLibrary"),
    searchTemplates: t("TEMPLATE_LIBRARY_HEADING.searchTemplates"),
  };

  const TEMPLATE_LIBRARY_NO_DATA = {
    title: t("TEMPLATE_LIBRARY_NO_DATA.title"),
    description: t("TEMPLATE_LIBRARY_NO_DATA.description"),
    imageSrcName: EmptyState,
  };

  const TEMPLATE_TABLE_COLUMN_HEADINGS = {
    name: t("TEMPLATE_TABLE_COLUMN_HEADINGS.name"),
    type: t("TEMPLATE_TABLE_COLUMN_HEADINGS.type"),
    status: t("TEMPLATE_TABLE_COLUMN_HEADINGS.status"),
    created: t("TEMPLATE_TABLE_COLUMN_HEADINGS.created"),
    lastModified: t("TEMPLATE_TABLE_COLUMN_HEADINGS.lastModified"),
    actions: t("TEMPLATE_TABLE_COLUMN_HEADINGS.actions"),
  };

  const NO_DATA_SEARCH = {
    title: t("NO_DATA_SEARCH.title"),
    description: t("NO_DATA_SEARCH.description"),
  };

  const IMPORT_MODAL = {
    title: t("IMPORT_MODAL.title"),
    description: t("IMPORT_MODAL.description"),
    confirmBtnText: t("IMPORT_MODAL.confirmBtnText"),
    cancelBtnText: t("IMPORT_MODAL.cancelBtnText"),
  };

  const DELETE_MODAL = {
    title: t("DELETE_MODAL.title"),
    description: t("DELETE_MODAL.description"),
    confirmBtnText: t("DELETE_MODAL.confirmBtnText"),
    cancelBtnText: t("DELETE_MODAL.cancelBtnText"),
  };

  const EXPORT_MODAL = {
    title: t("EXPORT_MODAL.title"),
    print: t("EXPORT_MODAL.print"),
    pdf: t("EXPORT_MODAL.pdf"),
    excel: t("EXPORT_MODAL.excel"),
    csv: t("EXPORT_MODAL.csv"),
  };

  const TEMPLATE_PREVIEW_GRID_HEADER = {
    title: t("TEMPLATE_PREVIEW_GRID_HEADER.title"),
  };

  const TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS = {
    nameAsc: t("TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameAsc"),
    nameDesc: t("TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.nameDesc"),
    sortAsc: t("TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortAsc"),
    sortDesc: t("TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS.sortDesc"),
  };

  const TEMPLATE_PREVIEW_MODAL = {
    QUESTION_TYPES: {
      numeric: t("TEMPLATE_PREVIEW_MODAL.QUESTION_TYPES.numeric"),
      dropdown: t("TEMPLATE_PREVIEW_MODAL.QUESTION_TYPES.dropdown"),
      radioButton: t("TEMPLATE_PREVIEW_MODAL.QUESTION_TYPES.radioButton"),
      checkbox: t("TEMPLATE_PREVIEW_MODAL.QUESTION_TYPES.checkbox"),
      userInput: t("TEMPLATE_PREVIEW_MODAL.QUESTION_TYPES.userInput"),
      longUserInput: t("TEMPLATE_PREVIEW_MODAL.QUESTION_TYPES.longUserInput"),
      label: t("TEMPLATE_PREVIEW_MODAL.QUESTION_TYPES.label"),
      reminder: t("TEMPLATE_PREVIEW_MODAL.QUESTION_TYPES.reminder"),
      title: t("TEMPLATE_PREVIEW_MODAL.QUESTION_TYPES.title"),
      responseTemplate: t(
        "TEMPLATE_PREVIEW_MODAL.QUESTION_TYPES.responseTemplate"
      ),
      dynamicDropdown: t(
        "TEMPLATE_PREVIEW_MODAL.QUESTION_TYPES.dynamicDropdown"
      ),
      upcBarcodeScan: t("TEMPLATE_PREVIEW_MODAL.QUESTION_TYPES.upcBarcodeScan"),
    },
    DATE_INPUT_TYPE: {
      date: t("TEMPLATE_PREVIEW_MODAL.DATE_INPUT_TYPE.date"),
      time: t("TEMPLATE_PREVIEW_MODAL.DATE_INPUT_TYPE.time"),
      dateTime: t("TEMPLATE_PREVIEW_MODAL.DATE_INPUT_TYPE.dateTime"),
    },
    QUESTION_ATTACHMENT: {
      photo: t("TEMPLATE_PREVIEW_MODAL.QUESTION_ATTACHMENT.photo"),
      barcode: t("TEMPLATE_PREVIEW_MODAL.QUESTION_ATTACHMENT.barcode"),
      temperatureProbe: t(
        "TEMPLATE_PREVIEW_MODAL.QUESTION_ATTACHMENT.temperatureProbe"
      ),
      numeric: t("TEMPLATE_PREVIEW_MODAL.QUESTION_ATTACHMENT.numeric"),
      attachment: t("TEMPLATE_PREVIEW_MODAL.QUESTION_ATTACHMENT.attachment"),
    },
    ATTACHMENT_BUTTON_CONFIG: {
      capturePhoto: t(
        "TEMPLATE_PREVIEW_MODAL.ATTACHMENT_BUTTON_CONFIG.capturePhoto"
      ),
      captureTemperature: t(
        "TEMPLATE_PREVIEW_MODAL.ATTACHMENT_BUTTON_CONFIG.captureTemperature"
      ),
      enterValue: t(
        "TEMPLATE_PREVIEW_MODAL.ATTACHMENT_BUTTON_CONFIG.enterValue"
      ),
      scanItem: t("TEMPLATE_PREVIEW_MODAL.ATTACHMENT_BUTTON_CONFIG.scanItem"),
      chooseFile: t(
        "TEMPLATE_PREVIEW_MODAL.ATTACHMENT_BUTTON_CONFIG.chooseFile"
      ),
    },
    PLACEHOLDER_TEXT: {
      enterValue: t("TEMPLATE_PREVIEW_MODAL.PLACEHOLDER_TEXT.enterValue"),
      enterDetails: t("TEMPLATE_PREVIEW_MODAL.PLACEHOLDER_TEXT.enterDetails"),
      selectOption: t("TEMPLATE_PREVIEW_MODAL.PLACEHOLDER_TEXT.selectOption"),
      selectDate: t("TEMPLATE_PREVIEW_MODAL.PLACEHOLDER_TEXT.selectDate"),
      selectTime: t("TEMPLATE_PREVIEW_MODAL.PLACEHOLDER_TEXT.selectTime"),
      selectDateTime: t(
        "TEMPLATE_PREVIEW_MODAL.PLACEHOLDER_TEXT.selectDateTime"
      ),
    },
  };

  const {
    QUESTION_TYPES,
    DATE_INPUT_TYPE,
    QUESTION_ATTACHMENT,
    ATTACHMENT_BUTTON_CONFIG,
    PLACEHOLDER_TEXT,
  } = TEMPLATE_PREVIEW_MODAL;

  return {
    TEMPLATE_LIBRARY_HEADING,
    TEMPLATE_LIBRARY_NO_DATA,
    TEMPLATE_TABLE_COLUMN_HEADINGS,
    NO_DATA_SEARCH,
    IMPORT_MODAL,
    DELETE_MODAL,
    EXPORT_MODAL,
    TEMPLATE_PREVIEW_GRID_HEADER,
    TEMPLATE_TABLE_COLUMN_SORTING_OPTIONS,
    TEMPLATE_PREVIEW_MODAL,
    QUESTION_TYPES,
    DATE_INPUT_TYPE,
    QUESTION_ATTACHMENT,
    ATTACHMENT_BUTTON_CONFIG,
    PLACEHOLDER_TEXT,
  };
};
