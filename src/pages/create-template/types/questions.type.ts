import type { QUESTION_OPTION_LABELS } from "../constants/questions";

export type QuestionOptionType =
  (typeof QUESTION_OPTION_LABELS)[keyof typeof QUESTION_OPTION_LABELS];
// TODO: update question section data type after API integration
export type QuestionProps = {
  id: number | string;
  orderIndex: string;
  isRequired: boolean;
  label: string;
  optiontypeLabel: QuestionOptionType;
  isTagBadgeVisible?: boolean;
  isPhotoBadgeVisible?: boolean;
  isFileBadgeVisible?: boolean;
  isRandomBadgeVisible?: boolean;
  isClusterBadgeVisible?: boolean;
  isAnswerBadgeVisible?: boolean;
  isPreviousBadgeVisible?: boolean;
  isNumberBadgeVisible?: boolean;
  isTemperatureBadgeVisible?: boolean;
  onLabelChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  hasError?: boolean;
};

export type QuestionSectionProps = {
  title: string;
  orderindex: string;
  hasError?: boolean;
  data: QuestionProps[];
  expandedList: Record<string, boolean>;
  toggleExpand: (id: string) => void;
};

export type QuestionCardProps = {
  question: QuestionProps;
  toggleExpand: (id: number | string) => void;
  expandedList?: Record<string | number, boolean>;
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
};

export type QuestionCardOptionProps = {
  linkCount?: number;
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
  messageSubject?: string;
  taskName?: string;
};

export type TriggerModalProps = {
  showModal: boolean;
  handleCloseModal: () => void;
  type: string;
  data: TriggerItem[];
  walkMeIdPrefix: string[];
};
