import type { TemplateFilter } from "../types/template-library.type";

export const TEMPLATE_LIST_PAGE_SIZE = 20;

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
export const TEMPLATE_STATUS_LABEL = {
  assigned: "Assigned",
  notInUse: "Not In Use",
  incomplete: "Incomplete",
  notAssigned: "Not Assigned",
};
export const TEMPLATE_STATUS_VALUE = {
  assigned: "Assigned",
  notInUse: "Not_In_Use",
  incomplete: "Not_Completed",
  notAssigned: "Not_Assigned",
};

export const TEMPLATE_STATUS_OPTIONS = [
  {
    label: TEMPLATE_STATUS_LABEL.assigned,
    value: TEMPLATE_STATUS_VALUE.assigned,
  },
  {
    label: TEMPLATE_STATUS_LABEL.notInUse,
    value: TEMPLATE_STATUS_VALUE.notInUse,
  },
  {
    label: TEMPLATE_STATUS_LABEL.incomplete,
    value: TEMPLATE_STATUS_VALUE.incomplete,
  },
  {
    label: TEMPLATE_STATUS_LABEL.notAssigned,
    value: TEMPLATE_STATUS_VALUE.notAssigned,
  },
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
export const TEMPLATE_SEARCH_BAR = {
  FILTER_NAMES: {
    templateName: "templateName",
    taskType: "taskType",
    statusList: "statusList",
    taskTagsList: "taskTagsList",
    questionTagsList: "questionTagsList",
    modifiedInLastDays: "modifiedInLastDays",
    questionText: "questionText",
    selectedSort: "selectedSort",
  },
  FILTER_MODES: {
    basic: "BASIC",
    advanced: "ADVANCED",
  },
};
export const TEMPLATE_STATUS_MAP = TEMPLATE_STATUS_OPTIONS.reduce(
  (acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  },
  {} as Record<string, string>
);

export const SKIP_FILTER = ["selectedSort"];

export const TEMPLATE_SEARCH_DEFAULT_FILTER: TemplateFilter = {
  templateName: "",
  questionText: "",
  taskType: null,
  modifiedInLastDays: "",
  taskTagsList: [],
  questionTagsList: [],
  statusList: [],
  selectedSort: {
    name: null,
    created: null,
    modified: null,
  },
};

export const EXPORT_COLUMN_KEYS = {
  CONTENT: "Content",
  ROW_LABEL: "Row Label",
  INDEX: "Index",
  QUESTION: "Question",
  TYPE: "Type",
  ANSWERS: "Answers",
  TEMPLATE_NAME: "Template Name",
  CREATED: "Created",
  LAST_MODIFIED: "Last Modified",
  STATUS: "Status",
  TEMPLATE_ID: "Template ID",
} as const;

export const QUESTION_TYPE_IDENTIFIER = {
  TITLE: "Title",
} as const;

export const EXPORT_PLACEHOLDER = "-";

export const EXPORT_MESSAGES = {
  NO_GRID_DATA: "No grid data available",
} as const;
