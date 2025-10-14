import { get, post } from "@/core/services/http-base-service";
import type { PaginatedResponse } from "@/core/types/pagination.type";
import type { DirectoryType, ReportType, TemplateType } from "../types/template-library.type";
import { API_CONFIG } from "@/core/constants/api-config";

export const getAllDirectories: () => Promise<PaginatedResponse<DirectoryType>> = () => {
  return get<PaginatedResponse<DirectoryType>>(API_CONFIG.templateLibrary.getAllDirectories);
}

export const getTemplatesByTagId: (tagId: number, params?: Record<string, unknown>) => Promise<PaginatedResponse<TemplateType>> = (tagId, params = {}) => {
  const url = API_CONFIG.templateLibrary.getTemplateByTagId.replace("{tagId}",`${tagId}`);
  return post<PaginatedResponse<TemplateType>>(url, { params });
}

export const getReportsByReportType: (reportType: string, params?: Record<string, unknown>) => Promise<PaginatedResponse<ReportType>> = (reportType, params = {}) => {
  const url = API_CONFIG.templateLibrary.getReportByReportType.replace("{reportType}",`${reportType}`);
  return post<PaginatedResponse<ReportType>>(url,{ params });
}
