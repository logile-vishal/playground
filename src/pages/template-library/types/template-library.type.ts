import type { IconName } from "@/core/types/icon.type";
import type { DirectoryType } from "@/core/types/tree-view.type";
import type {
  PaginatedResponse,
  Pagination,
} from "@/core/types/pagination.type";
import type { TemplateTagsPropsForAdvanceFilter } from "@/pages/create-template/types/questions.type";
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
  templatesList: PaginatedResponse<TemplateType | ReportType>;
  isDataLoading: boolean;
  fetchData: (
    directory: DirectoryType,
    paramsPayload?: Record<string, unknown>,
    appendData?: boolean
  ) => Promise<void>;
  paginationData: Pagination;
  handlePaginationChange: (newPagination: Pagination) => void;
  isGoToFolderVisible: boolean;
  onGoToFolderClick: (template: TemplateType) => void;
  filteredTemplateList: PaginatedResponse<TemplateType | ReportType>;
  templateFilter: TemplateFilter;
  setTemplateFilter: (filter: TemplateFilter) => void;
  enableInfiniteScroll?: boolean;
  onLoadMore?: () => void;
  resetScrollKey?: string | number;
  ref: HTMLDivElement;
};

export type TemplatePaginationData = {
  currentPage: number;
  pageSize: number;
};

export type ExportDataType =
  | TemplateType[]
  | TemplateType
  | ReportType[]
  | ReportType
  | TemplatePreviewType
  | undefined;

export type ExportMenuProps = {
  exportMenu: {
    anchorEl: null | HTMLElement;
    status: boolean;
  };
  handleExportMenuClose: () => void;
  ref: HTMLElement | null;
  exportData: ExportDataType;
  exportMethod: (data: ExportDataType) => Record<string, string | number>[];
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
  tableData: PaginatedResponse<TemplateType>;
  ref: HTMLDivElement;
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
  attributes: [
    {
      attributeId: number;
      attributeName: string | null;
      attributeValue: string | null;
    },
  ];
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
  taskTagsList: TemplateTagsPropsForAdvanceFilter[];
  questionTagsList: { value: string; label: string }[];
  statusList: { value: string; label: string }[];
  selectedSort: SelectedSortProps;
};
export type TemplateLibraryFilterModes =
  (typeof TEMPLATE_SEARCH_BAR.FILTER_MODES)[keyof typeof TEMPLATE_SEARCH_BAR.FILTER_MODES];
