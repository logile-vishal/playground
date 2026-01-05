export type TriggerCardProps = {
  item: {
    id: number;
    index?: string;
    condition?: string;
    conditionQuestion?: string;
    conditionAnswer?: string;
    messageSubject?: string;
    taskName?: string;
    recipients?: string[];
    recipientsIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  };
  triggeredByAnswers?: boolean;
  type: string;
};

export type NotificationCardProps = TriggerCardProps & {
  item: TriggerCardProps["item"] & {
    messageSubject: string;
  };
};

export type FollowUpCardProps = TriggerCardProps & {
  item: TriggerCardProps["item"] & {
    taskName: string;
  };
};
