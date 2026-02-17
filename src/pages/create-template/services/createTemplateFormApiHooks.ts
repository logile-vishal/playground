import { useQuery } from "@tanstack/react-query";

import type { PaginatedResponse } from "@/core/types/pagination.type";

import type { ClusterItem } from "../types/questions.type";
import { getClusters } from "./create-template-form.service";
/**
 * @method useGetClustersOptions
 * @description hook to fetch question tags options
 */
export function useGetClustersOptions() {
  return useQuery<PaginatedResponse<ClusterItem>>({
    queryKey: ["clustersOptions"],
    queryFn: getClusters,
    retry: false,
  });
}
