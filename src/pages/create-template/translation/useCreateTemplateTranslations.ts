import { useTranslation } from "react-i18next";
import {
  OPTION_TRIGGER_MENU_KEY,
  QUESTION_OPTION_LABELS,
  SECTION_SETTINGS_MENU_KEY,
} from "../constants/questions";
import {
  ArrowLeft,
  CalculatorQuestionBadge,
  Cluster,
  Delete,
  File,
  InlineEdit,
  Photo,
  Previous,
  Random,
  Tag,
  Temperature,
} from "@/core/constants/icons";
import type { IconColorType } from "@/core/types/icon.type";

export const useCreateTemplateTranslations = () => {
  const { t } = useTranslation("create-template");
  const { t: commonT } = useTranslation("common");

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
  const QUESTIONS = {
    header: t("QUESTIONS.header"),
    noQuestionPlaceholder: t("QUESTIONS.noQuestionPlaceholder"),
    addQuestionButtonLabel: t("QUESTIONS.addQuestionButtonLabel"),
    addSectionButtonLabel: t("QUESTIONS.addSectionButtonLabel"),
    SECTION_SETTINGS_MENU_OPTIONS: [
      {
        label: commonT("GENERAL.renameButtonLabel"),
        value: SECTION_SETTINGS_MENU_KEY.RENAME,
        leftIcon: InlineEdit,
      },
      {
        label: commonT("GENERAL.deleteButtonLabel"),
        value: SECTION_SETTINGS_MENU_KEY.DELETE,
        leftIcon: Delete,
        labelStyleProps: { color: "var(--logile-text-state-violation)" },
        leftIconStyleProps: { color: "violation" as IconColorType },
      },
    ],
    SECTION_ADD_EDIT_MODAL: {
      ADD_SECTION: {
        TITLE: t("QUESTIONS.SECTION_ADD_EDIT_MODAL.ADD_SECTION.title"),
        PRIMARY_ACTION: commonT("GENERAL.addButtonLabel"),
      },
      RENAME_SECTION: {
        TITLE: t("QUESTIONS.SECTION_ADD_EDIT_MODAL.RENAME_SECTION.title"),
        PRIMARY_ACTION: commonT("GENERAL.renameButtonLabel"),
      },
      FIELDS: {
        sectionName: t("QUESTIONS.SECTION_ADD_EDIT_MODAL.FIELDS.sectionName"),
        MEDIUM: "medium",
      },
    },
    DELETE_SECTION_MODAL: {
      title: t("QUESTIONS.DELETE_SECTION_MODAL.title"),
      description: t("QUESTIONS.DELETE_SECTION_MODAL.description"),
      confirmText: commonT("GENERAL.deleteButtonLabel"),
    },
    EXPANDED_QUESTION_CARD: {
      optionPlaceholder: t(
        "QUESTIONS.EXPANDED_QUESTION_CARD.optionPlaceholder"
      ),
      minLengthPlaceholder: t(
        "QUESTIONS.EXPANDED_QUESTION_CARD.minLengthPlaceholder"
      ),
      maxLengthPlaceholder: t(
        "QUESTIONS.EXPANDED_QUESTION_CARD.maxLengthPlaceholder"
      ),
      requiredPlaceholder: t(
        "QUESTIONS.EXPANDED_QUESTION_CARD.requiredPlaceholder"
      ),
      questionTextPlaceholder: t(
        "QUESTIONS.EXPANDED_QUESTION_CARD.questionTextPlaceholder"
      ),
    },
    EXPANDED_QUESTION_CARD_TAB_LABELS: {
      BASIC: {
        label: t("QUESTIONS.EXPANDED_QUESTION_CARD_TAB_LABELS.basicLabel"),
        value: "basic",
      },
      ADVANCED: {
        label: t("QUESTIONS.EXPANDED_QUESTION_CARD_TAB_LABELS.advancedLabel"),
        value: "advanced",
      },
    },
    QUESTION_OPTION_TYPES_DROPDOWN: [
      {
        label: t("QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.radioLabel"),
        value: QUESTION_OPTION_LABELS.RADIO,
      },
      {
        label: t(
          "QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.dropdownLabel"
        ),
        value: QUESTION_OPTION_LABELS.DROPDOWN,
      },
      {
        label: t(
          "QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.longInputLabel"
        ),
        value: QUESTION_OPTION_LABELS.LONG_INPUT,
      },
      {
        label: t("QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.label"),
        value: QUESTION_OPTION_LABELS.LABEL,
      },
      {
        label: t(
          "QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.dynamicDropdownLabel"
        ),
        value: QUESTION_OPTION_LABELS.DYNAMIC_DROPDOWN,
      },
    ],
    QUESTION_CARD: {
      QUESTION_TITLE_PLACEHOLDER: "Question Text",
    },
    OPTION_TRIGGER_MENU_OPTIONS: [
      {
        label: t("NOTIFICATIONS.heading"),
        value: OPTION_TRIGGER_MENU_KEY.Notification,
      },
      {
        label: t("FOLLOWUP_TASKS.heading"),
        value: OPTION_TRIGGER_MENU_KEY.FollowUp,
      },
    ],
  };
  const QUESTION_OPTION = {
    addOptionButtonLabel: t("QUESTION_OPTION.addOptionButtonLabel"),
    optionInputPlaceholder: t("QUESTION_OPTION.optionInputPlaceholder"),
    COMPLIANT_DROPDOWN_OPTIONS: {
      COMPLIANT: {
        label: t("QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.compliantLabel"),
        value: "Compliant",
      },
      NON_COMPLIANT: {
        label: t(
          "QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.nonCompliantLabel"
        ),
        value: "Non-Compliant",
      },
      NA: {
        label: t("QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.naLabel"),
        value: "NA",
      },
    },
    ADDITIONAL_INFO_DROPDOWN: {
      NO_ADDITIONAL_INFO: {
        label: t(
          "QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.noAdditionalInfoLabel"
        ),
        value: "No Additional Info",
      },
      OPTIONAL_INFO: {
        label: t("QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.optionalInfoLabel"),
        value: "Optional Info",
      },
      REQUIRED_INFO: {
        label: t("QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.requiredInfoLabel"),
        value: "Required Info",
      },
    },
  };
  const NOTIFICATIONS = {
    heading: t("NOTIFICATIONS.heading"),
    noNotificationsPlaceholder: t("NOTIFICATIONS.noNotificationsPlaceholder"),
    addNotificationButtonLabel: t("NOTIFICATIONS.addNotificationButtonLabel"),
    CARD_COLUMN_HEADINGS: {
      notification: t("NOTIFICATIONS.CARD_COLUMN_HEADINGS.notification"),
      condition: t("NOTIFICATIONS.CARD_COLUMN_HEADINGS.condition"),
      conditionQuestion: t(
        "NOTIFICATIONS.CARD_COLUMN_HEADINGS.conditionQuestion"
      ),
      conditionAnswer: t("NOTIFICATIONS.CARD_COLUMN_HEADINGS.conditionAnswer"),
      messageSubject: t("NOTIFICATIONS.CARD_COLUMN_HEADINGS.messageSubject"),
      recipients: t("NOTIFICATIONS.CARD_COLUMN_HEADINGS.recipients"),
    },
    TRIGGER_BY_ANSWER_GROUP: {
      notification: t("NOTIFICATIONS.TRIGGER_BY_ANSWER_GROUP.notification"),
      assigneeRecipient: t(
        "NOTIFICATIONS.TRIGGER_BY_ANSWER_GROUP.assigneeRecipient"
      ),
    },
    NO_DATA: t("NOTIFICATIONS.NO_DATA"),
  };
  const FOLLOWUP_TASKS = {
    heading: t("FOLLOWUP_TASKS.heading"),
    noFollowUpTasksPlaceholder: t("FOLLOWUP_TASKS.noFollowUpTasksPlaceholder"),
    addFollowUpTaskButtonLabel: t("FOLLOWUP_TASKS.addFollowUpTaskButtonLabel"),
    CARD_COLUMN_HEADINGS: {
      followUp: t("FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.followUp"),
      condition: t("FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.condition"),
      conditionQuestion: t(
        "FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.conditionQuestion"
      ),
      conditionAnswer: t("FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.conditionAnswer"),
      taskName: t("FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.taskName"),
      recipients: t("FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.recipients"),
    },
    TRIGGER_BY_ANSWER_GROUP: {
      followUp: t("FOLLOWUP_TASKS.TRIGGER_BY_ANSWER_GROUP.followUp"),
    },
    NO_DATA: t("FOLLOWUP_TASKS.NO_DATA"),
  };
  const QUESTION_BADGE_CONFIG = {
    photo: {
      icon: Photo,
      label: t("QUESTION_BADGE_CONFIG.photoLabel"),
      value: "photo",
    },
    random: {
      icon: Random,
      label: t("QUESTION_BADGE_CONFIG.randomLabel"),
      value: "random",
    },
    cluster: {
      icon: Cluster,
      label: t("QUESTION_BADGE_CONFIG.clusterLabel"),
      value: "cluster",
    },
    answer: {
      icon: ArrowLeft,
      label: t("QUESTION_BADGE_CONFIG.answerLabel"),
      value: "answer",
    },
    previous: {
      icon: Previous,
      label: t("QUESTION_BADGE_CONFIG.previousLabel"),
      value: "previous",
    },
    file: {
      icon: File,
      label: t("QUESTION_BADGE_CONFIG.fileLabel"),
      value: "file",
    },
    number: {
      icon: CalculatorQuestionBadge,
      label: t("QUESTION_BADGE_CONFIG.numberLabel"),
      value: "number",
    },
    temperature: {
      icon: Temperature,
      label: t("QUESTION_BADGE_CONFIG.temperatureLabel"),
      value: "temperature",
    },
    tag: {
      icon: Tag,
      label: t("QUESTION_BADGE_CONFIG.tagLabel"),
      count: 3,
      value: "tag",
      // TODO: label handled dynamically
    },
  };

  return {
    BASIC_INFO,
    CREATE_TEMPLATE_STEPS,
    CREATE_TEMPLATE_HEADING,
    ADVANCED_OPTIONS,
    CREATE_TEMPLATE_HEADER_ACTIONS,
    LABOUR_HOUR_OPTIONS,
    TEMPLATE_ACCESS_OPTIONS,
    QUESTIONS,
    NOTIFICATIONS,
    FOLLOWUP_TASKS,
    QUESTION_BADGE_CONFIG,
    QUESTION_OPTION,
  };
};
