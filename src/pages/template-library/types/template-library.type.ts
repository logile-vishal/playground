import type { IconName } from "@/core/types/icon.type";
import type { PaginatedResponse } from "@/core/types/pagination.type";
import type { TemplatePreviewType } from "./template-questions.type";

export type DirectoryType = {
  tagId: number;
  tagName: string;
  tagType: string;
  tagSort: string | number | null;
  tagLevel: number;
  isPublic: boolean;
  isPrivate: boolean;
  isHidden: boolean;
  isNoShow: boolean;
  reportType: number | string | null;
  isExpanded: boolean | null;
  subLibrary?: DirectoryType[];
}

export type TemplateType = {
    name?: string,
    templateId?: number,
    templateBaseType?: string;
    tagId?: number,
    templateName?: string,
    tagType?: string,
    status?: string,
    createdTime?: string,
    lastModifiedTime?: string,
    iconName?: string,
    iconColour?: string,
}
 
export type ReportType = {
    templateId?: number,
    displayTime?: boolean,
    enabled?: null,
    level?: null,
    savedDate?: string,
    savedUser?: string,
    name?: string,
    isPublic?: boolean,
    createPosition?: number,
    createOrgType?: null,
    createOrg?: number,
    isDashboard?: boolean,
    showTmptNameInTitle?: boolean;
}
 
export type TemplateLibraryType = {
  template_icon: string;
  template_name: string;
  type: string;
  status: string;
  created: string;
  last_modified: string;
};
 
export type ActionMenuKeys = "name" | "created" | "modified";

export type MenuState = {
    status: boolean;
    anchorEl: null | HTMLElement;
};

export type LibraryTableProps = {
  showCheckbox: boolean;
  setShowCheckbox: (value: boolean) => void;
  selectedDirectory: DirectoryType;
  selectedTemplate: TemplateType[] | ReportType[];
  setSelectedTemplate: (value: TemplateType[]| ReportType[]) => void;
  hoveredRowId?: string | null;
  setHoveredRowId?: (value: string | null) => void;
  templatesList: PaginatedResponse<TemplateType>,
  isDataLoading: boolean,
  exportMenu: {
    anchorEl: null | HTMLElement;
    status: boolean;
  };
  fetchData: (value: DirectoryType, params?: Record<string, unknown>) => void;
  handleExportMenuClose: () => void;
  handleExportMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
};
 
export type TemplatePaginationData = {
  currentPage: number,
  pageSize: number,
}

export type ExportMenuProps = {
    exportMenu: {
        anchorEl: null | HTMLElement;
        status: boolean;
    };
    handleExportMenuClose: () => void;
};

export type TemplatePreviewResponseProps = {
  data: TemplatePreviewType | undefined;
}

export type TemplatePreviewModalProps = {
    status: boolean;
    data?: TemplatePreviewType | undefined;
}

export type PreviewModalProps = {
  previewModal: TemplatePreviewModalProps;
  onClose: () => void;
  isPreviewLoading: boolean;
  exportMenu: {
    anchorEl: null | HTMLElement;
    status: boolean;
  };
  handleExportMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleExportMenuClose: () => void;
};

export type PreviewButtonProps = {
    label?: string;
    icon?: IconName;
    type?: string;
}

/* Advance Search */
export interface TaskTypeOptions {
  typeId: number,
  typeName: string,
  questionLists: null,
}

export interface TagOptionsType {
    tagId: number,
    tagValue: string,
    tagType: number,
    label?: string,
    value?: string | number,
}

export interface FilterTemplatesPayload {
    templateName?: string,
    taskType?: number,
}

export type DeleteTemplateProps = {
  status?: boolean,
  statusDesc?: string,
}