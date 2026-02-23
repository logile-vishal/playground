import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getOrgLevels,
  getOrgPositions,
  getOrgsList,
  getOrgTypes,
} from "./create-template.service";
import type { OrgLevelProps } from "../types/triggers.type";
import type { PaginatedResponse } from "@/core/types/pagination.type";

export function useGetOrgLevels() {
  return useQuery<PaginatedResponse<OrgLevelProps[]>>({
    queryKey: ["orgLevels"],
    queryFn: getOrgLevels,
    retry: false,
  });
}

export function useGetOrgsList(params: Record<string, unknown> = {}) {
  return useMutation({
    mutationKey: ["orgsList", params],
    mutationFn: (params: Record<string, unknown>) => getOrgsList(params),
    retry: false,
  });
}

export function useGetOrgPositions(params: Record<string, unknown> = {}) {
  return useMutation({
    mutationKey: ["orgPositions", params],
    mutationFn: (params: Record<string, unknown>) => getOrgPositions(params),
    retry: false,
  });
}

export function useGetOrgTypes(params: Record<string, unknown> = {}) {
  return useMutation({
    mutationKey: ["orgTypes", params],
    mutationFn: (params: Record<string, unknown>) => getOrgTypes(params),
    retry: false,
  });
}
