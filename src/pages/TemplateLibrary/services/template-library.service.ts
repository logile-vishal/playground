import { get, post } from "@/core/services/httpBaseService";
import type { PaginatedResponse } from "@/core/types/pagination.type";
import type { DirectoryType, ReportType, TemplateType } from "../types/template-library.type";
import { API_CONFIG } from "@/core/constants/api-config";
import { demoTableData, folderTreeData } from '../tableData';

export const getAllDirectories: () => Promise<PaginatedResponse<DirectoryType>> = () => {
    // return get<PaginatedResponse<DirectoryType>>(API_CONFIG.templateLibrary.getAllDirectories);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(folderTreeData);
        }, 2000);
    });
}

export const getTemplatesByTagId: (tagId: number, payload:any) => Promise<PaginatedResponse<TemplateType>> = (tagId, payload={}) => {
    const url = API_CONFIG.templateLibrary.getTemplateByTagId.replace("{tagId}",`${tagId}`);
    // return post<PaginatedResponse<TemplateType>>(url, payload);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(demoTableData as unknown as PaginatedResponse<TemplateType>);
        }, 2000);
    });
}

export const getReportsByReportType: (reportType: number, payload:any) => Promise<PaginatedResponse<ReportType>> = (reportType, payload={}) => {
    const url = API_CONFIG.templateLibrary.getReportByReportType.replace("{reportType}",`${reportType}`);
    return post<PaginatedResponse<ReportType>>(url,payload);
}
