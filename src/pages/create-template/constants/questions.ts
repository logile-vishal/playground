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
  TEMPRATURE: "temperature",
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
    label: FEATURE_ACTION_CHIP_LABELS.TEMPRATURE,
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
