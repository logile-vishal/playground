export const QUESTION_OPTION_LABELS = {
  RADIO: "Radio Button",
  DROPDOWN: "Dropdown",
  LONG_INPUT: "Long Input",
  LABEL: "Label",
  DYNAMIC_DROPDOWN: "Dynamic Dropdown",
};

export const FEATURE_ACTION_CHIP_LABELS = {
  PHOTO: {
    label: "Photo",
    value: "photo",
  },
  TAGS: {
    label: "Tags",
    value: "tag",
  },
  RANDOM: {
    label: "Random",
    value: "random",
  },
  CLUSTER: {
    label: "Cluster",
    value: "cluster",
  },
  ANSWER: {
    label: "Answer",
    value: "answer",
  },
  PREVIOUS: {
    label: "Previous",
    value: "previous",
  },
  FILE: {
    label: "File",
    value: "file",
  },
  NUMBER: {
    label: "Number",
    value: "number",
  },
  TEMPERATURE: {
    label: "Temperature",
    value: "temperature",
  },
  TAG: {
    label: "Tag",
    value: "tag",
  },
};

export const SECTION_SETTINGS_MENU_KEY = {
  RENAME: "rename_section",
  DELETE: "delete_section",
};

export const OPTION_TRIGGER_MENU_KEY = {
  Notification: "notification",
  FollowUp: "follow_up",
};

export const QUESTION_TABS = {
  BASIC: {
    label: "Basic",
    value: "basic",
  },
  ADVANCED: {
    label: "Advanced",
    value: "advanced",
  },
};

export const QUESTION_TYPES_OPTIONS = [
  { label: QUESTION_OPTION_LABELS.RADIO, value: QUESTION_OPTION_LABELS.RADIO },
  {
    label: QUESTION_OPTION_LABELS.DROPDOWN,
    value: QUESTION_OPTION_LABELS.DROPDOWN,
  },
  {
    label: QUESTION_OPTION_LABELS.LONG_INPUT,
    value: QUESTION_OPTION_LABELS.LONG_INPUT,
  },
  { label: QUESTION_OPTION_LABELS.LABEL, value: QUESTION_OPTION_LABELS.LABEL },
  {
    label: QUESTION_OPTION_LABELS.DYNAMIC_DROPDOWN,
    value: QUESTION_OPTION_LABELS.DYNAMIC_DROPDOWN,
  },
];

export const FORM_FILE_TYPES = ".pdf,.doc,.docx";

export const SPREADSHEET_FILE_TYPES = ".xls,.xlsx,.csv,.xlsv";

export const QUESTION_TYPE = {
  RADIO: "radio",
  DROPDOWN: "dropdown",
  CHECKBOX: "checkbox",
  SORT_INPUT: "sort_input",
  LONG_INPUT: "long_input",
  LABEL: "label",
  DYNAMIC_DROPDOWN: "dynamic_dropdown",
  BARCODE_SCAN: "barcode_scan",
  RESPONSE_TEMPLATE: "response_template",
  SECTION: "title",
};

export const INPUT_TYPE = {
  ANY_CHARACTERS: "any_characters",
  TEXT_ONLY: "text_only",
  NUMBER_ONLY: "number_only",
  DATE_TIME: "date_time",
};

/* TODO: Replace this later */
export const DATE_TIME_INPUT_TYPE = {
  DATE_ONLY: "date-only",
  TIME_ONLY: "time-only",
  DATE_AND_TIME: "date-and-time",
};

export const RESPONSE_TEMPLATE_TYPE = {
  MARK_WHEN_COMPLETE: "mark_when_complete",
  RANK: "rank",
  TEMP: "temp",
  YES_NO: "yes_no",
  MANUAL_TEMP: "manual_temp",
};

export const OPTION_ATTCHMENT_REQUIRED_TYPE_ENUMS = [
  "Always",
  "In compliance only",
  "Out of compliance only",
] as const;

export const ATTACHMENTS_ENUM = [
  "Photo",
  "Barcode",
  "Temperature Probe",
  "Numeric",
  "Attachment",
] as const;
