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

export const TEMPLATE_TABLE_COLUMNS = {
  ICON_NAME: "iconName",
  TEMPLATE_NAME: "templateName",
  TAG_TYPE: "tagType",
  STATUS: "status",
  CREATED_TIME: "createdTime",
  LAST_MODIFIED_TIME: "lastModifiedTime",
  ACTIONS: "actions",
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

export const QUESTION_ATTACHMENT_TYPE = {
  photo: "Photo",
  barcode: "Barcode",
  temperatureProbe: "Temperature Probe",
  numeric: "Numeric",
  attachment: "Attachment",
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
