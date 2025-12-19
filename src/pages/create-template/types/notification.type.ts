export type NotificationCardProps = {
  item: {
    id: number;
    index?: string;
    condition?: string;
    conditionQuestion?: string;
    conditionAnswer?: string;
    messageSubject?: string;
    recipients?: string[];
    recipientsIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  };
  triggeredByAnswers?: boolean;
};

export type NotificationColumnProps = {
  title: string;
  value: string | React.ReactNode;
  className?: string;
  isWildcardText?: boolean;
  iconVisible?: boolean;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  enableSeeMore?: boolean;
};
