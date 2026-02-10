import type { Control, FieldValues } from "react-hook-form";

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
      isEnabled: boolean;
      clustersList?:
        | {
            clusterId: string;
            clusterName: string | null;
            clusterValueId: string;
            clusterValueName: string | null;
          }[]
        | []
        | null;
    };
    basedOnPreviousAnswers?: {
      isEnabled: boolean;
    };
    isRandom?: boolean;
    previousExecutionStatus?: {
      isEnabled: boolean;
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
    isEnabled: boolean;
    attachments: {
      attachmentType:
        | "Photo"
        | "Barcode"
        | "Temperature Probe"
        | "Numeric"
        | "Attachment"
        | null;
      required: boolean;
      requiredType:
        | "Always"
        | "In compliance only"
        | "Out of compliance only"
        | null;
    } | null;
  };
  numericValue: {
    isEnabled: boolean;
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

export type QuestionCardOptionsProps = {
  isVisible?: boolean;
  questionFormPath?: string;
  question?: QuestionProps;
  onAnswerOptionSettingsOpen?: (index: number) => void;
};

export type QuestionCardOptionProps = {
  linkCount?: number;
  idx: number;
  questionFormPath?: string;
  question?: QuestionProps;
  onAnswerOptionSettingsOpen?: (index: number) => void;
};

export type TriggerCardMenuProps = {
  anchor: HTMLElement | null;
  status: boolean;
  data?: [] | null;
  type?: string;
};

export type TriggerItem = {
  id: number;
  recipients: string[];
  messageTemplate?: {
    id: number;
    subject: string;
  };
  triggerTaskName?: string;
};

export type TriggerModalProps = {
  showModal: boolean;
  handleCloseModal: () => void;
  type: string;
  data: TriggerItem[];
  walkMeIdPrefix: string[];
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
