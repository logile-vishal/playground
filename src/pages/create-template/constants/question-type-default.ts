import { INPUT_TYPE } from "./questions";

export const OPTIONS_DEFAULT = {
  title: "",
  isCompliant: true,
  additionalInfo: {
    required: false,
    requiredType: "No Additional Info",
  },
  isDefault: false,
  score: 0,
  formula: "",
};

export const RADIO_TYPE_DEFAULT = {
  questionType: "radio" as const,
  title: "",
  response: [OPTIONS_DEFAULT],
};

export const DROPDOWN_TYPE_DEFAULT = {
  questionType: "dropdown" as const,
  title: "",
  response: [OPTIONS_DEFAULT],
};
export const CHECKBOX_TYPE_DEFAULT = {
  questionType: "checkbox" as const,
  title: "",
  response: [OPTIONS_DEFAULT],
};

export const DYNAMIC_DROPDOWN_TYPE_DEFAULT = {
  questionType: "dynamic_dropdown" as const,
  title: "",
  response: [OPTIONS_DEFAULT],
};

export const SORT_INPUT_TYPE_DEFAULT = {
  questionType: "sort_input" as const,
  title: "",
  inputType: INPUT_TYPE.ANY_CHARACTERS,
  minLength: null,
  maxLength: null,
};

export const SORT_INPUT_TYPE_TEXT_ONLY_DEFAULT = {
  questionType: "sort_input" as const,
  title: "",
  inputType: INPUT_TYPE.TEXT_ONLY,
  minLength: null,
  maxLength: null,
};

export const SORT_INPUT_TYPE_NUMBER_ONLY_DEFAULT = {
  questionType: "sort_input" as const,
  title: "",
  inputType: INPUT_TYPE.NUMBER_ONLY,
  minValue: null,
  maxValue: null,
};

export const SORT_INPUT_TYPE_DATE_TIME_DEFAULT = {
  questionType: "sort_input" as const,
  title: "",
  inputType: INPUT_TYPE.DATE_TIME,
  value: null,
};

export const LONG_INPUT_TYPE_DEFAULT = {
  questionType: "long_input" as const,
  title: "",
};

export const LABEL_TYPE_DEFAULT = {
  questionType: "label" as const,
  title: "",
};

export const BARCODE_SCAN_TYPE_DEFAULT = {
  questionType: "barcode_scan" as const,
  title: "",
  response: [],
};

export const RESPONSE_TEMPLATE_TYPE_DEFAULT = {
  questionType: "response_template" as const,
  title: "",
  value: "",
};

export const SECTION_TYPE_DEFAULT = {
  questionType: "title" as const,
  title: "",
};

export const CLUSTER_DEFAULT = {
  clusterId: null,
  clusterName: null,
  clusterValueId: null,
  clusterValueName: null,
};

export const TAGS_DEFAULT = {
  tagId: null,
  tagName: null,
  attributeId: null,
  attributeName: null,
};

export const ATTACHMENTS_DEFAULT = {
  attachmentType: null,
  required: false,
  requiredType: null,
};

export const NUMERIC_VALUE_DEFAULT = {
  minValue: null,
  maxValue: null,
};

export const ADVANCE_SETTINGS_DEFAULT = {
  visibilityRule: {
    storeClusters: {
      isEnabled: false,
      clustersList: [] as [],
    },
    basedOnPreviousAnswers: {
      isEnabled: false,
    },
    isRandom: false,
    previousExecutionStatus: {
      isEnabled: false,
      status: "",
    },
  },
  tags: [] as [],
  fileAttachments: {
    isEnabled: false,
    attachments: ATTACHMENTS_DEFAULT,
  },
  numericValue: {
    isEnabled: false,
    type: null,
  },
};
