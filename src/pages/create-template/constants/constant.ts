import type z from "zod";

import { createTemplateFormSchema } from "../services/create-template-form-schema";

export const CREATE_TEMPLATE_HEADING = {
  createTaskTemplate: "Create Task Template",
};

export const CREATE_TEMPLATE_STEPS = {
  basicInfo: { label: "Basic Information", value: "basic" },
  questions: { label: "Questions", value: "questions" },
  advancedOption: { label: "Advanced Options", value: "advanced" },
  notification: { label: "Notifications", value: "notifications" },
  followUp: { label: "Follow-up Tasks", value: "follow-up" },
};

export const QUESTION_SECTION = {
  HEADER: "Questions",
  NO_QUESTION_PLACEHOLDER: `No questions added yet. Click "+ Question" to get started.`,
  ACTION_ADD_QUESTION: "Questions",
  ACTION_ADD_SECTION: "Sections",
};

export const BASIC_INFO = {
  templateName: "Template Name",
  templateNamePlaceholder: "Enter Template Name",
  description: "Description",
  descriptionPlaceholder: "Enter Description",
  type: "Type",
  typePlaceholder: "Select Type",
  tags: "Tags",
  tagsPlaceholder: "Select Tags",
  directory: "Directory",
  directoryPlaceholder: "Select Directory",
  subDirectoryPlaceholder: "Select Sub-Directory",
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

export const ADVANCED_OPTIONS = {
  compilanceThreshold: "Compilance Threshold",
  compilanceThresholdPlaceholder: "Enter value",
  labourHours: "Labor Hours",
  labourHoursPlaceholder: "Select Option",
  templateAccess: "Template Access",
  templateAccessPlaceholder: "Select Access",
  signature: "Signature",
};

export const LABOUR_HOUR_OPTIONS = [
  { label: "Minutes", value: "Minutes" },
  { label: "Hours", value: "Hours" },
  { label: "Seconds", value: "Seconds" },
];

export const TEMPLATE_ACCESS_OPTIONS = [
  { label: "Public", value: "Public" },
  { label: "Private", value: "Private" },
  { label: "Hidden", value: "Hidden" },
];

export const TRIGGER_ANSWER = {
  notification: "Notifications triggered by answers",
  followUp: "Follow-up tasks triggered by answers",
  assigneeRecipient: "Assignee",
};

export const TEXT_CONTENT = {
  seeMore: "see more",
  seeLess: "see less",
  textLength: 80,
};

export const NOTIFICATION_HEADING = {
  notification: "Notification",
  condition: "Condition",
  conditionQuestion: "Condition Question",
  conditionAnswer: "Condition Answer",
  messageSubject: "Message Subject",
  recipients: "Recipients",
};
