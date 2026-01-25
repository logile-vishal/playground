export type TriggerCardProps = {
  item: {
    id: number;
    index?: string;
    condition?: string;
    conditionQuestion?: string;
    conditionAnswer?: string;
    messageTemplates?: {
      id: number;
      subject: string;
      body: string;
    };
    triggerTaskName?: string;
    recipients?: string[];
    recipientsIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  };
  triggeredByAnswers?: boolean;
  type: string;
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
