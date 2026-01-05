import type z from "zod";

import { createTemplateFormSchema } from "../services/create-template-form-schema";

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

export const CREATE_TEMPLATE_FORM_FIELDS: {
  [key: string]: keyof z.infer<typeof createTemplateFormSchema>;
} = {
  basicData: "basicData",
  questions: "questions",
  advancedOptions: "advancedOptions",
  notifications: "notifications",
  followUpTask: "followUpTask",
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
