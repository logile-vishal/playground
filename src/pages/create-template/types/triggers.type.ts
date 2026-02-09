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
