import { useQuery } from '@tanstack/react-query';

import {
  getAllDirectories,
  getTemplatesByTagId,
  getReportsByReportType,
} from './template-library.service';
import type { PaginatedResponse } from '@/core/types/pagination.type';
import type { DirectoryType, ReportType, TemplateType } from '../types/template-library.type';

// Fetch all directories
export function useGetAllDirectories() {
  return useQuery<PaginatedResponse<DirectoryType>>({
    queryKey: ['directories'],
    queryFn: getAllDirectories,
  });
}

// Fetch templates by tagId
export function useGetTemplatesByTagId(tagId: number, params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<TemplateType>>({
    queryKey: ['templates', tagId, params],
    queryFn: () => getTemplatesByTagId(tagId, params),
    enabled: !!tagId,
  });
}

// Fetch reports by reportType
export function useGetReportsByReportType(reportType: string, params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<ReportType>>({
    queryKey: ['reports', reportType, params],
    queryFn: () => getReportsByReportType(reportType, params),
    enabled: !!reportType,
  });
}
