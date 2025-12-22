import { useTranslation } from "react-i18next";

export const useCreateTemplateTranslations = () => {
  const { t } = useTranslation("create-template");

  const BASIC_INFO = {
    templateName: t("BASIC_INFO.templateName"),
    templateNamePlaceholder: t("BASIC_INFO.templateNamePlaceholder"),
    description: t("BASIC_INFO.description"),
    descriptionPlaceholder: t("BASIC_INFO.descriptionPlaceholder"),
    type: t("BASIC_INFO.type"),
    typePlaceholder: t("BASIC_INFO.typePlaceholder"),
    tags: t("BASIC_INFO.tags"),
    tagsPlaceholder: t("BASIC_INFO.tagsPlaceholder"),
    directory: t("BASIC_INFO.directory"),
    directoryPlaceholder: t("BASIC_INFO.directoryPlaceholder"),
    subDirectoryPlaceholder: t("BASIC_INFO.subDirectoryPlaceholder"),
  };

  const CREATE_TEMPLATE_STEPS = {
    basicInfo: {
      label: t("CREATE_TEMPLATE_STEPS.basicInfoLabel"),
      value: "basic",
    },
    questions: {
      label: t("CREATE_TEMPLATE_STEPS.questionsLabel"),
      value: "questions",
    },
    advancedOption: {
      label: t("CREATE_TEMPLATE_STEPS.advancedOptionLabel"),
      value: "advanced",
    },
    notification: {
      label: t("CREATE_TEMPLATE_STEPS.notificationLabel"),
      value: "notifications",
    },
    followUp: {
      label: t("CREATE_TEMPLATE_STEPS.followUpLabel"),
      value: "follow-up",
    },
  };

  const CREATE_TEMPLATE_HEADING = {
    createTaskTemplate: t("CREATE_TEMPLATE_HEADING.createTaskTemplate"),
  };

  const CREATE_TEMPLATE_HEADER_ACTIONS = {
    preview: t("CREATE_TEMPLATE_HEADER_ACTIONS.preview"),
    next: t("CREATE_TEMPLATE_HEADER_ACTIONS.next"),
    save: t("CREATE_TEMPLATE_HEADER_ACTIONS.save"),
    submit: t("CREATE_TEMPLATE_HEADER_ACTIONS.submit"),
  };

  const ADVANCED_OPTIONS = {
    compilanceThreshold: t("ADVANCED_OPTIONS.compilanceThreshold"),
    compilanceThresholdPlaceholder: t(
      "ADVANCED_OPTIONS.compilanceThresholdPlaceholder"
    ),
    labourHours: t("ADVANCED_OPTIONS.labourHours"),
    labourHoursPlaceholder: t("ADVANCED_OPTIONS.labourHoursPlaceholder"),
    templateAccess: t("ADVANCED_OPTIONS.templateAccess"),
    templateAccessPlaceholder: t("ADVANCED_OPTIONS.templateAccessPlaceholder"),
    signature: t("ADVANCED_OPTIONS.signature"),
  };

  const LABOUR_HOUR_OPTIONS = [
    {
      label: t("ADVANCED_OPTIONS.LABOUR_HOUR_OPTIONS.labourHoursMinutes"),
      value: "Minutes",
    },
    {
      label: t("ADVANCED_OPTIONS.LABOUR_HOUR_OPTIONS.labourHoursHours"),
      value: "Hours",
    },
    {
      label: t("ADVANCED_OPTIONS.LABOUR_HOUR_OPTIONS.labourHoursSeconds"),
      value: "Seconds",
    },
  ];

  const TEMPLATE_ACCESS_OPTIONS = [
    {
      label: t("ADVANCED_OPTIONS.TEMPLATE_ACCESS_OPTIONS.templateAccessPublic"),
      value: "Public",
    },
    {
      label: t(
        "ADVANCED_OPTIONS.TEMPLATE_ACCESS_OPTIONS.templateAccessPrivate"
      ),
      value: "Private",
    },
    {
      label: t("ADVANCED_OPTIONS.TEMPLATE_ACCESS_OPTIONS.templateAccessHidden"),
      value: "Hidden",
    },
  ];

  return {
    BASIC_INFO,
    CREATE_TEMPLATE_STEPS,
    CREATE_TEMPLATE_HEADING,
    ADVANCED_OPTIONS,
    CREATE_TEMPLATE_HEADER_ACTIONS,
    LABOUR_HOUR_OPTIONS,
    TEMPLATE_ACCESS_OPTIONS,
  };
};
