import type { FollowUpTaskSchema } from "../form-schema/steps/followup-tasks";
import type { NotificationSchema } from "../form-schema/steps/notifications";

export type TriggerCardProps = {
  item: NotificationSchema | FollowUpTaskSchema;
  index?: number;
  getQuestionLabelById?: (questionId: string) => string;
  getAnswerLabelById?: (questionId: string, answerId: string) => string;
  handleDelete?: () => void;
  handleEdit?: () => void;
  handleClone?: () => void;
  triggeredByAnswers?: boolean;
  type: string;
  walkMeIdPrefix?: string[];
};

export type NotificationCardProps = TriggerCardProps;

export type FollowUpCardProps = TriggerCardProps;

export type OrgProps = {
  orgId: number;
  name: string;
  code: string;
};

export type OrgPositionsProps = {
  id: number;
  name: string;
  orgId: number;
  orgLevelId: number;
};

export type OrgTypesProps = {
  orgTypeId: number;
  type: string;
  code: string;
  level: number;
};

export type OrgLevelProps = {
  orgLevelId: number;
  orgLevel: number;
  orgLevelName: string;
  orgTypes: number;
};
