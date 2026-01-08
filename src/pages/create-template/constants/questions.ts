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

/* TODO Demo: TO be removed  */
export const QUESTION_ARRAY = [
  {
    id: "1",
    label:
      "Is the floor clean %template_name% and organised? Is the floor clean %template_name% and organised?",
    isRequired: true,
    orderIndex: "1",
    optiontypeLabel: QUESTION_OPTION_LABELS.RADIO,
    isPhotoBadgeVisible: true,
    isTagBadgeVisible: true,
    isFileBadgeVisible: true,
    isRandomBadgeVisible: true,
    isClusterBadgeVisible: true,
    hasError: false,
  },
  {
    id: "2",
    label: "Is the shared display case in use in the department?",
    isRequired: true,
    orderIndex: "2",
    optiontypeLabel: QUESTION_OPTION_LABELS.LONG_INPUT,
    isFileBadgeVisible: true,
    isNumberBadgeVisible: true,
    isPhotoBadgeVisible: true,
    hasError: false,
  },
  {
    id: "3",
    label: "Bakery",
    orderindex: "3",
    subQuestions: [
      {
        id: "4",
        label: "Is the bakery area clean and organized?",
        isRequired: true,
        orderIndex: "3.1",
        optiontypeLabel: QUESTION_OPTION_LABELS.RADIO,
      },
      {
        id: "5",
        label: "Describe any issues found during inspection.",
        isRequired: true,
        orderIndex: "3.2",
        optiontypeLabel: QUESTION_OPTION_LABELS.RADIO,
      },
    ],
  },
];
