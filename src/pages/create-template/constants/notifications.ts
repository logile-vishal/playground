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
  orgLevelId: undefined,
  recipientOrgs: [],
  isRelative: false,
  recipientOrgTypes: [],
  isOrgTypeRelative: false,
  recipientPositions: [],
  recipientOrgtypePositions: [],
  messageTemplates: {
    subject: "",
    message: "",
  },
};

export const DEFAULT_RECIPIENT = {
  recipientOrgTypePosition: {
    orgTypePositionId: null,
    triggerId: null,
    orgTypeId: null,
  },
  recipientPosition: {
    recipientId: null,
    triggerId: null,
    positionId: null,
  },
  recipientOrg: {
    recipientId: null,
    triggerId: null,
    orgId: null,
  },
  recipientOrgType: {
    recipientId: null,
    triggerId: null,
    orgTypeId: null,
  },
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
