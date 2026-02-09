import type { PaginatedResponse } from "@/core/types/pagination.type";
import type { DirectoryType } from "@/core/types/tree-view.type";
import type {
  TemplateFilter,
  TemplateLibraryFilterModes,
  TemplateType,
} from "@/pages/template-library/types/template-library.type";

export type AdvanceFilterContentProps = {
  filter: TemplateFilter;
  onClearFilter: () => void;
  onFilterSubmit: () => void;
  onFilterChange?: (field: string, value: unknown) => void;
  isFilterDataLoading?: boolean;
};
export type BasicFilterContentProps = {
  filter: TemplateFilter;
  filteredSuggestions?: TemplateType[];
  searchValue?: string;
  onShowAllSearchResults?: () => void;
  onTemplateSuggClick: (template: TemplateType) => void;
  directoriesList?: DirectoryType[];
};
export type FilterSuggestionCardProps = {
  onClick: (template: TemplateType) => void;
  templateData: TemplateType;
  tagPath: string;
  templateNameFilterText: string;
};
export type ShowAllTemplatesInFolderProps = {
  isVisible: boolean;
  onGoToFolder: () => void;
  totalTemplates: number;
};
export type TemplateSearchBarProps = {
  placeholder: string;
  onChange?: (value: string) => void;
  onShowAllSearchResults: (templateName: string) => void;
  onSearch?: (filter: TemplateFilter) => void;
  directoriesList?: DirectoryType[];
  setTableData: React.Dispatch<
    React.SetStateAction<PaginatedResponse<TemplateType> | null>
  >;
  setIsTableDataLoading: (value: boolean) => void;
  onTemplateSuggClick: (template: TemplateType) => void;
  filter: TemplateFilter;
  isFilterDataLoading?: boolean;
  onClearFilter: () => void;
  onFilterChipDelete: (key: string) => void;
  onFilterChange?: (field: string, value: unknown) => void;
};
export type TemplateSearchModalProps = {
  filterMode: TemplateLibraryFilterModes;
  onClose: (e: MouseEvent | TouchEvent) => void;
  anchorEl: HTMLElement | null;
  onShowAllSearchResults?: () => void;
  onFilterChange?: (field: string, value: unknown) => void;
  filter?: TemplateFilter;
  onClearFilter: () => void;
  onFilterSubmit: () => void;
  onTemplateSuggClick: (template: TemplateType) => void;
  modalAnchor?: React.RefObject<HTMLDivElement>;
  directoriesList?: DirectoryType[];
};
