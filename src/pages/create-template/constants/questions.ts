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
} from "@/core/constants/icons";

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
