import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";

import CRichTextEditor from "@/core/components/form/rich-text-editor/RichTextEditor";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { CDataTable } from "@/core/components/table/DataTable";
import {
  useFilterTemplates,
  useGetAllDirectories,
  useGetPreviewByTemplateId,
  useGetTemplatesByLibraryId,
} from "@/pages/template-library/services/template-library-api-hooks";
import type { Pagination } from "@/core/types/pagination.type";
import {
  TABLE_PAGINATION_OPTIONS,
  TEMPLATE_LIST_PAGE_SIZE,
  TEMPLATE_SEARCH_DEFAULT_FILTER,
} from "@/pages/template-library/constants/constant";
import type { DirectoryType } from "@/core/types/tree-view.type";
import type {
  TemplatePreviewModalProps,
  TemplateType,
} from "@/pages/template-library/types/template-library.type";
import { FOLLOW_UP_TEMPLATE_COLUMNS } from "@/pages/create-template/constants/follow-up";
import type { FollowUpTemplateColumn } from "@/pages/create-template/types/follow-up.type";
import { templateSkelton } from "@/pages/template-library/components/skeleton/Skeleton";
import { formatDate } from "@/pages/template-library/components/template-libarary-config/TemplatePreviewConfig";
import CIconButton from "@/core/components/button/IconButton";
import CSvgIcon from "@/core/components/icon/Icon";
import { Eye } from "@/core/constants/icons";
import CTreeView from "@/core/components/tree-view/TreeView";
import PreviewModal from "@/pages/template-library/components/preview-modal/PreviewModal";
import RenderExportMenu from "@/pages/template-library/components/export-menubar/ExportMenu";
import { CButton } from "@/core/components/button/button";
import {
  findDirectoryById,
  getTargetDirectoryIdTrail,
} from "@/pages/template-library/utils/template";
import { isNonEmptyValue } from "@/utils";
import CNoData from "@/core/components/no-data/NoData";
import { useTemplateLibraryTranslations } from "@/pages/template-library/translation/useTemplateLibraryTranslations";

import TemplateSearchbar from "./components/template-searchbar/TemplateSearchbar";
import "./FollowUpTemplate.scss";
import { templatePreviewExportData } from "@/utils/generate-export-data";

const defaultPagination: Pagination = {
  currentPage: 1,
  pageSize: TEMPLATE_LIST_PAGE_SIZE,
  totalPages: 1,
  totalItems: 0,
};

const FollowUpTemplate = ({
  control,
  setValue,
  watchFollowUp,
  shouldShowErrors,
  setShouldShowErrors,
}) => {
  const [paginationData, setPaginationData] =
    useState<Pagination>(defaultPagination);
  const [selectedDirectory, setSelectedDirectory] =
    useState<DirectoryType | null>(null);
  const [previewModal, setPreviewModal] = useState<TemplatePreviewModalProps>({
    status: false,
    data: null,
  });
  const [tableData, setTableData] = useState<TemplateType[]>([]);
  const [directoryList, setDirectoryList] = useState<DirectoryType[]>([]);
  const [templateFilter, setTemplateFilter] = useState(
    TEMPLATE_SEARCH_DEFAULT_FILTER
  );
  const [localTemplateSelected, setLocalTemplateSelected] =
    useState<TemplateType | null>(null);
  const { data: filteredTemplateList, mutateAsync: filterTemplate } =
    useFilterTemplates();
  const [expandedDirectories, setExpandedDirectories] = useState<number[]>([]);

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(
    null
  );
  const [exportMenu, setExportMenu] = useState<{
    anchorEl: null | HTMLElement;
    status: boolean;
  }>({
    anchorEl: null,
    status: false,
  });
  const accumulatedDataRef = useRef<TemplateType[]>([]);
  const printContentRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { TEMPLATE_NAME, TAG_TYPE, LAST_MODIFIED_TIME, PREVIEW } =
    FOLLOW_UP_TEMPLATE_COLUMNS;
  const { renderTemplateRowSkelton } = templateSkelton;
  const { data: directoriesData, isLoading: isDirectoriesLoading } =
    useGetAllDirectories();
  const {
    data: templatePreviewData,
    isPending: isPreviewLoading,
    mutateAsync: getPreviewByTemplateId,
    error: hasTemplatePreviewError,
  } = useGetPreviewByTemplateId();

  const {
    isPending: isTemplatesLoading,
    mutateAsync: getTemplatesByLibraryId,
  } = useGetTemplatesByLibraryId();
  const { FOLLOWUP_TASKS } = useCreateTemplateTranslations();
  const { TEMPLATE_LIBRARY_NO_DATA } = useTemplateLibraryTranslations();

  /**
   * @method handleLoadMore
   * @description Loads more templates when user scrolls to the bottom in infinite scroll mode
   * @return {Promise<void>}
   */
  const handleLoadMore = async (): Promise<void> => {
    if (
      !selectedDirectory ||
      isTemplatesLoading ||
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

  /**
   * @method handlePaginationChange
   * @description Handles pagination changes from the pagination control
   * @param {Pagination} newPagination - The new pagination state
   * @return {void}
   */
  const handlePaginationChange = (newPagination: Pagination) => {
    if (selectedDirectory) {
      fetchData(selectedDirectory, newPagination, false);
    }
    setPaginationData(newPagination);
  };

  /**
   * @method resetFilteredTemplateList
   * @description Resets the filtered template list to empty state
   * @return {void}
   */
  const resetFilteredTemplateList = () => {};

  /**
   * @method handlePreviewModalOpen
   * @description Opens the template preview modal for a given template
   * @param {TemplateType} cellData - The template data to preview
   * @return {void}
   */
  const handlePreviewModalOpen = (cellData: TemplateType) => {
    if (cellData?.templateId && cellData?.createdTime) {
      getPreviewByTemplateId(cellData?.templateId);
      setPreviewModal((prev) => ({ ...prev, status: true }));
    }
  };

  /**
   * @method toggleLocalTemplateSelect
   * @description Toggles the selection state of a template in the local state
   * @param {any} row - The table row containing template data
   * @return {void}
   */
  const toggleLocalTemplateSelect = (row) => {
    if (localTemplateSelected?.tagId === row.original.tagId) {
      setLocalTemplateSelected(null);
      return;
    }
    setLocalTemplateSelected(row.original);
  };

  /**
   * @method handleTemplateSelect
   * @description Confirms the selection of a template and updates the form state
   * @return {void}
   */
  const handleTemplateSelect = () => {
    setValue("followUp.templateId", localTemplateSelected?.tagId || null);
    setSelectedTemplate(localTemplateSelected);
    setLocalTemplateSelected(null);
  };

  /**
   * @method handleExportMenuClose
   * @description Closes the export menu
   * @return {void}
   */
  const handleExportMenuClose = () => {
    setExportMenu({
      anchorEl: null,
      status: false,
    });
  };

  /**
   * @method fetchData
   * @description Fetches templates for a given directory with pagination support
   * @param {DirectoryType} directory - The directory to fetch templates from
   * @param {Record<string, unknown>} paramsPayload - Additional parameters for pagination
   * @param {boolean} appendData - Whether to append data to existing results or replace
   * @return {Promise<void>}
   */
  const fetchData = async (
    directory: DirectoryType,
    paramsPayload: Record<string, unknown> = {},
    appendData = false
  ) => {
    let payload: Record<string, unknown> = {
      ...paginationData,
      ...paramsPayload,
    };
    let data = null;

    payload = { ...payload, libraryId: directory?.libraryId };
    data = await getTemplatesByLibraryId(payload);

    if (appendData) {
      const newData = data?.data || [];
      const combined = [...accumulatedDataRef.current, ...newData];
      accumulatedDataRef.current = combined;
      setTableData(combined);
    } else {
      accumulatedDataRef.current = data?.data || [];
      setTableData(data?.data);
    }
    setPaginationData(data?.pagination);
  };

  /**
   * @method handleDirectoryClick
   * @description Handles directory selection in the tree view
   * @param {React.MouseEvent<HTMLElement>} event - The click event
   * @param {DirectoryType} directory - The selected directory
   * @return {void}
   */
  const handleDirectoryClick = (
    event: React.MouseEvent<HTMLElement>,
    directory: DirectoryType
  ) => {
    if (event.preventDefault && event.stopPropagation) {
      event?.preventDefault();
      event?.stopPropagation();
    }
    resetFilteredTemplateList();
    const paginationPayload = defaultPagination;
    setPaginationData(paginationPayload);
    fetchData(directory, paginationPayload, false);
    setSelectedDirectory(directory);
  };

  /**
   * @method handleTemplateSuggestClick
   * @description Handles selection of a suggested template from search results
   * @param {TemplateType} template - The suggested template to select
   * @return {void}
   */
  const handleTemplateSuggestClick = (template: TemplateType) => {
    setTableData([template]);
    setPaginationData({
      currentPage: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    });

    setExpandedDirectories(
      getTargetDirectoryIdTrail(directoryList, template.tagId)
    );
    setSelectedDirectory(findDirectoryById(directoryList, template.tagId));
  };

  /**
   * @method handleShowAllSearchResults
   * @description Shows all search results for a given template name
   * @param {string} templateName - The template name to search for
   * @return {void}
   */
  const handleShowAllSearchResults = (templateName: string) => {
    setSelectedDirectory(null);
    setExpandedDirectories([]);
    const payload = {
      templateName: templateName,
      currentPage: 1,
      pageSize: TEMPLATE_LIST_PAGE_SIZE,
    };
    filterTemplate(payload);
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
    setSelectedTemplate(null);
    setLocalTemplateSelected(null);
    setSelectedDirectory(null);
    setExpandedDirectories([]);
    setTableData([]);
    setPaginationData(defaultPagination);
  };

  useEffect(() => {
    setLocalTemplateSelected(null);
    setSelectedTemplate(null);
  }, [selectedDirectory]);

  useEffect(() => {
    if (isNonEmptyValue(filteredTemplateList?.data))
      setTableData(filteredTemplateList.data);
    setPaginationData(filteredTemplateList?.pagination || defaultPagination);
  }, [filteredTemplateList]);

  useEffect(() => {
    if (templatePreviewData?.data) {
      setPreviewModal((prev) => ({ ...prev, data: templatePreviewData?.data }));
    }
  }, [templatePreviewData]);

  useEffect(() => {
    if (directoriesData) {
      const newData: DirectoryType = directoriesData?.data?.[0];
      setDirectoryList(newData ? [newData] : []);
      if (newData) {
        const paginationPayload = defaultPagination;
        setPaginationData(paginationPayload);
      }
    }
  }, [directoriesData]);

  useEffect(() => {
    const fetchTemplateData = async () => {
      const payload = {
        libraryId: watchFollowUp.templateId,
        pageSize: 1,
        currentPage: 1,
      };
      const data = await getTemplatesByLibraryId(payload);
      const selectedData = data?.data?.[0] || null;
      setSelectedTemplate(selectedData);
    };
    if (
      isNonEmptyValue(watchFollowUp.templateId) &&
      watchFollowUp.templateId !== 0
    )
      fetchTemplateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * @method renderHeader
   * @description Renders the table column header
   * @param {any} column - The column definition object
   * @return {JSX.Element}
   */
  const renderHeader = ({ column }: { column }) => {
    return <div>{column.columnDef.header}</div>;
  };

  /**
   * @method renderTemplateNameCell
   * @description Renders the template name cell content
   * @param {any} cell - The cell object containing template data
   * @return {JSX.Element}
   */
  const renderTemplateNameCell = ({ cell }) => {
    const templateName = cell.getValue();
    return (
      <div className="ct-follow-up-template__template-name-cell">
        {templateName}
      </div>
    );
  };

  /**
   * @method renderTemplateTypeCell
   * @description Renders the template type cell content
   * @param {any} cell - The cell object containing template data
   * @return {JSX.Element}
   */
  const renderTemplateTypeCell = ({ cell }) => {
    const data = cell.row?.original;
    const type = data?.tagType || "-";
    return <div className="template-table__body-type-cell">{type}</div>;
  };

  /**
   * @method renderTemplateModifiedCell
   * @description Renders the last modified date cell content
   * @param {any} cell - The cell object containing template data
   * @return {JSX.Element}
   */
  const renderTemplateModifiedCell = ({ cell }) => {
    const templateData = cell.row.original;
    const lastModified = templateData?.lastModifiedTime;
    if (lastModified == undefined && lastModified == null) return <div>-</div>;
    return <div>{formatDate(lastModified)}</div>;
  };

  /**
   * @method renderPreviewCell
   * @description Renders the preview action cell with icon button
   * @param {any} cell - The cell object containing template data
   * @return {JSX.Element}
   */
  const renderPreviewCell = ({ cell }) => {
    return (
      <div>
        <CIconButton
          onClick={() => handlePreviewModalOpen(cell.row.original)}
          color="secondary"
        >
          <CSvgIcon
            component={Eye}
            size={20}
          />
        </CIconButton>
      </div>
    );
  };

  const columns = [
    {
      order: 1,
      accessorKey: TEMPLATE_NAME,
      header: FOLLOWUP_TASKS.TABLE.HEADING.templateName,
      hide: false,
      size: 2,
      Header: renderHeader,
      Cell: isTemplatesLoading
        ? renderTemplateRowSkelton
        : renderTemplateNameCell,
    },
    {
      order: 2,
      accessorKey: TAG_TYPE,
      header: FOLLOWUP_TASKS.TABLE.HEADING.type,
      hide: false,
      size: 1,
      Header: renderHeader,
      Cell: isTemplatesLoading
        ? renderTemplateRowSkelton
        : renderTemplateTypeCell,
    },
    {
      order: 3,
      accessorKey: LAST_MODIFIED_TIME,
      header: FOLLOWUP_TASKS.TABLE.HEADING.lastModifiedTime,
      hide: false,
      size: 1,
      Header: renderHeader,
      Cell: isTemplatesLoading
        ? renderTemplateRowSkelton
        : renderTemplateModifiedCell,
    },
    {
      order: 4,
      accessorKey: PREVIEW,
      header: FOLLOWUP_TASKS.TABLE.HEADING.preview,
      hide: false,
      size: 1,
      Header: renderHeader,
      Cell: isTemplatesLoading ? renderTemplateRowSkelton : renderPreviewCell,
    },
  ];

  /**
   * @method isRowSelected
   * @description Checks if a template row is currently selected
   * @param {TemplateType} rowData - The template data of the row
   * @return {boolean}
   */
  const isRowSelected = (rowData: TemplateType) => {
    return (
      localTemplateSelected?.tagId === rowData?.tagId &&
      localTemplateSelected?.templateId === rowData?.templateId
    );
  };

  /**
   * @method getColumnsValues
   * @description Maps column keys to their corresponding column definitions
   * @param {string[]} columnKeys - Array of column accessor keys
   * @return {any[]} Array of column definition objects
   */
  const getColumnsValues = (columnKeys) => {
    const columnValues = [];
    columnKeys?.forEach((key) => {
      const column = columns.find((col) => col.accessorKey === key);
      if (column) {
        columnValues.push(column);
      }
    });
    return columnValues;
  };

  /**
   * @method getColumns
   * @description Gets the array of columns for the follow-up template table
   * @return {any[]} Array of column definitions for the table
   */
  const getColumns = (): ReturnType<typeof getColumnsValues> => {
    const columns: FollowUpTemplateColumn[] = [
      TEMPLATE_NAME,
      TAG_TYPE,
      LAST_MODIFIED_TIME,
      PREVIEW,
    ];

    return getColumnsValues(columns);
  };

  /**
   * @method renderNoTableData
   * @description Renders the no data component when table is empty
   * @return {JSX.Element}
   */
  const renderNoTableData = () => {
    return (
      <CNoData
        title={TEMPLATE_LIBRARY_NO_DATA.title}
        description={TEMPLATE_LIBRARY_NO_DATA.description}
        imageSrcName={TEMPLATE_LIBRARY_NO_DATA.imageSrcName}
        imageWidth={60}
      />
    );
  };

  /**
   * @method renderTemplateTable
   * @description Renders the template table with conditional empty state
   * @return {JSX.Element}
   */
  const renderTemplateTable = () => {
    const templateTableProps = {
      columns: getColumns(),
      data: Array.isArray(tableData) ? tableData : [],
      enableColumnActions: false,
      enableColumnFilters: false,
      enablePagination: false,
      enableSorting: false,
      enableBottomToolbar: false,
      enableTopToolbar: false,
      enableStickyHeader: false,
      enableRowSelection: false,
      muiTableBodyRowProps: ({ row }) => ({
        onClick: () => toggleLocalTemplateSelect(row),
        style: { cursor: "pointer" },
      }),
    };

    if (!Array.isArray(tableData) || tableData.length === 0) {
      return (
        <div className="ct-follow-up-template__table-wrapper ct-follow-up-template__table-wrapper--no-data">
          <CDataTable
            tableProps={{
              ...templateTableProps,
              data: [],
              localization: {
                noRecordsToDisplay: "",
              },
            }}
            muiTableStyleProps={{
              height: "auto",
              scrollbarWidth: "none",
            }}
            isLoading={isTemplatesLoading}
            pagination={paginationData}
            handlePaginationChange={handlePaginationChange}
            walkMeIdPrefix={["template table", "pagination"]}
            pageSizeOptions={TABLE_PAGINATION_OPTIONS}
            showPagination={false}
            isRowSelected={isRowSelected}
          />
          <div className="ct-follow-up-template__no-data-container">
            {renderNoTableData()}
          </div>
        </div>
      );
    }

    return (
      <CDataTable
        tableProps={templateTableProps}
        muiTableStyleProps={{
          height: "100%",
          scrollbarWidth: "none",
        }}
        isLoading={isTemplatesLoading}
        pagination={paginationData}
        handlePaginationChange={handlePaginationChange}
        walkMeIdPrefix={["template table", "pagination"]}
        pageSizeOptions={TABLE_PAGINATION_OPTIONS}
        isRowSelected={isRowSelected}
        enableInfiniteScroll={true}
        resetScrollKey={selectedDirectory?.libraryId}
        onLoadMore={handleLoadMore}
      />
    );
  };

  const handleChangeTemplate = () => {
    setSelectedTemplate(null);
    setValue("followUp.templateId", 0);
    setShouldShowErrors(false);
  };

  const renderSkelton = () => {
    return (
      <div className="ct-follow-up-template__table-skelton">
        {renderTemplateRowSkelton()}
        {renderTemplateRowSkelton()}
        {renderTemplateRowSkelton()}
      </div>
    );
  };

  /**
   * @method renderSelectedTemplateDetails
   * @description Renders the selected template details section with change button
   * @return {JSX.Element}
   */
  const renderSelectedTemplateDetails = () => {
    return (
      <div className="ct-follow-up-template__selected-template-details">
        <div className="ct-follow-up-template__selected-template-details-header">
          <div className="ct-follow-up-template__selected-template-details-header-title">
            {FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.selectedTemplate}
          </div>
          <div className="ct-follow-up-template__selected-template-details-header-name">
            {selectedTemplate?.templateName}
          </div>
        </div>
        <div>
          <CButton
            variant="outline"
            size="small"
            onClick={handleChangeTemplate}
          >
            {FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.changeTemplate}
          </CButton>
        </div>
      </div>
    );
  };

  return (
    <div className="ct-follow-up-template">
      <div>
        <Controller
          name="followUp.triggerTaskName"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <CRichTextEditor
                {...field}
                error={!!error}
                helperText={error ? error.message : ""}
                label={FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.taskNameLabel}
                required={true}
                showOnlyWildcard={true}
                className="ct-follow-up-template__subject-editor"
              />
            );
          }}
        />
      </div>
      {isTemplatesLoading ? (
        renderSkelton()
      ) : selectedTemplate ? (
        renderSelectedTemplateDetails()
      ) : (
        <>
          <div>
            <TemplateSearchbar
              filter={templateFilter}
              localTemplateSelected={localTemplateSelected}
              onTemplateSelect={handleTemplateSelect}
              directoryList={directoryList}
              onTemplateSuggestClick={handleTemplateSuggestClick}
              onShowAllSearchResults={handleShowAllSearchResults}
              onFilterClearAll={handleFilterClearAll}
            />
            {shouldShowErrors && (
              <Controller
                name="followUp.templateId"
                control={control}
                render={({ fieldState: { error } }) => {
                  return (
                    <div className="ct-follow-up-template__error">
                      {error ? error.message : ""}
                    </div>
                  );
                }}
              />
            )}
          </div>

          <div className="ct-follow-up-template__content-wrapper">
            <div className="ct-follow-up-template__directory-section">
              <div className="ct-follow-up-template__directory-section-header MuiTableHead-root">
                {FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.directoryTree}
              </div>
              {!isDirectoriesLoading && (
                <div className="ct-follow-up-template__directory-cell">
                  {directoryList && directoryList.length > 0 ? (
                    <CTreeView
                      data={directoryList}
                      handleClick={handleDirectoryClick}
                      selectedItems={
                        selectedDirectory ? [selectedDirectory.libraryId] : []
                      }
                      expandedItems={expandedDirectories}
                      onExpandedItemsChange={setExpandedDirectories}
                    />
                  ) : (
                    <div style={{ padding: "var(--space-m)" }}>
                      {FOLLOWUP_TASKS.TABLE.noDirectories}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="ct-follow-up-template__table-section">
              {renderTemplateTable()}
            </div>
          </div>
        </>
      )}

      <PreviewModal
        previewModal={previewModal}
        onClose={() => setPreviewModal({ status: false, data: null })}
        isPreviewLoading={isPreviewLoading}
        hasTemplatePreviewError={hasTemplatePreviewError}
      />
      <RenderExportMenu
        exportMenu={exportMenu}
        handleExportMenuClose={handleExportMenuClose}
        ref={printContentRef}
        exportData={previewModal?.data}
        exportMethod={templatePreviewExportData}
      />
    </div>
  );
};

export default FollowUpTemplate;
