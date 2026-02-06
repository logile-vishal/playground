import { TEMPLATE_STATUS_MAP } from "../constants/constant";

export const getTemplateStatusLabel = (status: string) => {
  return TEMPLATE_STATUS_MAP[status] || status;
};
