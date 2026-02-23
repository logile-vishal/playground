import type { FOLLOW_UP_TEMPLATE_COLUMNS } from "../constants/follow-up";

export type FollowUpTemplateColumn =
  (typeof FOLLOW_UP_TEMPLATE_COLUMNS)[keyof typeof FOLLOW_UP_TEMPLATE_COLUMNS];
