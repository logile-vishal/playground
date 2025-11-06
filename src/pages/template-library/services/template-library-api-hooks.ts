import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  getAllDirectories,
  getTemplatesByTagId,
  getReportsByReportType,
} from './template-library.service';
import type { PaginatedResponse } from '@/core/types/pagination.type';
import type { DirectoryType, ReportType, TemplateType } from '../types/template-library.type';
import { useNotification } from '@/core/services/notification.service';
import { Severity } from '@/core/types/severity.type';

// Fetch all directories
export function useGetAllDirectories() {
  const { notify } = useNotification();

  const query = useQuery<PaginatedResponse<DirectoryType>>({
    queryKey: ['directories'],
    queryFn: getAllDirectories,
  });

  useEffect(() => {
    if (query.isError) {
      notify({
        title: 'Failed to load directories',
        description: query.error?.message || 'An error occurred while fetching directories',
        config: {
          severity: Severity.ERROR,
        },
      });
    } else if (query.isSuccess) {
      notify({
        title: 'Directories loaded successfully',
        config: {
          severity: Severity.SUCCESS,
        },
      });
    }
  }, [query.isError, query.error, query.isSuccess, notify]);

  return query;
}

// Fetch templates by tagId
export function useGetTemplatesByTagId(tagId: number, params?: Record<string, unknown>) {
  const { notify } = useNotification();

  const query = useQuery<PaginatedResponse<TemplateType>>({
    queryKey: ['templates', tagId, params],
    queryFn: () => getTemplatesByTagId(tagId, params),
    enabled: !!tagId,
  });

  useEffect(() => {
    if (query.isError) {
      notify({
        title: 'Failed to load templates',
        description: query.error?.message || 'An error occurred while fetching templates',
        config: {
          severity: Severity.ERROR,
        },
      });
    } else if (query.isSuccess) {
      notify({
        title: 'Templates loaded successfully',
        config: {
          severity: Severity.SUCCESS,
        },
      });
    }
  }, [query.isError, query.isSuccess, query.error, notify, tagId]);

  return query;
}

// Fetch reports by reportType
export function useGetReportsByReportType(reportType: string, params?: Record<string, unknown>) {
  const { notify } = useNotification();

  const query = useQuery<PaginatedResponse<ReportType>>({
    queryKey: ['reports', reportType, params],
    queryFn: () => getReportsByReportType(reportType, params),
    enabled: !!reportType,
  });

  useEffect(() => {
    if (query.isError) {
      notify({
        title: 'Failed to load reports',
        description: query.error?.message || 'An error occurred while fetching reports',
        config: {
          severity: Severity.ERROR,
        },
      });
    } else if (query.isSuccess) {
      notify({
        title: 'Reports loaded successfully',
        config: {
          severity: Severity.SUCCESS,
        },
      });
    }
  }, [query.isError, query.error, query.isSuccess, notify, reportType]);

  return query;
}
