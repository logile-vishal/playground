import type { IconName } from "@/core/types/icon.type";
import type { DirectoryType } from "@/core/types/tree-view.type";
import type {
  PaginatedResponse,
  Pagination,
} from "@/core/types/pagination.type";

import type { TemplatePreviewType } from "./template-questions.type";
import type { SortOption } from "./template-constants.type";
import type {
  TEMPLATE_SEARCH_BAR,
  TEMPLATE_TABLE_COLUMNS,
} from "../constants/constant";

export type TemplateType = {
  name?: string;
  templateId?: number;
  templateBaseType?: string;
  tagId?: number;
  templateName?: string;
  tagType?: string;
  status?: string;
  createdTime?: string;
  lastModifiedTime?: string;
  iconName?: string;
  iconColour?: string;
  savedDate?: string;
};

export type ReportType = {
  templateId?: number;
  displayTime?: boolean;
  enabled?: null;
  level?: null;
  savedDate?: string;
  savedUser?: string;
  name?: string;
  isPublic?: boolean;
  createPosition?: number;
  createOrgType?: null;
  createOrg?: number;
  isDashboard?: boolean;
  showTmptNameInTitle?: boolean;
};

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
  selectedDirectory: DirectoryType | null;
  selectedTemplate: TemplateType[] | ReportType[];
  setSelectedTemplate: (value: TemplateType[] | ReportType[]) => void;
  hoveredRowId?: string | null;
  setHoveredRowId?: (value: string | null) => void;
  templatesList: PaginatedResponse<TemplateType>;
  isDataLoading: boolean;
  exportMenu: {
    anchorEl: null | HTMLElement;
    status: boolean;
  };
  paginationData: Pagination;
  handlePaginationChange: (newPagination: Pagination) => void;
  fetchData: (value: DirectoryType, params?: Record<string, unknown>) => void;
  handleExportMenuClose: () => void;
  handleExportMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  isGoToFolderVisible: boolean;
  onGoToFolderClick: (rowData: TemplateType | ReportType) => void;
  filteredTemplateList?: PaginatedResponse<TemplateType>;
  templateFilter?: TemplateFilter;
  setTemplateFilter?: (filter: TemplateFilter) => void;
};

export type TemplatePaginationData = {
  currentPage: number;
  pageSize: number;
};

export type ExportMenuProps = {
  exportMenu: {
    anchorEl: null | HTMLElement;
    status: boolean;
  };
  handleExportMenuClose: () => void;
};

export type TemplatePreviewResponseProps = {
  data: TemplatePreviewType | undefined;
};

export type TemplatePreviewModalProps = {
  status: boolean;
  data?: TemplatePreviewType | undefined;
};

export type PreviewModalProps = {
  previewModal: TemplatePreviewModalProps;
  onClose: () => void;
  isPreviewLoading: boolean;
  hasTemplatePreviewError: Error | null;
  exportMenu?: {
    anchorEl: null | HTMLElement;
    status: boolean;
  };
  handleExportMenuOpen?: (event: React.MouseEvent<HTMLElement>) => void;
  handleExportMenuClose?: () => void;
};

export type PreviewButtonProps = {
  label?: string;
  icon?: IconName;
  type?: string;
};

/* Advance Search */
export interface TaskTypeOptions {
  typeId: number;
  typeName: string;
  questionLists: null;
}

export interface TagOptionsType {
  tagId: number;
  tagValue: string;
  tagType: number;
  label?: string;
  value?: string | number;
}

export interface FilterTemplatesPayload {
  templateName?: string;
  taskType?: number;
}

export type DeleteTemplateProps = {
  status?: boolean;
  statusDesc?: string;
};

export type SelectedSortProps = {
  name: SortOption | null;
  created: SortOption | null;
  modified: SortOption | null;
};

export type TableColumn =
  (typeof TEMPLATE_TABLE_COLUMNS)[keyof typeof TEMPLATE_TABLE_COLUMNS];
export type TemplateFilter = {
  templateName: string;
  questionText: string;
  taskType: { value: number; label: string } | null;
  modifiedInLastDays: string;
  taskTagsList: { value: string; label: string }[];
  questionTagsList: { value: string; label: string }[];
  statusList: { value: string; label: string }[];
  selectedSort: SelectedSortProps;
};
export type TemplateLibraryFilterModes =
  (typeof TEMPLATE_SEARCH_BAR.FILTER_MODES)[keyof typeof TEMPLATE_SEARCH_BAR.FILTER_MODES];
