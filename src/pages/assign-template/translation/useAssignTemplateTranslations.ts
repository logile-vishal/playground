import { useTranslation } from "@/core/hooks/useTranslation";

export const useAssignTemplateTranslations = () => {
  const { t } = useTranslation("assign-template");

  const ASSIGN_TEMPLATE_HEADING = {
    assignTaskTemplate: t("ASSIGN_TEMPLATE_HEADING.assignTaskTemplate"),
  };

  const ASSIGN_TEMPLATE_HEADER_ACTIONS = {
    next: t("ASSIGN_TEMPLATE_HEADER_ACTIONS.next"),
    reviewAndSubmit: t("ASSIGN_TEMPLATE_HEADER_ACTIONS.reviewAndSubmit"),
  };

  const ASSIGN_TEMPLATE_STEPS = {
    basicInfo: {
      label: t("ASSIGN_TEMPLATE_STEPS.basicInfoLabel"),
      value: "basic",
    },
    recipients: {
      label: t("ASSIGN_TEMPLATE_STEPS.recipientsLabel"),
      value: "recipients",
    },
    schedule: {
      label: t("ASSIGN_TEMPLATE_STEPS.scheduleLabel"),
      value: "schedule",
    },
    notifications: {
      label: t("ASSIGN_TEMPLATE_STEPS.notificationsLabel"),
      value: "notifications",
    },
    settings: {
      label: t("ASSIGN_TEMPLATE_STEPS.settingsLabel"),
      value: "settings",
    },
    attachments: {
      label: t("ASSIGN_TEMPLATE_STEPS.attachmentsLabel"),
      value: "attachments",
    },
  };

  return {
    ASSIGN_TEMPLATE_HEADING,
    ASSIGN_TEMPLATE_HEADER_ACTIONS,
    ASSIGN_TEMPLATE_STEPS,
  };
};
