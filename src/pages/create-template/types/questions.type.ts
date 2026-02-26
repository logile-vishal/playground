import type { Control, FieldValues } from "react-hook-form";

import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import type { TagOptionsType } from "@/pages/template-library/types/template-library.type";

import { type QUESTION_OPTION_LABELS } from "../constants/questions";

export type QuestionOptionType =
  (typeof QUESTION_OPTION_LABELS)[keyof typeof QUESTION_OPTION_LABELS];

export type QuestionTypeKey =
  | "radio"
  | "input"
  | "dropdown"
  | "checkbox"
  | "sort_input"
  | "long_input"
  | "label"
  | "dynamic_dropdown"
  | "barcode_scan"
  | "response_template"
  | "title";

type BasicDataProps = {
  questionType: QuestionTypeKey | null;
  title: string;
  response?:
    | {
        title: string;
        isCompliant?: boolean | null;
        additionalInfo?: {
          required: boolean;
          requiredType: string | null;
        };
        isDefault?: boolean;
        score?: number | null;
        formula?: string | null;
      }[]
    | null;
};

type AdvanceSettingsProps = {
  visibilityRule?: {
    storeClusters?: {
      isApplicable: boolean;
      clustersList?:
        | {
            clusterId: number;
            clusterName: string | null;
            clusterValueId: string;
            clusterValueName: string | null;
          }[]
        | []
        | null;
    };
    basedOnPreviousAnswers?: {
      isApplicable: boolean;
      previousAnswers?: {
        questionTitle: string | null;
      } | null;
      answerOption?: string | null;
    };
    isRandom?: boolean;
    previousExecutionStatus?: {
      isApplicable: boolean;
      status: string;
    };
  } | null;
  tags?:
    | {
        tagId?: number | null;
        tagName?: string;
        attributeId?: number | null;
        attributeName?: string;
      }[]
    | null;
  fileAttachments: {
    isApplicable: boolean;
    attachments: {
      attachmentType: "Photo" | "File" | null;
      requiredType:
        | "optional_for_all_answers"
        | "required_for_all_answers"
        | "required_for_compliant_answers"
        | "required_for_non_compliant_answers"
        | "required_for_specific_answers"
        | null;
      selectedOption?: {
        title: string | null;
      } | null;
    } | null;
  };
  numericValue: {
    isApplicable: boolean;
    type: string | null;
  } | null;
};

type tagType = {
  isTagBadgeVisible?: boolean;
  isPhotoBadgeVisible?: boolean;
  isFileBadgeVisible?: boolean;
  isRandomBadgeVisible?: boolean;
  isClusterBadgeVisible?: boolean;
  isAnswerBadgeVisible?: boolean;
  isPreviousBadgeVisible?: boolean;
  isNumberBadgeVisible?: boolean;
  isTemperatureBadgeVisible?: boolean;
  hasError?: boolean;
};

export type QuestionProps = tagType & {
  qId: string;
  index: string;
  questionId: number | null;
  questionTypeId: number | null;
  parentTemplateId: number | null;
  isRequired: boolean;
  questionBasicData: BasicDataProps;
  questionAdvancedSettings: AdvanceSettingsProps;
  subQuestions: QuestionProps[] | null;
};

export type QuestionSectionProps = {
  index: number | string;
  sectionId?: string;
  title: string;
  hasError?: boolean;
  data: QuestionProps[];
  questionFormPath?: string;
  expandedList: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  handleQuestionAdd: () => Promise<boolean>;
  isAddQuestionAllowed: boolean;
  walkMeIdPrefix?: string[];
  isExpanded?: boolean;
};

export type QuestionCardProps = {
  index: number | string;
  parentIndex?: number | string;
  sectionId?: string;
  question: QuestionProps;
  questionFormPath?: string;
  toggleExpand: (id: number | string) => void;
  expandedList?: Record<string | number, boolean>;
  handleQuestionAdd?: (afterQuestionId?: string) => Promise<boolean>;
  isAddQuestionAllowed: boolean;
  walkMeIdPrefix?: string[];
  hasError?: boolean;
};

export type QuestionBadgeVariant =
  | "photo"
  | "tag"
  | "tags"
  | "random"
  | "cluster"
  | "answer"
  | "previous"
  | "file"
  | "number"
  | "temperature";

export type QuestionBadgePalettes = {
  backgroundColor: string;
  color: string;
  iconColor: string;
};

export type QuestionBadgeProps = {
  type: string;
  count?: number;
};

export type ButtonConfigProps = {
  label?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

type triggerOptionProps = {
  answerNotificationList: Array<TriggerItem[]>;
  answerFollowUpList: Array<TriggerItem[]>;
  handleAddNotification: () => void;
  handleCloneNotification: () => void;
  handleEditNotification: () => void;
  handleDeleteNotification: () => void;
  handleCloseNotificationModal: () => void;
  showNotificationModal: {
    status: boolean;
    type: string | null;
    data: TriggerItem[] | null;
  };
  handleAddFollowUp: () => void;
  handleCloneFollowUp: () => void;
  handleEditFollowUp: () => void;
  handleDeleteFollowUp: () => void;
  handleCloseFollowUpModal: () => void;
  showFollowUpModal: {
    status: boolean;
    type: string | null;
    data: TriggerItem[] | null;
  };
  selectedQuestionInfo: {
    questionId: string | null;
    answerIndex: string | number | null;
  };
  setSelectedQuestionInfo: React.Dispatch<
    React.SetStateAction<{
      questionId: string | null;
      answerIndex: string | number | null;
    }>
  >;
};

export type QuestionCardOptionsProps = triggerOptionProps & {
  isVisible?: boolean;
  questionFormPath?: string;
  question?: QuestionProps;
  onAnswerOptionSettingsOpen?: (index: number) => void;
  walkMeIdPrefix?: string[];
};

export type QuestionCardOptionProps = triggerOptionProps & {
  linkCount?: number;
  idx: number;
  questionFormPath?: string;
  question?: QuestionProps;
  onAnswerOptionSettingsOpen?: (index: number) => void;
  walkMeIdPrefix?: string[];
};

export type TriggerCardMenuProps = {
  anchor: HTMLElement | null;
  status: boolean;
  data?: [] | null;
  type?: string;
};

export type TriggerItem = {
  recipients: string[];
  messageTemplates?: {
    id: number;
    subject: string;
  };
  triggerTaskName?: string;
  customRecipients?: {
    recipientOrgs?: string[];
    recipientOrgTypes?: string[];
    recipientPositions?: string[];
  };
};

export type TriggerModalProps = {
  showModal: boolean;
  handleCloseModal: () => void;
  type: string;
  walkMeIdPrefix: string[];
  handleAdd: () => void;
  handleClone: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
  handleClose: () => void;
  data: TriggerItem[] | null;
  selectedQuestionInfo: {
    questionId: string;
    answerIndex: string | number;
  } | null;
  showAddEditModal?: {
    status: boolean;
    type: string;
    data: TriggerItem[] | null;
    quesId?: string;
    answerIndex?: string | number;
  };
  triggerCardModal?: {
    status: boolean;
    type: string | null;
    data: unknown;
    quesId?: string;
    answerIndex?: string | number;
  };
};

export type AttachmentItemProps = {
  item: {
    fileName?: string;
    fileUrl?: string;
  };
  index: number;
  onDelete: (index: number) => void;
};

export type SectionTypeProps = {
  label: string;
  value: QuestionTypeKey;
};

export type AnswerOptionSettingProps = {
  status: boolean;
  data: QuestionProps | null;
  activeIndex: number | null;
};

export type AnswerOptionSettingModalProps = {
  answerNotificationList: Array<TriggerItem[]>;
  answerFollowUpList: Array<TriggerItem[]>;
  answerOptionSettingModal?: AnswerOptionSettingProps;
  onClose: () => void;
  onSubmit: (option) => void;
  shouldProceedAllowed: boolean;
  setShouldProceedAllowed: React.Dispatch<React.SetStateAction<boolean>>;
  triggerCardModal: {
    status: boolean;
    data: TriggerItem[] | null;
    type: string | null;
  };
  setTriggerCardModal: (modalState: {
    status: boolean;
    data: unknown;
    type: unknown;
  }) => void;
  setSelectedQuestionInfo: React.Dispatch<
    React.SetStateAction<{
      questionId: string | null;
      answerIndex: string | number | null;
    }>
  >;
};

export type InputTypeContentProps = {
  questionFormPath?: string;
  control: Control<FieldValues>;
};

export type InputTypeModalProps = {
  questionFormPath?: string;
  inputTypeModal: {
    status: boolean;
    data: null;
  };
  onClose: () => void;
};

export type TemplateTagsProps = {
  tagId: number;
  tagName: string;
  tagValue?: string;
  attributeId: number;
  attributeName: string;
  attributeValue?: string;
};

export type AdvanceTabProps = {
  questionFormPath: string;
  question: QuestionProps;
  questionIndex: string | number;
};
export type QuestionOption = {
  label: string;
  value: string;
  optionId?: string;
  title?: string;
};

export type ClusterValueItem = {
  clusterId: string;
  clusterName: string;
  clusterValueId: string | null;
  clusterValueName: string | null;
};

export type ClusterItem = {
  clusterId: string;
  clusterName: string;
  clusterValues: ClusterValueItem[] | null;
};

export type VisibilityTabProps = {
  questionFormPath: string;
  control: Control<FieldValues>;
  questionIndex: string | number;
  question: QuestionProps;
};

export type TagsTabProps = {
  questionFormPath: string;
  control: Control<FieldValues>;
};

export type NumericTabProps = {
  questionFormPath: string;
  control: Control<FieldValues>;
};

export type AttachmentsTabProps = {
  questionFormPath: string;
  control: Control<FieldValues>;
  question: QuestionProps;
};

export type ExtendedTagOption = TagOptionsType & {
  label: string;
  value: string;
  filterPath: string;
  subMenu?: { items: NestedMenuItem[] };
};
