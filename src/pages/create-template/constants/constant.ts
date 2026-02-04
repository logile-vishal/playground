import { TEMPLATE_TYPE } from "@/pages/template-library/constants/constant";

export const QUESTION_SECTION = {
  HEADER: "Questions",
  NO_QUESTION_PLACEHOLDER: `No questions added yet. Click "+ Question" to get started.`,
  ACTION_ADD_QUESTION: "Questions",
  ACTION_ADD_SECTION: "Sections",
  ACTION_ADD_OPTION: "Option",
};

export const CREATE_TEMPLATE = {
  DEFAULT_QUESTION_TYPE: "radio",
  FORM_VALIDATION_ERROR: "This field is required",
};

export const CREATE_TEMPLATE_TABS = {
  basicInfo: "Basic Info",
  questions: "Questions",
  advancedOptions: "Advanced Options",
  notifications: "Notifications",
  followUpTask: "Follow Up Task",
};

export const TRIGGER_ANSWER = {
  assigneeRecipient: "Assignee",
};

export const TRIGGER_TYPE = {
  notification: "notification",
  followup: "followup",
};

export const BASE_TEMPLATE_TYPE = {
  checklist: "checklist",
  grid: "grid",
  spreadsheet: "spreadsheet",
  form: "form",
};

export const TEMPLATE_TYPE_STEPS = {
  [TEMPLATE_TYPE.CHECKLIST]: {
    0: "basicData",
    1: "questions",
    2: "advancedOptions",
    3: "notifications",
    4: "followUpTasks",
  },
  [TEMPLATE_TYPE.GRID]: {
    0: "basicData",
    1: "columns",
    2: "questions",
    3: "advancedOptions",
    4: "notifications",
    5: "followUpTasks",
  },
  [TEMPLATE_TYPE.FORM]: {
    0: "basicData",
    1: "advancedOptions",
    2: "notifications",
    3: "followUpTasks",
  },
  [TEMPLATE_TYPE.SPREADSHEET]: {
    0: "basicData",
    1: "advancedOptions",
    2: "notifications",
    3: "followUpTasks",
  },
};
