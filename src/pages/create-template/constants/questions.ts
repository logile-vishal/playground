import {
  CalculatorQuestionBadge,
  Cluster,
  ArrowLeft,
  File,
  Photo,
  Previous,
  Random,
  Tag,
  Temperature,
  InlineEdit,
  Delete,
} from "@/core/constants/icons";
import type { IconColorType } from "@/core/types/icon.type";

export const QUESTION_OPTION_LABELS = {
  RADIO: "Radio Button",
  DROPDOWN: "Dropdown",
  LONG_INPUT: "Long Input",
  LABEL: "Label",
  DYNAMIC_DROPDOWN: "Dynamic Dropdown",
};

export const FEATURE_ACTION_CHIP_LABELS = {
  PHOTO: "photo",
  TAGS: "tag",
  RANDOM: "random",
  CLUSTER: "cluster",
  ANSWER: "answer",
  PREVIOUS: "previous",
  FILE: "file",
  NUMBER: "number",
  TEMPERATURE: "temperature",
  TAG: "tag",
};

export const BADGE_CONFIG = {
  photo: {
    icon: Photo,
    label: FEATURE_ACTION_CHIP_LABELS.PHOTO,
  },
  random: {
    icon: Random,
    label: FEATURE_ACTION_CHIP_LABELS.RANDOM,
  },
  cluster: {
    icon: Cluster,
    label: FEATURE_ACTION_CHIP_LABELS.CLUSTER,
  },
  answer: {
    icon: ArrowLeft,
    label: FEATURE_ACTION_CHIP_LABELS.ANSWER,
  },
  previous: {
    icon: Previous,
    label: FEATURE_ACTION_CHIP_LABELS.PREVIOUS,
  },
  file: {
    icon: File,
    label: FEATURE_ACTION_CHIP_LABELS.FILE,
  },
  number: {
    icon: CalculatorQuestionBadge,
    label: FEATURE_ACTION_CHIP_LABELS.NUMBER,
  },
  temperature: {
    icon: Temperature,
    label: FEATURE_ACTION_CHIP_LABELS.TEMPERATURE,
  },
  tag: {
    icon: Tag,
    label: FEATURE_ACTION_CHIP_LABELS.TAGS,
    count: 3,
    // TODO: label handled dynamically
  },
};

export const SECTION_SETTINGS_MENU_KEY = {
  RENAME: "rename_section",
  DELETE: "delete_section",
};

export const SECTION_SETTINGS_MENU_OPTIONS = [
  {
    name: "Rename",
    value: SECTION_SETTINGS_MENU_KEY.RENAME,
    leftIcon: InlineEdit,
  },
  {
    name: "Delete",
    value: SECTION_SETTINGS_MENU_KEY.DELETE,
    leftIcon: Delete,
    labelStyleProps: { color: "var(--logile-text-state-violation)" },
    leftIconStyleProps: { color: "violation" as IconColorType },
  },
];

export const QUESTION_MODAL = {
  ADD_SECTION: {
    TITLE: "Add Section",
    PRIMARY_ACTION: "Add",
  },
  RENAME_SECTION: {
    TITLE: "Rename Section",
    PRIMARY_ACTION: "Rename",
  },
  FIELDS: {
    SECTION_NAME: "Section Name",
    MEDIUM: "medium",
  },
};

export const DELETE_SECTION_MODAL = {
  TITLE: "Delete questions and section?",
  DESCRIPTION:
    "Deleting a section also deletes the questions and responses it contains.",
  CONFIRM_TEXT: "Delete",
} as const;

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
      "Is the floor clean %abc% and organised? Is the floor clean %abc% and organised?",
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

export const QUESTION_CARD_COMPLIANT_OPTIONS = {
  COMPLIANT: { label: "Compliant", value: "Compliant" },
  NON_COMPLIANT: { label: "Non-Compliant", value: "Non-Compliant" },
  NA: { label: "NA", value: "NA" },
};

export const QUESTION_CARD_ADDITIONAL_OPTIONS = {
  NO_ADDITIONAL_INFO: {
    label: "No Additional Info",
    value: "No Additional Info",
  },
  OPTIONAL_INFO: { label: "Optional Info", value: "Optional Info" },
  REQUIRED_INFO: { label: "Required Info", value: "Required Info" },
};

export const QUESTION_CARD_OPTION = {
  optionPlaceholder: "Option",
  minLengthPlaceholder: "Min Length",
  maxLengthPlaceholder: "Max Length",
  requiredPlaceholder: "Required",
};
