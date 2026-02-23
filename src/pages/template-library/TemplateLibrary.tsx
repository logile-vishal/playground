import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";

import CSvgIcon from "@/core/components/icon/Icon";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import CTreeView from "@/core/components/tree-view/TreeView";
import CIconButton from "@/core/components/button/IconButton";
import PageTemplate from "@/layouts/page-template/PageTemplate";
import {
  ArrowUp,
  ChevronLeft,
  Delete,
  Excel,
  FolderInput,
  MoreOption,
  Upload,
} from "@/core/constants/icons";
import { useIsDesktopViewport } from "@/utils/get-viewport-size";
import type {
  PaginatedResponse,
  Pagination,
} from "@/core/types/pagination.type";
import type { DirectoryType } from "@/core/types/tree-view.type";
import { CButton } from "@/core/components/button/button";
import CNoData from "@/core/components/no-data/NoData";
import { isNonEmptyValue } from "@/utils";
import clsx from "@/utils/clsx";
import CDivider from "@/core/components/divider/Divider";
import { templateTableExportData } from "@/utils/generate-export-data";

import type {
  ReportType,
  TemplateFilter,
  TemplatePaginationData,
  TemplateType,
} from "./types/template-library.type";
import {
  useFilterTemplates,
  useGetAllDirectories,
  useGetReportsByReportType,
  useGetTemplatesByLibraryId,
} from "./services/template-library-api-hooks";
import RenderExportMenu from "./components/export-menubar/ExportMenu";
import {
  TEMPLATE_LIST_PAGE_SIZE,
  TEMPLATE_SEARCH_DEFAULT_FILTER,
} from "./constants/constant";
import { templateSkelton } from "./components/skeleton/Skeleton";
import LibraryTable from "./TemplateTable";
import { useTemplateLibraryTranslations } from "./translation/useTemplateLibraryTranslations";
import "./TemplateStyle.scss";
import { TemplateSearchBar } from "./components/template-search-bar";
import ShowAllTemplatesInFolder from "./components/template-search-bar/ShowAllTemplatesInFolder";
import { findDirectoryById, getTargetDirectoryIdTrail } from "./utils/template";

const defaultPagination: Pagination = {
  currentPage: 1,
  pageSize: TEMPLATE_LIST_PAGE_SIZE,
  totalPages: 1,
  totalItems: 0,
};

/**
 * @method createFilterPayload
 * @description structure and get all the required payloads
 * @returns {void}
 */
const createFilterPayload = (
  filter: TemplateFilter,
  paginationData: TemplatePaginationData
) => {
  const copyFilter: TemplateFilter = { ...filter };
  const questionTagsList = copyFilter?.questionTagsList?.map((tag) =>
    parseInt(tag?.value)
  );
  const taskTagsList = copyFilter?.taskTagsList?.map((tag) =>
    parseInt(tag?.value)
  );
  const taskType = copyFilter?.taskType?.value ?? "";
  const statusList = copyFilter?.statusList?.map((tag) => tag?.value);
  let sortType = null;
  let sortBy = null;
  if (isNonEmptyValue(copyFilter?.selectedSort)) {
    Object.entries(copyFilter?.selectedSort).forEach(([, item]) => {
      if (item !== undefined && item !== null) {
        sortType = item?.value;
        sortBy = item?.fieldName;
      }
    });
  }

  delete copyFilter?.selectedSort;

  const payload = {
    ...copyFilter,
    ...paginationData,
    questionTagsList,
    taskTagsList: taskTagsList,
    templateName: copyFilter?.templateName?.trim(),
    taskType,
    statusList: statusList,
    sortFieldName: sortBy,
    sortType: sortType,
  };

  const filteredPayload = {};
  if (isNonEmptyValue(payload)) {
    Object.entries(payload).forEach(([key, value]) => {
      if (isNonEmptyValue(value)) {
        filteredPayload[key] = value;
      }
    });
  }
  return filteredPayload;
};

const TemplateLibrary: React.FC = () => {
  const { TEMPLATE_LIBRARY_HEADING, TEMPLATE_LIBRARY_NO_DATA, IMPORT_MODAL } =
    useTemplateLibraryTranslations();

  const [selectedDirectory, setSelectedDirectory] =
    useState<DirectoryType | null>(null);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    TemplateType[] | ReportType[]
  >([]);

  const [paginationData, setPaginationData] =
    useState<Pagination>(defaultPagination);
  const [exportMenu, setExportMenu] = useState<{
    anchorEl: null | HTMLElement;
    status: boolean;
  }>({
    anchorEl: null,
    status: false,
  });
  const [importPopup, setImportPopup] = useState<boolean>(false);

  const [templateFilter, setTemplateFilter] = useState<TemplateFilter>(
    JSON.parse(JSON.stringify(TEMPLATE_SEARCH_DEFAULT_FILTER))
  );
  const [isGoToFolderVisible, setIsGoToFolderVisible] =
    useState<boolean>(false);
  const [expandedDirectories, setExpandedDirectories] = useState<number[]>([]);
  const {
    data: basicFilterSuggestionClickData,
    mutateAsync: getBasicFilterSuggestionClickData,
    reset: resetBasicFilterSuggestionClickData,
  } = useGetTemplatesByLibraryId();
  const {
    data: filteredTemplateList,
    mutateAsync: filterTemplate,
    isPending: isFilteredTemplateListLoading,
    reset: resetFilteredTemplateList,
  } = useFilterTemplates();
  const isDesktop = useIsDesktopViewport();
  const navigate = useNavigate();

  /* API */
  const { data: directoriesList, isLoading: isDirectoriesLoading } =
    useGetAllDirectories();
  const {
    isPending: isTemplatesLoading,
    mutateAsync: getTemplatesByLibraryId,
  } = useGetTemplatesByLibraryId();
  const { isPending: isReportsLoading, mutateAsync: getReportsByReportTypeId } =
    useGetReportsByReportType();
  const { renderDirectorySkelton } = templateSkelton;
  const [tableData, setTableData] =
    useState<PaginatedResponse<TemplateType | ReportType>>();
  const accumulatedDataRef = useRef<(TemplateType | ReportType)[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const templateTableRef = useRef<HTMLDivElement>(null);

  // Derive loading state instead of managing separate state
  const isTableDataLoading =
    isTemplatesLoading ||
    isReportsLoading ||
    isFilteredTemplateListLoading ||
    isLoadingMore;

  const fetchData = async (
    directory: DirectoryType,
    paramsPayload: Record<string, unknown> = {},
    appendData = false
  ): Promise<void> => {
    let payload: Record<string, unknown> = {
      ...paginationData,
      ...paramsPayload,
    };
    let data = null;
    if (directory?.reportLibraryId) {
      payload = { ...payload, reportTypeId: directory?.reportLibraryId };
      data = await getReportsByReportTypeId(payload);
    } else {
      payload = { ...payload, libraryId: directory?.libraryId };
      data = await getTemplatesByLibraryId(payload);
    }

    if (appendData && !isDesktop) {
      const newData = data?.data || [];
      const combined = [...accumulatedDataRef.current, ...newData];
      accumulatedDataRef.current = combined;
      setTableData({
        ...data,
        data: combined,
      });
    } else {
      accumulatedDataRef.current = data?.data || [];
      setTableData(data);
    }
  };

  const handleDirectoryClick = (
    event: React.MouseEvent<HTMLElement>,
    directory: DirectoryType
  ) => {
    event?.preventDefault();
    event?.stopPropagation();
    resetBasicFilterSuggestionClickData();
    resetFilteredTemplateList();
    setIsGoToFolderVisible(false);
    accumulatedDataRef.current = [];
    const paginationPayload = defaultPagination;
    setPaginationData(paginationPayload);
    fetchData(directory, paginationPayload, false);
    setSelectedDirectory(directory);
  };

  const handleOpenCreateTemplate = () => {
    navigate("/templates/create");
  };

  const handleImportPopupOpen = () => {
    setImportPopup(true);
  };
  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenu({
      anchorEl: event.currentTarget,
      status: true,
    });
  };

  const handleExportMenuClose = () => {
    setExportMenu({
      anchorEl: null,
      status: false,
    });
  };

  const handlePaginationChange = (newPagination: Pagination) => {
    if (selectedDirectory) {
      fetchData(selectedDirectory, newPagination, false);
    }
    setPaginationData(newPagination);
  };

  const handleLoadMore = async (): Promise<void> => {
    if (
      !selectedDirectory ||
      isTemplatesLoading ||
      isReportsLoading ||
      isLoadingMore ||
      paginationData.currentPage >= paginationData.totalPages
    ) {
      return;
    }

    setIsLoadingMore(true);
    const nextPage = paginationData.currentPage + 1;
    const newPagination = { ...paginationData, currentPage: nextPage };
    setPaginationData(newPagination);
    await fetchData(selectedDirectory, newPagination, true);
    setIsLoadingMore(false);
  };

  //<------------------->
  /**
   * @method handleFilterSubmit
   * @description Submits the current filter criteria and executes template search
   * Workflow:
   * - Hides the "Go to Folder" visibility indicator
   * - Hides the "Show templates in folder"
   * - Creates filter payload from current filter state and pagination
   * - Executes filtered template search via API
   * - Updates table data with filtered results
   *
   * @returns {Promise<void>} Promise that resolves when filter submission is complete
   */
  const handleFilterSubmit = async (filter: TemplateFilter) => {
    setIsGoToFolderVisible(false);
    resetBasicFilterSuggestionClickData();
    const payload = createFilterPayload(filter, paginationData);
    await filterTemplate(payload);
  };

  /**
   * @method handleBasicFilterSuggestionClick
   * @description Handles click events on template suggestions from basic filter search
   * Workflow:
   * - Hides the "Go to Folder" visibility indicator
   * - Fetches template count for the specific tag/library
   * - Sets table data to show only the selected template
   * - Expands directory tree to show template's location
   * - Selects the directory containing the template
   *
   * @param {TemplateType} template - The selected template object from suggestions
   * @returns {Promise<void>} Promise that resolves when suggestion click handling is complete
   */
  const handleBasicFilterSuggestionClick = async (template: TemplateType) => {
    setIsGoToFolderVisible(false);
    await getBasicFilterSuggestionClickData({
      libraryId: template.tagId,
      pageSize: 1,
      currentPage: 1,
    });
    setTableData({
      data: [template],
      pagination: {
        currentPage: 1,
        pageSize: 1,
        totalItems: 1,
        totalPages: 1,
      },
    });
    setExpandedDirectories(
      getTargetDirectoryIdTrail(directoriesList.data, template.tagId)
    );
    setSelectedDirectory(
      findDirectoryById(directoriesList.data, template.tagId)
    );
  };

  /**
   * @method handleBasicFilterShowAllResults
   * @description Handles the "Show All Search Results for" action from search interface
   * State changes:
   * - Clears selected directory
   * - Resets expanded directories
   * - Shows "Go to Folder" visibility indicator
   * - Hides the "Show templates in folder"
   * @returns {void}
   */
  const handleBasicFilterShowAllResults = (templateName) => {
    setSelectedDirectory(null);
    setExpandedDirectories([]);
    setIsGoToFolderVisible(true);
    resetBasicFilterSuggestionClickData();
    const payload = {
      templateName: templateName,
      currentPage: 1,
      pageSize: TEMPLATE_LIST_PAGE_SIZE,
    };
    filterTemplate(payload);
  };

  /**
   * @method handleShowAllTemplates
   * @description Shows all templates within the currently selected directory when user clicks, is feature is extended from template search basic filter when user click on template suggestions
   * - Hides "Go to Folder" visibility indicator
   * - Hides the "Show templates in folder"
   * - Re-triggers specific directory to reload all templates
   * - Clears all applied filters
   * @returns {void}
   */
  const handleShowAllTemplates = () => {
    if (selectedDirectory) {
      setIsGoToFolderVisible(false);
      resetBasicFilterSuggestionClickData();
      resetFilteredTemplateList();
      handleDirectoryClick(null, selectedDirectory);
      handleFilterClearAll();
    }
  };

  /**
   * @method handleFilterChipDelete
   * @description Removes a specific filter chip and resets its value to default
   * Filter reset process:
   * - Identifies the filter field to remove
   * - Resets only that field to its default value
   * - Preserves all other active filter settings
   * - Updates filter state immutably
   *
   * @param {string} keyToRemove - The filter field key to reset to default value
   * @returns {void}
   */
  const handleFilterChipDelete = (keyToRemove: string) => {
    setTemplateFilter((prev) => {
      return {
        ...prev,
        [keyToRemove]: JSON.parse(
          JSON.stringify(TEMPLATE_SEARCH_DEFAULT_FILTER)
        )[keyToRemove],
      };
    });
  };

  /**
   * @method handleFilterChange
   * @description Updates a specific filter field with a new value
   *
   * workflow:
   * - Receives field name and new value
   * - Updates only the specified field
   * - Preserves all other filter values
   * - Maintains immutable state updates
   *
   * @param {string} field - The filter field name to update
   * @param {unknown} value - The new value to set for the specified field
   * @returns {void}
   */
  const handleFilterChange = (field: string, value: unknown) => {
    setTemplateFilter((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  /**
   * @method handleFilterClearAll
   * @description Resets all filter fields to their default values
   * workflow:
   * - Clears all filter fields simultaneously
   * - Resets to predefined default filter values
   * - Enables fresh search experience
   *
   * @returns {void}
   */
  const handleFilterClearAll = () => {
    setTemplateFilter(
      JSON.parse(JSON.stringify(TEMPLATE_SEARCH_DEFAULT_FILTER))
    );
    setSelectedDirectory(null);
    setExpandedDirectories([]);
    setIsGoToFolderVisible(true);
    setTableData({ data: [], pagination: defaultPagination });
  };

  /**
   * @method handleGoToFolderClick
   * @description Navigates to the folder containing a specific template
   * Workflow:
   * - Finds the directory containing the template using tagId
   * - Triggers directory click to load folder contents
   * - Hides "Go to Folder" visibility indicator
   * - Expands directory tree to show template location
   *
   * @param {TemplateType} template - The template object whose folder to navigate to
   * @returns {void}
   */
  const handleGoToFolderClick = (template: TemplateType) => {
    handleDirectoryClick(
      null,
      findDirectoryById(directoriesList.data, template.tagId)
    );
    setIsGoToFolderVisible(false);
    setExpandedDirectories(
      getTargetDirectoryIdTrail(directoriesList.data, template.tagId)
    );
  };

  useEffect(() => {
    if (isNonEmptyValue(filteredTemplateList))
      setTableData(filteredTemplateList);
  }, [filteredTemplateList]);

  useEffect(() => {
    if (isNonEmptyValue(tableData?.pagination)) {
      setPaginationData((prev) => ({
        ...prev,
        ...tableData?.pagination,
      }));
    }
  }, [tableData]);

  useEffect(() => {
    if (!isNonEmptyValue(templateFilter?.selectedSort)) return;
    const isSortSelected = Object.values(templateFilter?.selectedSort).some(
      (item) => isNonEmptyValue(item?.fieldName) && isNonEmptyValue(item?.value)
    );
    if (!isSortSelected) return;
    handleFilterSubmit(templateFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateFilter?.selectedSort, selectedDirectory]);

  const isBasicFilterShowAllTemplatesVisible = useMemo(
    () => basicFilterSuggestionClickData?.pagination?.totalItems > 1,
    [basicFilterSuggestionClickData]
  );

  return (
    <PageTemplate>
      <PageTemplate.Header>
        <Stack
          direction="row"
          alignItems="center"
          gap="var(--space-m)"
        >
          <CIconButton
            variant="outline"
            disableTouchRipple
            size="medium"
            severity="secondary"
            walkMeId={["template-library", "navigate-back"]}
            sx={{
              marginRight: "var(--space-l)",
              backgroundColor: "var(--logile-bg-container-1)",
              padding: ".8rem",
            }}
          >
            <CSvgIcon component={ChevronLeft} />
          </CIconButton>
          <Typography
            color="var(--logile-text-primary)"
            variant="h2"
          >
            {TEMPLATE_LIBRARY_HEADING.template}
          </Typography>
        </Stack>
      </PageTemplate.Header>
      <PageTemplate.Content>
        <Box
          className={clsx({
            "template-library": true,
            "template-library--desktop": isDesktop,
          })}
        >
          <Box className="template-library__header">
            <Box className="template-library__text">
              {TEMPLATE_LIBRARY_HEADING.folderTree}
            </Box>
            {selectedTemplate.length > 0 ? (
              <Box className="template-library__header-selected-count">
                <Box className="template-library__label-wrapper">
                  <Box className="template-library__icon">
                    <CIconButton
                      size="medium"
                      severity="secondary"
                      className="template-library__icon-button"
                      onClick={() => setSelectedTemplate([])}
                      walkMeId={[
                        "template-library",
                        "selected-template",
                        "navigate-back",
                      ]}
                    >
                      <CSvgIcon component={ArrowUp} />
                    </CIconButton>
                  </Box>
                  <Box className="template-library__sub-text">
                    {selectedTemplate.length} Selected
                  </Box>
                </Box>
                <Box className="flex-box gap-12">
                  <CIconButton
                    variant="outline"
                    size="medium"
                    walkMeId={[
                      "template-library",
                      "selected-template",
                      "folder-input",
                    ]}
                  >
                    <CSvgIcon component={FolderInput} />
                  </CIconButton>
                  <CIconButton
                    variant="outline"
                    size="medium"
                    severity="destructive"
                    walkMeId={[
                      "template-library",
                      "selected-template",
                      "delete-button",
                    ]}
                  >
                    <CSvgIcon component={Delete} />
                  </CIconButton>
                </Box>
              </Box>
            ) : (
              <Box className="template-library__inner-header">
                <Box className="template-library__inner-header-text">
                  {TEMPLATE_LIBRARY_HEADING.templateLibrary}
                </Box>
                <div className="template-library__search-bar-container">
                  <TemplateSearchBar
                    placeholder={TEMPLATE_LIBRARY_HEADING.searchTemplates}
                    onShowAllSearchResults={handleBasicFilterShowAllResults}
                    onTemplateSuggClick={handleBasicFilterSuggestionClick}
                    setTableData={setTableData}
                    setIsTableDataLoading={() => {}}
                    directoriesList={directoriesList?.data}
                    onSearch={handleFilterSubmit}
                    filter={templateFilter}
                    isFilterDataLoading={isTableDataLoading}
                    onClearFilter={handleFilterClearAll}
                    onFilterChipDelete={handleFilterChipDelete}
                    onFilterChange={handleFilterChange}
                  />
                </div>
                <Stack
                  direction={"row"}
                  alignItems="center"
                  gap="12px"
                >
                  <Box className="ws-nowrap">
                    <CButton
                      severity="primary"
                      variant="solid"
                      size="large"
                      onClick={handleOpenCreateTemplate}
                    >
                      {TEMPLATE_LIBRARY_HEADING.createTemplate}
                    </CButton>
                  </Box>
                  <CIconButton
                    onClick={handleImportPopupOpen}
                    variant="outline"
                    severity="secondary"
                    size="medium"
                    walkMeId={["template-library", "import-templates"]}
                  >
                    <CSvgIcon component={Upload} />
                  </CIconButton>
                  <CIconButton
                    onClick={(event) => handleExportMenuOpen(event)}
                    variant="outline"
                    severity="secondary"
                    size="medium"
                    walkMeId={["template-library", "export-templates"]}
                  >
                    <CSvgIcon component={MoreOption} />
                  </CIconButton>
                </Stack>
              </Box>
            )}
          </Box>
          <CDivider orientation="horizontal" />
          <Box className="template-library__container">
            <div className="directory-tree__container">
              {isDirectoriesLoading ? (
                renderDirectorySkelton()
              ) : (
                <CTreeView
                  data={directoriesList?.data || []}
                  handleClick={handleDirectoryClick}
                  expandedItems={expandedDirectories}
                  onExpandedItemsChange={setExpandedDirectories}
                  selectedItems={
                    selectedDirectory ? [selectedDirectory.libraryId] : []
                  }
                />
              )}
            </div>
            <Box className="template-library__table-wrapper">
              {!isTableDataLoading &&
              (!tableData || tableData?.data?.length == 0) ? (
                <CNoData
                  title={TEMPLATE_LIBRARY_NO_DATA.title}
                  description={TEMPLATE_LIBRARY_NO_DATA.description}
                  imageSrcName={TEMPLATE_LIBRARY_NO_DATA.imageSrcName}
                  imageWidth={90}
                />
              ) : (
                <>
                  <LibraryTable
                    showCheckbox={showCheckbox}
                    setShowCheckbox={setShowCheckbox}
                    selectedDirectory={selectedDirectory}
                    setSelectedTemplate={setSelectedTemplate}
                    selectedTemplate={selectedTemplate}
                    templatesList={tableData}
                    isDataLoading={isTableDataLoading}
                    fetchData={fetchData}
                    paginationData={paginationData}
                    handlePaginationChange={handlePaginationChange}
                    isGoToFolderVisible={isGoToFolderVisible}
                    onGoToFolderClick={handleGoToFolderClick}
                    filteredTemplateList={filteredTemplateList}
                    templateFilter={templateFilter}
                    setTemplateFilter={setTemplateFilter}
                    enableInfiniteScroll={true}
                    onLoadMore={handleLoadMore}
                    resetScrollKey={selectedDirectory?.libraryId}
                    ref={templateTableRef}
                  />
                  <ShowAllTemplatesInFolder
                    isVisible={isBasicFilterShowAllTemplatesVisible}
                    totalTemplates={
                      basicFilterSuggestionClickData?.pagination?.totalItems
                    }
                    onGoToFolder={handleShowAllTemplates}
                  />
                </>
              )}
            </Box>
          </Box>

          <RenderExportMenu
            exportMenu={exportMenu}
            handleExportMenuClose={handleExportMenuClose}
            exportData={tableData?.data}
            ref={templateTableRef}
            exportMethod={templateTableExportData}
          />
          {/* Import Popup */}
          <CModal
            open={importPopup}
            title={IMPORT_MODAL.title}
            size="medium"
            onClose={() => setImportPopup(false)}
            onConfirm={() => setImportPopup(false)}
            cancelText={IMPORT_MODAL.cancelBtnText}
            confirmText={IMPORT_MODAL.confirmBtnText}
          >
            <ModalBody>
              <Box className="template-library__import-modal">
                <CSvgIcon
                  component={Excel}
                  size={44}
                  color="success"
                />
                <Box>{IMPORT_MODAL.description}</Box>
              </Box>
            </ModalBody>
          </CModal>
        </Box>
      </PageTemplate.Content>
    </PageTemplate>
  );
};

export default TemplateLibrary;
