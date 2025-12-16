import type { QUESTION_OPTION_LABELS } from "../constants/questions";

export type QuestionOptionType =
  (typeof QUESTION_OPTION_LABELS)[keyof typeof QUESTION_OPTION_LABELS];

export type QuestionCardCollapsedProps = {
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

// TODO: update question section data type after API integration
export type question = {
  id: string;
  orderIndex: string;
  isRequired: boolean;
  label: string;
};

export type QuestionSectionProps = {
  title: string;
  orderindex: string;
  hasError?: boolean;
  data: question[];
};
