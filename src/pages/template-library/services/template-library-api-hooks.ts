import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import type { PaginatedResponse } from "@/core/types/pagination.type";
import { useNotification } from "@/core/services/notification.service";
import { Severity } from "@/core/types/severity.type";

import type {
  FilterTemplatesPayload,
  TagOptionsType,
  TaskTypeOptions,
} from "../types/template-library.type";
import {
  getAllDirectories,
  getTemplatesByLibraryId,
  getReportsByReportType,
  getTaskTypes,
  getTaskTags,
  getQuestionTags,
  filterTemplates,
  getTemplatePreviewById,
  getReportPreviewById,
  deleteReportTemplateById,
  deleteTaskTemplateById,
} from "./template-library.service";
import type { DirectoryType } from "@/core/types/tree-view.type";

/**
 * @method useGetAllDirectories
 * @description hook to fetch all the directories list
 */
export function useGetAllDirectories() {
  const { notify } = useNotification();

  const query = useQuery<PaginatedResponse<DirectoryType>>({
    queryKey: ["directories"],
    queryFn: getAllDirectories,
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      notify({
        title: query.error?.message || "Failed to load directories",
        config: {
          severity: Severity.ERROR,
        },
      });
    }
  }, [query.isError, query.error, query.isSuccess, notify]);

  return query;
}

/**
 * @method useGetTemplatesByLibraryId
 * @description hook to fetch templates by libraryId
 */
export function useGetTemplatesByLibraryId() {
  const { notify } = useNotification();

  const query = useMutation({
    mutationKey: ["templates"],
    mutationFn: (params?: Record<string, unknown>) => {
      const { libraryId, ...restParams } = params;
      return getTemplatesByLibraryId(libraryId as number, restParams);
    },
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      notify({
        title: query.error?.message || "Failed to load templates",
        // description: query.error?.message || 'An error occurred while fetching templates',
        config: {
          severity: Severity.ERROR,
        },
      });
    }
  }, [query.isError, query.isSuccess, query.error, notify]);

  return query;
}

/**
 * @method useGetReportsByReportType
 * @description hook to fetch reports by reportType
 */
export function useGetReportsByReportType() {
  const { notify } = useNotification();
  const query = useMutation({
    mutationKey: ["reports"],
    mutationFn: (params?: Record<string, unknown>) => {
      const { reportTypeId } = params;
      delete params?.reportTypeId;
      return getReportsByReportType(reportTypeId as number, params);
    },
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      notify({
        title: query.error?.message || "Failed to load reports",
        // description: query.error?.message || 'An error occurred while fetching reports',
        config: {
          severity: Severity.ERROR,
        },
      });
    }
  }, [query.isError, query.error, query.isSuccess, notify]);

  return query;
}

/**
 * @method useGetTaskTypesOptions
 * @description hook to fetch task types options
 */
export function useGetTaskTypesOptions() {
  return useQuery<PaginatedResponse<TaskTypeOptions>>({
    queryKey: ["taskTypesOptions"],
    queryFn: getTaskTypes,
    retry: false,
  });
}

/**
 * @method useGetTaskTagsOptions
 * @description hook to fetch task tag options
 */
export function useGetTaskTagsOptions() {
  return useQuery<PaginatedResponse<TagOptionsType>>({
    queryKey: ["taskTagsOptions"],
    queryFn: getTaskTags,
    retry: false,
  });
}

/**
 * @method useGetQuestionTagsOptions
 * @description hook to fetch question tags options
 */
export function useGetQuestionTagsOptions() {
  return useQuery<PaginatedResponse<TagOptionsType>>({
    queryKey: ["questionTagsOptions"],
    queryFn: getQuestionTags,
    retry: false,
  });
}

/**
 * @method useFilterTemplates
 * @description hook to filter templates
 */
export function useFilterTemplates(payload: FilterTemplatesPayload = {}) {
  const { notify } = useNotification();
  const query = useMutation({
    mutationKey: ["templateFilter", payload],
    mutationFn: (payload: Record<string, unknown>) => filterTemplates(payload),
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      notify({
        title: query.error?.message || "Failed to load templates",
        // description: query.error?.message || 'An error occurred while fetching templates', TODO: Later remove this once error handling is done
        config: {
          severity: Severity.ERROR,
        },
      });
    } else if (query.isSuccess) {
      notify({
        title: "Templates fetched successfully",
        config: {
          severity: Severity.SUCCESS,
        },
      });
    }
  }, [query.isError, query.error, query.isSuccess, notify]);

  return query;
}

/**
 * @method useGetPreviewByTemplateId
 * @description hook to fetch template preview
 */
export function useGetPreviewByTemplateId() {
  const { notify } = useNotification();
  const query = useMutation({
    mutationKey: ["template-preview"],
    mutationFn: (templateId: number) => getTemplatePreviewById(templateId),
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      notify({
        title: query.error?.message || "Failed to load template preview",
        // description: query.error?.message || `An error occurred while fetching template's preview`,
        config: {
          severity: Severity.ERROR,
        },
      });
    }
  }, [query.isError, query.error, query.isSuccess, notify]);

  return query;
}

/**
 * @method useGetPreviewByReportTypeId
 * @description hook to fetch report preview
 */
export function useGetPreviewByReportTypeId() {
  const { notify } = useNotification();
  const query = useMutation({
    mutationKey: ["report-preview"],
    mutationFn: (templateId: number) => getReportPreviewById(templateId),
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      notify({
        title: query.error?.message || "Failed to load report preview",
        // description: query.error?.message || 'An error occurred while fetching report preview',
        config: {
          severity: Severity.ERROR,
        },
      });
    }
  }, [query.isError, query.error, query.isSuccess, notify]);

  return query;
}

/**
 * @method useDeleteTemplateById
 * @description hook to delete template by Template ID
 */
export function useDeleteTemplateById() {
  const { notify } = useNotification();
  const query = useMutation({
    mutationFn: (templateId: number) => {
      return deleteTaskTemplateById(templateId);
    },
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      notify({
        title: query.error?.message || "Failed to delete template",
        // description: query.error?.message || 'An error occurred while deleting template',
        config: {
          severity: Severity.ERROR,
        },
      });
    } else if (query.isSuccess) {
      notify({
        title: "Template deleted successfully",
        config: {
          severity: Severity.SUCCESS,
        },
      });
    }
  }, [query.isError, query.error, query.isSuccess, notify]);

  return query;
}

/**
 * @method useDeleteReportById
 * @description hook to delete report by type ID
 */
export function useDeleteReportById() {
  const { notify } = useNotification();
  const query = useMutation({
    mutationFn: (templateId: number) => {
      return deleteReportTemplateById(templateId);
    },
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      notify({
        title: query.error?.message || "Failed to delete report",
        // description: query.error?.message || 'An error occurred while deleting report',
        config: {
          severity: Severity.ERROR,
        },
      });
    } else if (query.isSuccess) {
      notify({
        title: "Report deleted successfully",
        config: {
          severity: Severity.SUCCESS,
        },
      });
    }
  }, [query.isError, query.error, query.isSuccess, notify]);

  return query;
}
