import { createContext, useContext } from "react";
import { get } from "@/core/services/http-base-service";
import { API_CONFIG } from "@/core/constants/api-config";
import type { ClusterItem } from "../types/questions.type";

import type { PaginatedResponse } from "@/core/types/pagination.type";

import type { CreateTemplateFormContextType } from "../types/create-template-form-schema.type";

export const CreateTemplateFormContext =
  createContext<CreateTemplateFormContextType | null>(null);

export const useCreateTemplateForm = () =>
  useContext(CreateTemplateFormContext);

/**
 * @method getClusters
 * @description fetch all the clusters
 */
export const getClusters: () => Promise<
  PaginatedResponse<ClusterItem>
> = () => {
  const url = API_CONFIG.org.clusters;
  return get<PaginatedResponse<ClusterItem>>(url);
};
