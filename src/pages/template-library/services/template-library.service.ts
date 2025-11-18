import { get, del, post } from "@/core/services/http-base-service";
import type { PaginatedResponse } from "@/core/types/pagination.type";
import { API_CONFIG } from "@/core/constants/api-config";
import type { TreeViewNodeDataType } from "@/core/types/tree-view.type";

import type { DeleteTemplateProps, FilterTemplatesPayload, ReportType, TagOptionsType, TaskTypeOptions, TemplatePreviewResponseProps, TemplateType } from "../types/template-library.type";
import { LIB_TYPE } from "../constants/constant";

  /**
  * @method getAllDirectories
  * @description fetch all the directories list
  */
  export const getAllDirectories: () => Promise<PaginatedResponse<TreeViewNodeDataType>> = () => {
      return get<PaginatedResponse<TreeViewNodeDataType>>(API_CONFIG.templateLibrary.getAllDirectories);
  }

  /**
  * @method getTemplatesByTagId
  * @description fetch templates by their tag id
  */
  export const getTemplatesByTagId: (tagId: number, params: Record<string, unknown>) => Promise<PaginatedResponse<TemplateType>> = (tagId, params={}) => {
      const url = API_CONFIG.templateLibrary.getTemplateByTagId.replace("{tagId}",`${tagId}`);
      return get<PaginatedResponse<TemplateType>>(url, { params });
  }

  /**
  * @method getReportsByReportType
  * @description fetch reports by their report type id
  */
  export const getReportsByReportType: (reportType: number, params:Record<string, unknown>) => Promise<PaginatedResponse<ReportType>> = (reportTypeId, params={}) => {
      const url = API_CONFIG.templateLibrary.getReportByReportType.replace("{reportTypeId}",`${reportTypeId}`);
      return get<PaginatedResponse<ReportType>>(url,{ params });
  }
  
  /**
  * @method getTaskTypes
  * @description fetch all the types
  */
  export const getTaskTypes: () => Promise<PaginatedResponse<TaskTypeOptions>> = () => {
      const url = API_CONFIG.templateLibrary.getTaskTypes;
      return get<PaginatedResponse<TaskTypeOptions>>(url,{});
  }

  /**
  * @method getTaskTags
  * @description fetch all the task tags
  */
  export const getTaskTags: () => Promise<PaginatedResponse<TagOptionsType>> = () => {
      const url = API_CONFIG.templateLibrary.getTaskTags;
      return get<PaginatedResponse<TagOptionsType>>(url);
  }

  /**
  * @method getQuestionTags
  * @description fetch all the question tags
  */
  export const getQuestionTags: () => Promise<PaginatedResponse<TagOptionsType>> = () => {
      const url = API_CONFIG.templateLibrary.getQuestionTags;
      return get<PaginatedResponse<TagOptionsType>>(url);
  }

  /**
  * @method filterTemplates
  * @description filter and fetch all the templates
  */
  export const filterTemplates: (payload:FilterTemplatesPayload) => Promise<PaginatedResponse<TemplateType | ReportType>> = (payload={}) => {
      const url = API_CONFIG.templateLibrary.filterTemplates;
      return post<PaginatedResponse<TemplateType | ReportType>>(url, payload);
  }

  /**
  * @method getTemplatePreviewById
  * @description fetch template preview by template id
  */
  export const getTemplatePreviewById: (templateId: number) => Promise<TemplatePreviewResponseProps> = (templateId) => {
    const url = API_CONFIG.templateLibrary.getTemplatePreviewById.replace("{templateId}",`${templateId}`);
    return get<TemplatePreviewResponseProps>(url);
  }

  /**
  * @method getReportPreviewById
  * @description fetch report preview by template id
  */
  export const getReportPreviewById: (reportTypeId: number) => Promise<TemplatePreviewResponseProps> = (reportTypeId) => {
    const url = API_CONFIG.templateLibrary.getReportPreviewById.replace("{reportTypeId}",`${reportTypeId}`);
    return get<TemplatePreviewResponseProps>(url);
  }

  /**
  * @method deleteTaskTemplateById
  * @description delete and fetch templates
  */
  export const deleteTaskTemplateById: (templateId: number, params?: Record<string, unknown>) => Promise<DeleteTemplateProps> = (templateId, params={}) => {
    const url = API_CONFIG.templateLibrary.deleteTemplateById.replace("{templateId}", `${templateId}`);
    return del<DeleteTemplateProps>(url, { params: {...params, "libType": LIB_TYPE.TEMPLATE} });
  }

  /**
  * @method deleteReportTemplateById
  * @description delete and fetch reports
  */
  export const deleteReportTemplateById: (templateId: number, params?: Record<string, unknown>) => Promise<DeleteTemplateProps> = (templateId, params={}) => {
    const url = API_CONFIG.templateLibrary.deleteTemplateById.replace("{templateId}", `${templateId}`);
    return del<DeleteTemplateProps>(url, { params: {...params, "libType": LIB_TYPE.REPORT} });
  }