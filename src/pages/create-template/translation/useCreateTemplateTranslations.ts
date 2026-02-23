import { useTranslation } from "@/core/hooks/useTranslation";
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

import {
  ATTACHMENTS_ENUM,
  DATE_TIME_INPUT_TYPE,
  INPUT_TYPE,
  OPTION_ATTACHMENT_REQUIRED_TYPE_ENUMS,
  OPTION_TRIGGER_MENU_KEY,
  QUESTION_TYPE,
  RESPONSE_TEMPLATE_TYPE,
  SECTION_SETTINGS_MENU_KEY,
} from "../constants/questions";
import { TRIGGER_CONDITIONS } from "../constants/triggers";
import type { QuestionTypeKey } from "../types/questions.type";
import {
  FOLLOW_UP_DURATION_OPTIONS,
  FOLLOW_UP_PRIMARY_POSITION_OPTIONS,
  FOLLOW_UP_PRIORITY_OPTIONS,
  FOLLOW_UP_REMINDER_NOTIFICATION_OPTIONS,
  FOLLOW_UP_STEPPER,
  FOLLOW_UP_TASK_SHARING_OPTIONS,
} from "../constants/follow-up";

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
    attachment: t("BASIC_INFO.attachment"),
    addFile: t("BASIC_INFO.addFile"),
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
    columns: {
      label: t("CREATE_TEMPLATE_STEPS.columnsLabel"),
      value: "columns",
    },
    rows: {
      label: t("CREATE_TEMPLATE_STEPS.rowsLabel"),
      value: "rows",
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
    oneQuestionRequiredError: t("QUESTIONS.oneQuestionRequiredError"),
    DRAG_DELETE_SECTION_MODAL: {
      title: t("QUESTIONS.DRAG_DELETE_SECTION_MODAL.title"),
      description: t("QUESTIONS.DRAG_DELETE_SECTION_MODAL.description"),
    },
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
    DELETE_QUESTION_REORDERING_MODAL: {
      title: t("QUESTIONS.DELETE_QUESTION_REORDERING_MODAL.title"),
      description: t("QUESTIONS.DELETE_QUESTION_REORDERING_MODAL.description"),
      confirmText: commonT("GENERAL.continueAnywayButtonLabel"),
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
      setInputTypePlaceholder: t(
        "QUESTIONS.EXPANDED_QUESTION_CARD.setInputTypePlaceholder"
      ),
      dynamicDropdownAnswersFromTags: t(
        "QUESTIONS.EXPANDED_QUESTION_CARD.dynamicDropdownAnswersFromTags"
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
        value: QUESTION_TYPE.RADIO as QuestionTypeKey,
      },
      {
        label: t(
          "QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.dropdownLabel"
        ),
        value: QUESTION_TYPE.DROPDOWN as QuestionTypeKey,
      },
      {
        label: t(
          "QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.longInputLabel"
        ),
        value: QUESTION_TYPE.LONG_INPUT as QuestionTypeKey,
      },
      {
        label: t("QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.label"),
        value: QUESTION_TYPE.LABEL as QuestionTypeKey,
      },
      {
        label: t(
          "QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.dynamicDropdownLabel"
        ),
        value: QUESTION_TYPE.DYNAMIC_DROPDOWN as QuestionTypeKey,
      },
      {
        label: t(
          "QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.checkboxLabel"
        ),
        value: QUESTION_TYPE.CHECKBOX as QuestionTypeKey,
      },
      {
        label: t(
          "QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.sortInputLabel"
        ),
        value: QUESTION_TYPE.SORT_INPUT as QuestionTypeKey,
      },
      {
        label: t(
          "QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.barcodeScanLabel"
        ),
        value: QUESTION_TYPE.BARCODE_SCAN as QuestionTypeKey,
      },
      {
        label: t(
          "QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN_LABELS.responseTemplateLabel"
        ),
        value: QUESTION_TYPE.RESPONSE_TEMPLATE as QuestionTypeKey,
      },
    ],
    INPUT_TYPE_OPTIONS: [
      {
        label: t("QUESTIONS.INPUT_TYPE_OPTIONS.anyCharactersLabel"),
        value: INPUT_TYPE.ANY_CHARACTERS,
      },
      {
        label: t("QUESTIONS.INPUT_TYPE_OPTIONS.textOnlyLabel"),
        value: INPUT_TYPE.TEXT_ONLY,
      },
      {
        label: t("QUESTIONS.INPUT_TYPE_OPTIONS.numberOnlyLabel"),
        value: INPUT_TYPE.NUMBER_ONLY,
      },
      {
        label: t("QUESTIONS.INPUT_TYPE_OPTIONS.dateTimeLabel"),
        value: INPUT_TYPE.DATE_TIME,
      },
    ],
    DATE_VIEW_OPTIONS: [
      {
        label: t("QUESTIONS.DATE_VIEW_OPTIONS.dateOnlyLabel"),
        value: DATE_TIME_INPUT_TYPE.DATE_ONLY,
      },
      {
        label: t("QUESTIONS.DATE_VIEW_OPTIONS.timeOnlyLabel"),
        value: DATE_TIME_INPUT_TYPE.TIME_ONLY,
      },
      {
        label: t("QUESTIONS.DATE_VIEW_OPTIONS.dateAndTimeLabel"),
        value: DATE_TIME_INPUT_TYPE.DATE_AND_TIME,
      },
    ],
    RESPONSE_TEMPLATE_OPTIONS: [
      {
        label: t("QUESTIONS.RESPONSE_TEMPLATE_OPTIONS.markWhenCompleteLabel"),
        value: RESPONSE_TEMPLATE_TYPE.MARK_WHEN_COMPLETE,
      },
      {
        label: t("QUESTIONS.RESPONSE_TEMPLATE_OPTIONS.rankLabel"),
        value: RESPONSE_TEMPLATE_TYPE.RANK,
      },
      {
        label: t("QUESTIONS.RESPONSE_TEMPLATE_OPTIONS.tempLabel"),
        value: RESPONSE_TEMPLATE_TYPE.TEMP,
      },
      {
        label: t("QUESTIONS.RESPONSE_TEMPLATE_OPTIONS.yesNoLabel"),
        value: RESPONSE_TEMPLATE_TYPE.YES_NO,
      },
      {
        label: t("QUESTIONS.RESPONSE_TEMPLATE_OPTIONS.manualTempLabel"),
        value: RESPONSE_TEMPLATE_TYPE.MANUAL_TEMP,
      },
    ],
    QUESTION_TYPE_LABELS: {
      minLengthPlaceholder: t(
        "QUESTIONS.QUESTION_TYPE_LABELS.minLengthPlaceholder"
      ),
      maxLengthPlaceholder: t(
        "QUESTIONS.QUESTION_TYPE_LABELS.maxLengthPlaceholder"
      ),
      minValuePlaceholder: t(
        "QUESTIONS.QUESTION_TYPE_LABELS.minValuePlaceholder"
      ),
      maxValuePlaceholder: t(
        "QUESTIONS.QUESTION_TYPE_LABELS.maxValuePlaceholder"
      ),
      optionsLabel: t("QUESTIONS.QUESTION_TYPE_LABELS.optionsLabel"),
      setInputTypeLabel: t("QUESTIONS.QUESTION_TYPE_LABELS.setInputTypeLabel"),
      submitButton: t("QUESTIONS.QUESTION_TYPE_LABELS.submitButton"),
      cancelButton: t("QUESTIONS.QUESTION_TYPE_LABELS.cancelButton"),
      inputTypeLabel: t("QUESTIONS.QUESTION_TYPE_LABELS.inputTypeLabel"),
    },
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
    errorTextNoOptions: t("QUESTION_OPTION.errorTextNoOptions"),
    COMPLIANT_DROPDOWN_OPTIONS: {
      COMPLIANT: {
        label: t("QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.compliantLabel"),
        value: true,
      },
      NON_COMPLIANT: {
        label: t(
          "QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.nonCompliantLabel"
        ),
        value: false,
      },
      NA: {
        label: t("QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.naLabel"),
        value: null,
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
    ANSWER_OPTION_SETTING_MODAL: {
      title: t("QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.title"),
      answerOptionsHeading: t(
        "QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.answerOptionsHeading"
      ),
      settingAnswerValueLabel: t(
        "QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.settingAnswerValueLabel"
      ),
      settingsForLabel: t(
        "QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.settingsForLabel"
      ),
      labels: {
        value: t("QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.labels.value"),
        default: t(
          "QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.labels.default"
        ),
        compliance: t(
          "QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.labels.compliance"
        ),
        score: t("QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.labels.score"),
        additionalInfo: t(
          "QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.labels.additionalInfo"
        ),
        formula: t(
          "QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.labels.formula"
        ),
      },
      placeholder: {
        scoreInput: t(
          "QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.placeholder.scoreInput"
        ),
        formulaInput: t(
          "QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.placeholder.formulaInput"
        ),
      },
      UNSAVED_CHANGES_MODAL: {
        title: t(
          "QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.UNSAVED_CHANGES_MODAL.title"
        ),
        confirmText: t(
          "QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.UNSAVED_CHANGES_MODAL.confirmText"
        ),
        bodyText: t(
          "QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.UNSAVED_CHANGES_MODAL.bodyText"
        ),
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
    ADD_NOTIFICATION_MODAL: {
      addNotification: t(
        "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.addNotification"
      ),
      editNotification: t(
        "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.editNotification"
      ),
      cloneNotification: t(
        "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.cloneNotification"
      ),
      deleteNotification: t(
        "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.deleteNotification"
      ),
      deleteNotificationDescription: t(
        "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.deleteNotificationDescription"
      ),
      deleteNotificationSubDescription: t(
        "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.deleteNotificationSubDescription"
      ),
      fields: {
        condition: t("NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields.condition"),
        conditionPlaceholder: t(
          "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields.conditionPlaceholder"
        ),
        conditionQuestion: t(
          "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields.conditionQuestion"
        ),
        conditionQuestionPlaceholder: t(
          "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields.conditionQuestionPlaceholder"
        ),
        conditionTooltip: t(
          "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields.conditionTooltip"
        ),
        conditionAnswer: t(
          "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields.conditionAnswer"
        ),
        conditionAnswerPlaceholder: t(
          "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields.conditionAnswerPlaceholder"
        ),
        recipients: t("NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields.recipients"),
        messageSubject: t(
          "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields.messageSubject"
        ),
        messageBody: t(
          "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields.messageBody"
        ),
      },
      labels: {
        to: t("NOTIFICATIONS.ADD_NOTIFICATION_MODAL.labels.to"),
        customRecipient: t(
          "NOTIFICATIONS.ADD_NOTIFICATION_MODAL.labels.customRecipient"
        ),
        subject: t("NOTIFICATIONS.ADD_NOTIFICATION_MODAL.labels.subject"),
        message: t("NOTIFICATIONS.ADD_NOTIFICATION_MODAL.labels.message"),
      },
    },
    CUSTOM_RECIPIENT_MODAL: {
      title: t("NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.title"),
      orgLevel: t("NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgLevel"),
      orgLevelPlaceholder: t(
        "NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgLevelPlaceholder"
      ),
      positionsPlaceholder: t(
        "NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.positionsPlaceholder"
      ),
      orgPlaceholder: t("NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgPlaceholder"),
      orgTypePlaceholder: t(
        "NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgTypePlaceholder"
      ),
      positions: t("NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.positions"),
      org: t("NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.org"),
      orgType: t("NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgType"),
      relative: t("NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.relative"),
      CONDITION_OPTIONS: [
        {
          label: t(
            "NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.CONDITION_OPTIONS.taskCompleted"
          ),
          value: TRIGGER_CONDITIONS.TASK_COMPLETED,
        },
        {
          label: t(
            "NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.CONDITION_OPTIONS.taskExpired"
          ),
          value: TRIGGER_CONDITIONS.TASK_EXPIRED,
        },
        {
          label: t(
            "NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.CONDITION_OPTIONS.taskOutOfCompliance"
          ),
          value: TRIGGER_CONDITIONS.TASK_COMPLIANCE,
        },
        {
          label: t(
            "NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.CONDITION_OPTIONS.answer"
          ),
          value: TRIGGER_CONDITIONS.ANSWER,
        },
      ],
      RECIPIENT_OPTIONS: {
        assignee: t(
          "NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.RECIPIENT_OPTIONS.assignee"
        ),
        supervisor: t(
          "NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.RECIPIENT_OPTIONS.supervisor"
        ),
        executionManager: t(
          "NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.RECIPIENT_OPTIONS.executionManager"
        ),
      },
    },
  };
  const FOLLOWUP_TASKS = {
    heading: t("FOLLOWUP_TASKS.heading"),
    noFollowUpTasksPlaceholder: t("FOLLOWUP_TASKS.noFollowUpTasksPlaceholder"),
    addFollowUpTaskButtonLabel: t("FOLLOWUP_TASKS.addFollowUpTaskButtonLabel"),
    deleteFollowUpTask: t("FOLLOWUP_TASKS.deleteFollowUpTask"),
    deleteFollowUpTaskDescription: t(
      "FOLLOWUP_TASKS.deleteFollowUpTaskDescription"
    ),
    deleteFollowUpTaskSubDescription: t(
      "FOLLOWUP_TASKS.deleteFollowUpTaskSubDescription"
    ),
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
    TRIGGER_MODAL: {
      orgLabel: t("FOLLOWUP_TASKS.TRIGGER_MODAL.orgLabel"),
      orgTypeLabel: t("FOLLOWUP_TASKS.TRIGGER_MODAL.orgTypeLabel"),
      orgPositionLabel: t("FOLLOWUP_TASKS.TRIGGER_MODAL.orgPositionLabel"),
    },
    ADD_FOLLOWUP_TASK_MODAL: {
      MODAL_TITLE: {
        add: t("FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.MODAL_TITLE.add"),
        edit: t("FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.MODAL_TITLE.edit"),
        clone: t("FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.MODAL_TITLE.clone"),
      },
      STEPPER: {
        condition: {
          label: t("FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.condition"),
          value: FOLLOW_UP_STEPPER.CONDITION,
        },
        recipients: {
          label: t("FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.recipients"),
          value: FOLLOW_UP_STEPPER.RECIPIENTS,
        },
        template: {
          label: t("FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.template"),
          value: FOLLOW_UP_STEPPER.TEMPLATE,
        },
        settings: {
          label: t("FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.settings"),
          value: FOLLOW_UP_STEPPER.SETTINGS,
        },
      },
      PLACEHOLDER: {
        chooseCondition: t(
          "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.PLACEHOLDER.chooseCondition"
        ),
        chooseConditionQuestion: t(
          "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.PLACEHOLDER.chooseConditionQuestion"
        ),
        chooseConditionAnswer: t(
          "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.PLACEHOLDER.chooseConditionAnswer"
        ),
      },
      taskNameLabel: t("FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.taskNameLabel"),
      taskSharingLabel: t(
        "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.taskSharingLabel"
      ),
      primaryPositionLabel: t(
        "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.primaryPositionLabel"
      ),
      primaryPositionPlaceholder: t(
        "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.primaryPositionPlaceholder"
      ),
      selectedTemplate: t(
        "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.selectedTemplate"
      ),
      changeTemplate: t(
        "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.changeTemplate"
      ),
      directoryTree: t("FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.directoryTree"),
      selectButton: t("FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.selectButton"),
      TASK_SHARING_OPTIONS: [
        {
          label: t(
            "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.TASK_SHARING_OPTIONS.yes"
          ),
          value: FOLLOW_UP_TASK_SHARING_OPTIONS.YES,
        },
        {
          label: t(
            "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.TASK_SHARING_OPTIONS.no"
          ),
          value: FOLLOW_UP_TASK_SHARING_OPTIONS.NO,
        },
      ],
      PRIMARY_POSITION_OPTIONS: [
        {
          label: t(
            "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.PRIMARY_POSITION_OPTIONS.assignee"
          ),
          value: FOLLOW_UP_PRIMARY_POSITION_OPTIONS.ASSIGNEE,
        },
        {
          label: t(
            "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.PRIMARY_POSITION_OPTIONS.districtManager"
          ),
          value: FOLLOW_UP_PRIMARY_POSITION_OPTIONS.DISTRICT_MANAGER,
        },
      ],
      FOLLOW_UP_CONDITION_OPTIONS: {
        taskCompleted: t(
          "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.FOLLOW_UP_CONDITION_OPTIONS.taskCompleted"
        ),
        taskExpired: t(
          "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.FOLLOW_UP_CONDITION_OPTIONS.taskExpired"
        ),
        taskOutOfCompliance: t(
          "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.FOLLOW_UP_CONDITION_OPTIONS.taskOutOfCompliance"
        ),
        answer: t(
          "FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.FOLLOW_UP_CONDITION_OPTIONS.answer"
        ),
      },
    },
    TABLE: {
      HEADING: {
        directory: t("FOLLOWUP_TASKS.TABLE.HEADING.directory"),
        templateName: t("FOLLOWUP_TASKS.TABLE.HEADING.templateName"),
        type: t("FOLLOWUP_TASKS.TABLE.HEADING.type"),
        lastModifiedTime: t("FOLLOWUP_TASKS.TABLE.HEADING.lastModifiedTime"),
        preview: t("FOLLOWUP_TASKS.TABLE.HEADING.preview"),
      },
      noDirectories: t("FOLLOWUP_TASKS.TABLE.noDirectories"),
    },
    FOLLOWUP_TASKS_SETTINGS: {
      retainVisibilityLabel: t(
        "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.retainVisibilityLabel"
      ),
      durationLabel: t("FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.durationLabel"),
      durationPlaceholder: t(
        "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.durationPlaceholder"
      ),
      durationErrorLabel: t(
        "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.durationErrorLabel"
      ),
      priorityLabel: t("FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.priorityLabel"),
      priorityPlaceholder: t(
        "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.priorityPlaceholder"
      ),
      reminderNotificationLabel: t(
        "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.reminderNotificationLabel"
      ),
      reminderNotificationPlaceholder: t(
        "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.reminderNotificationPlaceholder"
      ),
      taskEndTimeLabel: t(
        "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.taskEndTimeLabel"
      ),
      DURATION_OPTIONS: [
        {
          label: t(
            "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.DURATION_OPTIONS.minutes"
          ),
          value: FOLLOW_UP_DURATION_OPTIONS.MINUTES,
        },

        {
          label: t(
            "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.DURATION_OPTIONS.hours"
          ),
          value: FOLLOW_UP_DURATION_OPTIONS.HOURS,
        },
        {
          label: t(
            "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.DURATION_OPTIONS.days"
          ),
          value: FOLLOW_UP_DURATION_OPTIONS.DAY,
        },
      ],
      PRIORITY_OPTIONS: [
        {
          label: t(
            "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.PRIORITY_OPTIONS.critical"
          ),
          value: FOLLOW_UP_PRIORITY_OPTIONS.CRITICAL,
        },
        {
          label: t(
            "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.PRIORITY_OPTIONS.high"
          ),
          value: FOLLOW_UP_PRIORITY_OPTIONS.HIGH,
        },
        {
          label: t(
            "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.PRIORITY_OPTIONS.medium"
          ),
          value: FOLLOW_UP_PRIORITY_OPTIONS.MEDIUM,
        },
        {
          label: t(
            "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.PRIORITY_OPTIONS.low"
          ),
          value: FOLLOW_UP_PRIORITY_OPTIONS.LOW,
        },
      ],
      REMINDER_NOTIFICATION_OPTIONS: [
        {
          label: t(
            "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.REMINDER_NOTIFICATION_OPTIONS.none"
          ),
          value: FOLLOW_UP_REMINDER_NOTIFICATION_OPTIONS.NONE,
        },
        {
          label: t(
            "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.REMINDER_NOTIFICATION_OPTIONS.taskDueTime"
          ),
          value: FOLLOW_UP_REMINDER_NOTIFICATION_OPTIONS.TASK_DUE_TIME,
        },
        {
          label: t(
            "FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.REMINDER_NOTIFICATION_OPTIONS.taskNotStarted"
          ),
          value: FOLLOW_UP_REMINDER_NOTIFICATION_OPTIONS.TASK_NOT_STARTED,
        },
      ],
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
      value: "tag",
    },
    tags: {
      icon: Tag,
      label: t("QUESTION_BADGE_CONFIG.tagsLabel"),
      value: "tags",
    },
  };

  const COLUMNS = {
    header: t("COLUMNS.header"),
    noColumnPlaceholder: t("COLUMNS.noColumnPlaceholder"),
    addColumnButtonLabel: t("COLUMNS.addColumnButtonLabel"),
    oneColumnRequiredError: t("COLUMNS.oneColumnRequiredError"),
  };

  const ROWS = {
    header: t("ROWS.header"),
    noRowPlaceholder: t("ROWS.noRowPlaceholder"),
    addRowButtonLabel: t("ROWS.addRowButtonLabel"),
    oneRowRequiredError: t("ROWS.oneRowRequiredError"),
  };

  const ADVANCED_TAB_OPTIONS = {
    VISIBILITY: {
      label: t("ADVANCED_TAB_OPTIONS.VISIBILITY.label"),
      visibilityNoteHeading: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.visibilityNoteHeading"
      ),
      visibilityNoteContent: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.visibilityNoteContent"
      ),
      storeClusterToggleLabel: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.storeClusterToggleLabel"
      ),
      storeClusterLabel: t("ADVANCED_TAB_OPTIONS.VISIBILITY.storeClusterLabel"),
      storeClusterPlaceholder: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.storeClusterPlaceholder"
      ),
      previousAnswerToggleLabel: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.previousAnswerToggleLabel"
      ),
      previousAnswerPlaceholder: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.previousAnswerPlaceholder"
      ),
      previousQuestionPlaceholder: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.previousQuestionPlaceholder"
      ),
      previousAnswerWarningOnPreviousAnswer: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.previousAnswerWarningOnPreviousAnswer"
      ),
      getPreviousAnswerWarningOnVisibility: (questionIndex: string): string => {
        return t(
          "ADVANCED_TAB_OPTIONS.VISIBILITY.previousAnswerWarningOnVisibility",
          { questionIndex }
        );
      },
      randomAppearanceToggleLabel: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.randomAppearanceToggleLabel"
      ),
      randomAppearanceWarning: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.randomAppearanceWarning"
      ),
      previousExecutionToggleLabel: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.previousExecutionToggleLabel"
      ),
      previousExecutionLabel: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.previousExecutionLabel"
      ),
      previousExecutionPlaceholder: t(
        "ADVANCED_TAB_OPTIONS.VISIBILITY.previousExecutionPlaceholder"
      ),
    },
    TAGS: {
      label: t("ADVANCED_TAB_OPTIONS.TAGS.label"),
      tagsPlaceholder: t("ADVANCED_TAB_OPTIONS.TAGS.tagsPlaceholder"),
      tagsLabel: t("ADVANCED_TAB_OPTIONS.TAGS.tagsLabel"),
    },
    FILE_ATTACHMENT: {
      label: t("ADVANCED_TAB_OPTIONS.FILE_ATTACHMENT.label"),
      fileAttachmentToggleLabel: t(
        "ADVANCED_TAB_OPTIONS.FILE_ATTACHMENT.fileAttachmentToggleLabel"
      ),
      fileAttachmentTypeLabel: t(
        "ADVANCED_TAB_OPTIONS.FILE_ATTACHMENT.fileAttachmentTypeLabel"
      ),
      fileAttachmentRequiredForLabel: t(
        "ADVANCED_TAB_OPTIONS.FILE_ATTACHMENT.fileAttachmentRequiredForLabel"
      ),
      fileAttachmentAnswerLabel: t(
        "ADVANCED_TAB_OPTIONS.FILE_ATTACHMENT.fileAttachmentAnswerLabel"
      ),
      fileAttachmentAnswerPlaceholder: t(
        "ADVANCED_TAB_OPTIONS.FILE_ATTACHMENT.fileAttachmentAnswerPlaceholder"
      ),
    },
    NUMERIC_VALUE: {
      label: t("ADVANCED_TAB_OPTIONS.NUMERIC_VALUE.label"),
      numericValueToggleLabel: t(
        "ADVANCED_TAB_OPTIONS.NUMERIC_VALUE.numericValueToggleLabel"
      ),
      numericValueTypeLabel: t(
        "ADVANCED_TAB_OPTIONS.NUMERIC_VALUE.numericValueTypeLabel"
      ),
    },
  };

  const ADVANCED_TAB_FILE_TYPES = [
    {
      label: t("ADVANCED_TAB_ATTACHMENT_OPTIONS.FILE_TYPES.photo"),
      value: ATTACHMENTS_ENUM[0],
    },
    {
      label: t("ADVANCED_TAB_ATTACHMENT_OPTIONS.FILE_TYPES.file"),
      value: ATTACHMENTS_ENUM[1],
    },
  ];

  const ADVANCED_TAB_PREVIOUS_EXECUTION_STATUS = [
    {
      label: t("PREVIOUS_EXECUTION_STATUS_OPTIONS.completedLabel"),
      value: "completed",
    },
    {
      label: t("PREVIOUS_EXECUTION_STATUS_OPTIONS.notCompletedLabel"),
      value: "not_completed",
    },
  ];

  const ADVANCED_TAB_FILE_REQUIRED_FOR_OPTIONS_MULTISELECT = [
    {
      label: t(
        "ADVANCED_TAB_ATTACHMENT_OPTIONS.REQUIRED_FOR_OPTIONS.optionalForAllAnswers"
      ),
      value: OPTION_ATTACHMENT_REQUIRED_TYPE_ENUMS[0],
    },
    {
      label: t(
        "ADVANCED_TAB_ATTACHMENT_OPTIONS.REQUIRED_FOR_OPTIONS.requiredForAllAnswers"
      ),
      value: OPTION_ATTACHMENT_REQUIRED_TYPE_ENUMS[1],
    },
    {
      label: t(
        "ADVANCED_TAB_ATTACHMENT_OPTIONS.REQUIRED_FOR_OPTIONS.requiredForCompliantAnswers"
      ),
      value: OPTION_ATTACHMENT_REQUIRED_TYPE_ENUMS[2],
    },
    {
      label: t(
        "ADVANCED_TAB_ATTACHMENT_OPTIONS.REQUIRED_FOR_OPTIONS.requiredForNonCompliantAnswers"
      ),
      value: OPTION_ATTACHMENT_REQUIRED_TYPE_ENUMS[3],
    },
    {
      label: t(
        "ADVANCED_TAB_ATTACHMENT_OPTIONS.REQUIRED_FOR_OPTIONS.requiredForSpecificAnswers"
      ),
      value: OPTION_ATTACHMENT_REQUIRED_TYPE_ENUMS[4],
    },
  ];

  const ADVANCED_TAB_FILE_REQUIRED_FOR_OPTIONS = [
    {
      label: t(
        "ADVANCED_TAB_ATTACHMENT_OPTIONS.REQUIRED_FOR_OPTIONS.optionalForAllAnswers"
      ),
      value: OPTION_ATTACHMENT_REQUIRED_TYPE_ENUMS[0],
    },
    {
      label: t(
        "ADVANCED_TAB_ATTACHMENT_OPTIONS.REQUIRED_FOR_OPTIONS.requiredForAllAnswers"
      ),
      value: OPTION_ATTACHMENT_REQUIRED_TYPE_ENUMS[1],
    },
  ];

  const ADVANCED_TAB_NUMERIC_VALUE_TYPE_OPTIONS = [
    {
      label: t("ADVANCED_TAB_NUMERIC_VALUE_OPTIONS.temperatureReading"),
      value: "temperature_reading",
    },
    {
      label: t("ADVANCED_TAB_NUMERIC_VALUE_OPTIONS.manualInput"),
      value: "manual_input",
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
    QUESTIONS,
    NOTIFICATIONS,
    FOLLOWUP_TASKS,
    QUESTION_BADGE_CONFIG,
    QUESTION_OPTION,
    COLUMNS,
    ROWS,
    ADVANCED_TAB_OPTIONS,
    ADVANCED_TAB_FILE_TYPES,
    ADVANCED_TAB_FILE_REQUIRED_FOR_OPTIONS,
    ADVANCED_TAB_FILE_REQUIRED_FOR_OPTIONS_MULTISELECT,
    ADVANCED_TAB_NUMERIC_VALUE_TYPE_OPTIONS,
    ADVANCED_TAB_PREVIOUS_EXECUTION_STATUS,
  };
};
