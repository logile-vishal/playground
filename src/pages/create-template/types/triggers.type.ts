export type TriggerCardProps = {
  item: {
    id: number;
    index?: string;
    condition?: string;
    questionId?: string;
    answerIndex?: string;
    messageTemplates?: {
      id: number;
      subject: string;
      body: string;
    };
    triggerTaskName?: string;
    recipients?: string[];
    recipientsIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
    recipientOrgs?: [];
    recipientOrgTypes?: [];
    recipientPositions?: [];
    recipientOrgTypePositions?: [];
  };
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

export type NotificationCardProps = TriggerCardProps & {
  item: TriggerCardProps["item"] & {
    messageTemplates: {
      id: number;
      subject: string;
      body: string;
    };
  };
};

export type FollowUpCardProps = TriggerCardProps & {
  item: TriggerCardProps["item"] & {
    triggerTaskName: string;
  };
};

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
