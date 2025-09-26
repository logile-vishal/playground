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
export function useGetTemplatesByTagId(tagId: number, payload?: any) {
  return useQuery<PaginatedResponse<TemplateType>>({
    queryKey: ['templates', tagId, payload],
    queryFn: () => getTemplatesByTagId(tagId, payload),
    enabled: !!tagId,
  });
}

// Fetch reports by reportType
export function useGetReportsByReportType(reportType: number, payload?: any) {
  return useQuery<PaginatedResponse<ReportType>>({
    queryKey: ['reports', reportType, payload],
    queryFn: () => getReportsByReportType(reportType, payload),
    enabled: !!reportType,
  });
}
