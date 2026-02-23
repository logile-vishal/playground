import { get } from "@/core/services/http-base-service";
import { API_CONFIG } from "@/core/constants/api-config";
import type {
  OrgProps,
  OrgLevelProps,
  OrgPositionsProps,
  OrgTypesProps,
} from "@/pages/create-template/types/triggers.type";
import type { PaginatedResponse } from "@/core/types/pagination.type";

export const getOrgsList = (params: Record<string, unknown>) => {
  return get<PaginatedResponse<OrgProps[]>>(API_CONFIG.org.getOrgList, {
    params,
  });
};

export const getOrgTypes = (params: Record<string, unknown>) => {
  return get<PaginatedResponse<OrgTypesProps[]>>(API_CONFIG.org.getOrgTypes, {
    params,
  });
};

export const getOrgLevels = () => {
  return get<PaginatedResponse<OrgLevelProps[]>>(API_CONFIG.org.getOrgLevel);
};

export const getOrgPositions = (params: Record<string, unknown>) => {
  return get<PaginatedResponse<OrgPositionsProps[]>>(
    API_CONFIG.org.getOrgPositions,
    { params }
  );
};
