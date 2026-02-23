export const TRIGGER_CONDITIONS = {
  TASK_COMPLETED: "TASK_COMPLETED",
  TASK_EXPIRED: "TASK_EXPIRED",
  TASK_COMPLIANCE: "TASK_COMPLIANCE",
  ANSWER: "ANSWER",
};

export const TRIGGER_RECIPIENTS = {
  ASSIGNEE: "ASSIGNEE",
  SUPERVISOR: "SUPERVISOR",
  EXECUTION_MANAGER: "EXECUTION_MANAGER",
};

export const DEFAULT_NOTIFICATION = {
  triggerType: "MESSAGE" as const,
  condition: null,
  questionId: null,
  answerIndex: null,
  recipients: [],
  customRecipients: {},
  isRelative: false,
  isOrgTypeRelative: false,
  messageTemplates: {
    subject: "",
    message: "",
  },
};

export const DEFAULT_RECIPIENT = {
  orgLevel: null,
  orgs: null,
  orgTypes: null,
  positions: null,
};

export const NOTIFICATIONS_ACTION_TYPE = {
  ADD: "add",
  EDIT: "edit",
  CLONE: "clone",
};

export const NOTIFICATIONS_CONDITION = {
  ANSWER: "ANSWER",
};

export const CUSTOM_RECIPIENT_LABEL = "Ad Hoc";

export const DEFAULT_FOLLOW_UP_TASK = {
  primaryOrgLevelPos: null,
  triggerTaskName: "",
  templateId: 0,
  durationValue: null,
  durationType: null,
  originalTaskEndTime: false,
  priority: null,
  userRetainVisibility: false,
  reminderNotificationType: null,
  messageDefinition: {
    conditionUnit: null,
    conditionValue: 0,
  },
  triggerId: null,
  triggerType: "TASK" as const,
  condition: null,
  questionId: null,
  answerIndex: null,
  recipients: [],
  customRecipients: {},
  isRelative: false,
  isOrgTypeRelative: false,
};

export const getNewCustomRecipient = () => {
  const newCustomRecipient = {
    customRecipients: { ...DEFAULT_RECIPIENT },
    isRelative: false,
    isOrgTypeRelative: false,
  };
  return newCustomRecipient;
};
