import type {
  QuestionBadgePalettes,
  QuestionBadgeVariant,
} from "@/pages/create-template/types/questions.type";

export const questionBadgePalette: Record<
  QuestionBadgeVariant,
  QuestionBadgePalettes
> = {
  photo: {
    backgroundColor: "var(--logile-utility-blue-1a)",
    color: "var(--logile-utility-blue-dark-600)",
    iconColor: "var(--logile-icon-brand-primary)",
  },
  tag: {
    backgroundColor: "var(--logile-utility-green-1a)",
    color: "var(--logile-utility-green-dark-600)",
    iconColor: "var(--logile-icon-state-success-bold-subtle)",
  },
  tags: {
    backgroundColor: "var(--logile-utility-green-1a)",
    color: "var(--logile-utility-green-dark-600)",
    iconColor: "var(--logile-icon-state-success-bold-subtle)",
  },
  random: {
    backgroundColor: "var(--logile-utility-blue-1a)",
    color: "var(--logile-utility-blue-dark-600)",
    iconColor: "var(--logile-icon-brand-primary)",
  },
  cluster: {
    backgroundColor: "var(--logile-utility-blue-1a)",
    color: "var(--logile-utility-blue-dark-600)",
    iconColor: "var(--logile-icon-brand-primary)",
  },
  answer: {
    backgroundColor: "var(--logile-utility-blue-1a)",
    color: "var(--logile-utility-blue-dark-600)",
    iconColor: "var(--logile-icon-brand-primary)",
  },
  previous: {
    backgroundColor: "var(--logile-utility-blue-1a)",
    color: "var(--logile-utility-blue-dark-600)",
    iconColor: "var(--logile-icon-brand-primary)",
  },
  file: {
    backgroundColor: "var(--logile-utility-purple-1a)",
    color: "var(--logile-utility-purple-dark-600)",
    iconColor: "var(--logile-utility-purple-dark-600)",
  },
  number: {
    backgroundColor: "var(--logile-bg-state-warning-alpha)",
    color: "var(--logile-text-state-warning-bold)",
    iconColor: "var(--logile-border-state-warning-bold)",
  },
  temperature: {
    backgroundColor: "var(--logile-utility-orange-1a)",
    color: "var(--logile-text-state-warning-bold)",
    iconColor: "var(--logile-border-state-warning-bold)",
  },
};
