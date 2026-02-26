import { useState, useEffect, forwardRef, type ForwardedRef } from "react";
import { useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import type { MRT_Cell, MRT_Column } from "material-react-table";

import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import { CDataTable } from "@/core/components/table/DataTable";
import clsx from "@/utils/clsx";
import CSvgIcon from "@/core/components/icon/Icon";
import CIconButton from "@/core/components/button/IconButton";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import { BUTTON_SEVERITY } from "@/core/constants/button-constant";
import {
  ArrowDown,
  ArrowDownFill,
  ArrowUp,
  ArrowUpFill,
  Check,
  Copy,
  Delete,
  Edit,
  ExclamationTriangle,
  GoToFolder,
  InfoCircle,
  Send,
} from "@/core/constants/icons";
import {
  TABLE_PAGINATION_OPTIONS,
  TEMPLATE_STATUS_LABEL,
  TEMPLATE_TABLE_COLUMNS,
  TEMPLATE_TABLE_DATA,
} from "@/pages/template-library/constants/constant";
import { useIsDesktopViewport } from "@/utils/get-viewport-size";
import { renderMacTruncate } from "@/utils/mac-truncate";
import { isNonEmptyValue } from "@/utils";
import { formatHexColor, getOldTemplateIcon } from "@/utils/icon-utils";
import CNestedMenu from "@/core/components/nested-menu/NestedMenu";

import type { SortOption } from "./types/template-constants.type";
import { templateSkelton } from "./components/skeleton/Skeleton";
import type {
  ActionMenuKeys,
  LibraryTableProps,
  MenuState,
  TemplateType,
  ReportType,
  TemplatePreviewModalProps,
  TableColumn,
  TemplateFilter,
} from "./types/template-library.type";
import PreviewModal from "./components/preview-modal/PreviewModal";
import "./TemplateStyle.scss";
import "./TemplateTable.scss";
import {
  useDeleteReportById,
  useDeleteTemplateById,
  useGetPreviewByReportTypeId,
  useGetPreviewByTemplateId,
} from "./services/template-library-api-hooks";
import { useTemplateLibraryTranslations } from "./translation/useTemplateLibraryTranslations";
import { formatDate } from "./components/template-libarary-config/TemplatePreviewConfig";
import {
  REPORT_SORTING,
  TEMPLATE_SORTING,
} from "./components/template-libarary-config/TemplateSortingConfig";
import { getTemplateStatusLabel } from "./utils/getTemplateStatusLabel";

const LibraryTable = forwardRef(
  (props: LibraryTableProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      showCheckbox,
      setShowCheckbox,
      selectedDirectory,
      selectedTemplate,
      setSelectedTemplate,
      templatesList,
      isDataLoading,
      fetchData,
      paginationData,
      handlePaginationChange,
      isGoToFolderVisible,
      onGoToFolderClick,
      templateFilter,
      setTemplateFilter,
      enableInfiniteScroll = false,
      onLoadMore,
      resetScrollKey,
    } = props;
    const { TEMPLATE_TABLE_COLUMN_HEADINGS, DELETE_MODAL } =
      useTemplateLibraryTranslations();
    const navigate = useNavigate();
    const [tableActionMenu, setTableActionMenu] = useState<
      Record<ActionMenuKeys, MenuState>
    >({
      name: { status: false, anchorEl: null },
      created: { status: false, anchorEl: null },
      modified: { status: false, anchorEl: null },
    });
    const [previewModal, setPreviewModal] = useState<TemplatePreviewModalProps>(
      {
        status: false,
        data: null,
      }
    );
    const [tooltipId, setTooltipId] = useState<number | null>(null);

    const {
      renderTemplateActionSkelton,
      renderTemplateCreatedSkelton,
      renderTemplateIconSkelton,
      renderTemplateNameSkelton,
      renderTemplateNameSkeltonDesktop,
      renderTemplateRowSkelton,
    } = templateSkelton;
    const [deleteModal, setDeleteModal] = useState({
      status: false,
      data: null,
    });
    const isDesktop = useIsDesktopViewport();
    const {
      ICON_NAME,
      TEMPLATE_NAME,
      TAG_TYPE,
      STATUS,
      CREATED_TIME,
      LAST_MODIFIED_TIME,
      ACTIONS,
    } = TEMPLATE_TABLE_COLUMNS;
    const isReportType = isNonEmptyValue(selectedDirectory?.reportLibraryId);

    /* APIs */
    const {
      data: templatePreviewData,
      isPending: isPreviewLoading,
      mutateAsync: getPreviewByTemplateId,
      error: hasTemplatePreviewError,
    } = useGetPreviewByTemplateId();
    const { data: reportPreviewData } = useGetPreviewByReportTypeId();
    const {
      mutateAsync: deleteTemplateById,
      isPending: isDeleteTemplateLoading,
      isSuccess: isDeleteTemplateSuccessful,
    } = useDeleteTemplateById();
    const {
      mutateAsync: deleteReportById,
      isSuccess: isDeleteReportSuccessful,
    } = useDeleteReportById();

    const handleDeleteModalOpen = (data) => {
      setDeleteModal((prev) => ({ ...prev, status: true, data }));
    };

    const handleDeleteModalClose = () => {
      setDeleteModal((prev) => ({ ...prev, status: false, data: null }));
    };

    const handleDeleteTemplate = () => {
      if (deleteModal?.data?.savedDate)
        deleteReportById(deleteModal?.data?.reportId);
      else deleteTemplateById(deleteModal?.data?.templateId);

      handleDeleteModalClose();
    };

    const handleAssignTemplate = (data) => {
      navigate("/templates/assign", { state: { templateData: data } });
    };

    const handleRowSelection = (
      checked: boolean,
      rowData: TemplateType | ReportType
    ) => {
      let copyRowData = [
        ...(selectedTemplate as TemplateType[] | ReportType[]),
      ];
      if (checked) {
        copyRowData.push(rowData);
      } else {
        copyRowData = copyRowData.filter(
          (item) => item?.templateId !== rowData?.templateId
        );
      }
      if (copyRowData.length === 0) {
        setShowCheckbox(false);
      } else {
        setShowCheckbox(true);
      }
      setSelectedTemplate(copyRowData as TemplateType[] | ReportType[]);
    };

    const isRowSelected = (rowData: TemplateType | ReportType) => {
      return selectedTemplate?.some(
        (item) => item?.templateId === rowData?.templateId
      );
    };

    /**
     * Checks if all rows are selected. if yes, it clears the selection; otherwise, it selects all rows.
     * @returns void
     */
    const handleSelectAllRows = () => {
      const templateData = (templatesList?.data?.filter(
        (item): item is TemplateType => "templateName" in item
      ) || []) as TemplateType[];
      const isAllRowsSelected = selectedTemplate.length === templateData.length;
      if (!isAllRowsSelected) {
        setSelectedTemplate(templateData);
      } else {
        setSelectedTemplate([]);
      }
    };

    const handleTooltip = (id: number) =>
      setTooltipId((prev) => (prev === id ? null : id));

    const handleMenuClick = (
      event: React.MouseEvent<HTMLElement>,
      type: keyof typeof tableActionMenu
    ) => {
      event.stopPropagation();
      const isOpen = tableActionMenu[type].status;
      setTableActionMenu({
        name: { status: false, anchorEl: null },
        created: { status: false, anchorEl: null },
        modified: { status: false, anchorEl: null },
        [type]: {
          status: !isOpen,
          anchorEl: isOpen ? null : event.currentTarget,
        },
      });
    };

    const handleMenuClose = () => {
      setTableActionMenu({
        name: { status: false, anchorEl: null },
        created: { status: false, anchorEl: null },
        modified: { status: false, anchorEl: null },
      });
    };

    /**
     * @method handleSortSelect
     * @description Updates the templateFilter state with the selected sorting option and closes the menu. It creates a new object for selectedSort to ensure state immutability.
     * @param type - The type of sorting (name, created, modified)
     * @param item - The selected sorting option containing fieldName and value (ASC/DESC)
     * @returns void
     */
    const handleSortSelect = (
      type: keyof typeof tableActionMenu,
      item: SortOption
    ) => {
      const copyFilter: TemplateFilter = { ...templateFilter };
      const newObj = {
        name: null,
        created: null,
        modified: null,
        ...(copyFilter.selectedSort ? { ...copyFilter.selectedSort } : null),
      };
      newObj[type] = item;
      copyFilter.selectedSort = newObj;
      setTemplateFilter(copyFilter);
    };

    const handlePreviewModalOpen = (cellData: TemplateType) => {
      if (cellData?.templateId && cellData?.createdTime) {
        getPreviewByTemplateId(cellData?.templateId);
        setPreviewModal((prev) => ({ ...prev, status: true }));
      }
      /* TODO: Report Preview is not available for now */
    };

    useEffect(() => {
      if (isDeleteTemplateSuccessful || isDeleteReportSuccessful) {
        fetchData(selectedDirectory);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDeleteTemplateSuccessful, isDeleteReportSuccessful]);

    useEffect(() => {
      if (templatePreviewData?.data) {
        setPreviewModal((prev) => ({
          ...prev,
          data: templatePreviewData?.data,
        }));
      } else if (reportPreviewData?.data) {
        setPreviewModal((prev) => ({ ...prev, data: reportPreviewData?.data }));
      }
    }, [templatePreviewData, reportPreviewData]);

    const renderHeaderWithMenu = (
      column: MRT_Column<TemplateType>,
      type: keyof typeof tableActionMenu,
      menuItems: SortOption[]
    ) => {
      const selected = templateFilter?.selectedSort?.[type];
      const isAscending = selected?.value === "ASC";
      if (!menuItems || menuItems?.length == 0)
        return (
          <Box className="template-table__header-with-menu">
            <Box>{column.columnDef.header}</Box>
          </Box>
        );
      return (
        <Box className="template-table__header-with-menu">
          <Box>{column.columnDef.header}</Box>

          {selected ? (
            <Box
              className={clsx({
                "template-table__header-sort-icon": true,
                "cursor-pointer": true,
              })}
            >
              {isAscending ? (
                <CSvgIcon
                  component={ArrowDown}
                  size={20}
                  color="secondary"
                />
              ) : (
                <CSvgIcon
                  component={ArrowUp}
                  size={20}
                  color="secondary"
                />
              )}
            </Box>
          ) : (
            <Box className="template-table__header-sort-icon--empty"></Box>
          )}

          <Box
            className={clsx({
              "template-table__header-menu-toggle": true,
              "cursor-pointer": true,
            })}
            onClick={(e) => handleMenuClick(e, type)}
          >
            {tableActionMenu[type].status ? (
              <CSvgIcon
                component={ArrowUpFill}
                size={20}
                color="secondary"
              />
            ) : (
              <CSvgIcon
                component={ArrowDownFill}
                size={20}
                color="secondary"
              />
            )}
          </Box>

          <CNestedMenu
            key={`${type}-menu-${
              tableActionMenu[type].status ? "open" : "closed"
            }`}
            className="template-table__menu"
            anchorEl={tableActionMenu[type].anchorEl}
            selectedItems={
              templateFilter?.selectedSort?.[type]
                ? [templateFilter.selectedSort?.[type]]
                : []
            }
            onClose={() => handleMenuClose()}
            menuItems={menuItems}
            onSelect={(item) => handleSortSelect(type, item as SortOption)}
            menuWidth={"max-content"}
            templates={{
              itemTemplate: (context) => {
                return (
                  <Box
                    className={clsx({
                      "template-table__menu-item": true,
                      "template-table__menu-item--selected": context.isSelected,
                    })}
                  >
                    {context.item.label}
                    {context.item.value ===
                      templateFilter.selectedSort?.[type]?.value && (
                      <CSvgIcon
                        component={Check}
                        size={16}
                        className="template-table__menu-item-icon"
                      />
                    )}
                  </Box>
                );
              },
            }}
          />
        </Box>
      );
    };
    const renderTemplateNameHeader = ({
      column,
    }: {
      column: MRT_Column<TemplateType>;
    }) =>
      renderHeaderWithMenu(
        column,
        "name",
        isReportType ? REPORT_SORTING().NAME : TEMPLATE_SORTING().NAME
      );
    const renderTemplateCreatedHeader = ({
      column,
    }: {
      column: MRT_Column<TemplateType>;
    }) =>
      renderHeaderWithMenu(
        column,
        "created",
        isReportType ? null : TEMPLATE_SORTING().CREATED
      );
    const renderTemplateModifiedHeader = ({
      column,
    }: {
      column: MRT_Column<TemplateType>;
    }) =>
      renderHeaderWithMenu(
        column,
        "modified",
        isReportType ? REPORT_SORTING().SAVED_DATE : TEMPLATE_SORTING().MODIFIED
      );

    const renderTemplateIconHeader = () => {
      return (
        <Box className="template-table__header-checkbox-container">
          <CCheckbox
            label=""
            onChange={handleSelectAllRows}
            className={clsx({
              "template-table__header-checkbox": true,
              "template-table__header-checkbox--hidden":
                selectedTemplate.length == 0,
            })}
            checked={selectedTemplate.length == templatesList?.data?.length}
            indeterminate={
              selectedTemplate.length > 0 &&
              showCheckbox &&
              selectedTemplate.length !== templatesList?.data?.length
                ? true
                : false
            }
          />
        </Box>
      );
    };

    const renderTemplateHeader = ({ column }) => {
      return (
        <Box className="template-table__header">{column.columnDef.header}</Box>
      );
    };

    const renderTemplateActionHeader = ({ column }) => {
      return (
        <Box
          className={clsx({
            "template-table__header": true,
            "template-table__header--actions": true,
          })}
        >
          {column.columnDef.header}
        </Box>
      );
    };
    const renderTemplateIconCell = ({
      cell,
    }: {
      cell: MRT_Cell<TemplateType>;
    }) => {
      const data = cell.row?.original;
      const isTableSelectable = selectedTemplate.length > 0;
      const templateIcon = getOldTemplateIcon(data?.iconName);
      const templateColor = formatHexColor(data?.iconColour);
      return (
        <div
          className={clsx({
            "template-table__body-icon-cell": true,
            "template-table__body-icon-cell--selected": isTableSelectable,
          })}
        >
          {!isTableSelectable && (
            <>
              <Box
                onClick={() => handleRowSelection(true, cell.row.original)}
                className={clsx({
                  "cursor-pointer": true,
                  "icon-container": true,
                })}
              >
                <CSvgIcon
                  component={templateIcon}
                  fill={templateColor}
                  size={18}
                  className="pointer-events-none"
                />
              </Box>
              <div className="checkbox-container">
                <CCheckbox
                  label=""
                  aria-label="select template"
                  checked={isRowSelected(cell.row.original)}
                  className="template-table__body-checkbox-small"
                  onChange={(event) =>
                    handleRowSelection(
                      (event.target as HTMLInputElement).checked,
                      cell.row.original
                    )
                  }
                />
              </div>
            </>
          )}
          {isTableSelectable && (
            <Box className="checkbox-container cursor-pointer">
              <CCheckbox
                label=""
                checked={isRowSelected(cell.row.original)}
                className="template-table__body-checkbox-small"
                onChange={(event) =>
                  handleRowSelection(
                    (event.target as HTMLInputElement).checked,
                    cell.row.original
                  )
                }
              />
            </Box>
          )}
        </div>
      );
    };

    const renderTemplateNameCell = ({ cell }: { cell }) => {
      const data = cell.row?.original;
      const status = isReportType
        ? TEMPLATE_TABLE_DATA.active
        : data?.status || "-";
      const type = isReportType
        ? TEMPLATE_TABLE_DATA.reportTask
        : data?.tagType || "-";
      return (
        <Box
          className={clsx({
            "template-table__body-template-name-cell": true,
            "template-table__body-template-name-cell--mobile": !isDesktop,
          })}
        >
          <Box onClick={() => handlePreviewModalOpen(data)}>
            {renderMacTruncate(data?.templateName || data?.name || "")}
          </Box>
          {!isDesktop && (
            <Box className="template-name-cell-additional-details">
              <Box
                className={clsx({
                  "template-name-cell-additional-details__type": true,
                })}
              >
                <span className="template-title-text">
                  {TEMPLATE_TABLE_COLUMN_HEADINGS.type}:
                </span>
                <span>{type}</span>
              </Box>
              <Box className="template-name-cell-additional-details__status">
                <span className="template-title-text">
                  {TEMPLATE_TABLE_COLUMN_HEADINGS.status}:
                </span>

                {status === TEMPLATE_STATUS_LABEL.incomplete ? (
                  <span
                    className={clsx({
                      "template-name-cell-additional-details__status-incomplete": true,
                    })}
                  >
                    <span>{data?.status}</span>
                    <CSvgIcon
                      component={ExclamationTriangle}
                      size={16}
                      color="violation"
                    />
                  </span>
                ) : (
                  <span className="template-name-cell-additional-details__status-value">
                    {getTemplateStatusLabel(status)}
                  </span>
                )}
              </Box>
            </Box>
          )}
        </Box>
      );
    };

    const renderTemplateStatusCell = ({
      cell,
    }: {
      cell: MRT_Cell<TemplateType>;
    }) => {
      const data = cell.row?.original;
      const status = isReportType
        ? TEMPLATE_TABLE_DATA.active
        : data?.status || "-";
      return (
        <Box>
          {data?.status === TEMPLATE_STATUS_LABEL.incomplete ? (
            <Box
              className={clsx({
                "template-table__body-status-cell": true,
                "template-table__body-status-cell--incomplete": true,
              })}
            >
              <Box>{getTemplateStatusLabel(data?.status)}</Box>
              <>
                <CSvgIcon
                  component={ExclamationTriangle}
                  size={16}
                  color="violation"
                />
              </>
            </Box>
          ) : (
            <Box
              display="flex"
              gap="2px"
            >
              {status}
            </Box>
          )}
        </Box>
      );
    };

    const renderTemplateTypeCell = ({
      cell,
    }: {
      cell: MRT_Cell<TemplateType>;
    }) => {
      const data = cell.row?.original;
      const type = isReportType
        ? TEMPLATE_TABLE_DATA.reportTask
        : data?.tagType || "-";
      return <Box className="template-table__body-type-cell">{type}</Box>;
    };

    const renderTemplateCreatedCell = ({
      cell,
    }: {
      cell: MRT_Cell<TemplateType>;
    }) => {
      const templateData = cell.row.original;
      if (
        templateData?.createdTime == undefined &&
        templateData?.createdTime == null
      )
        return <Box>-</Box>;
      return (
        <Box className="template-table__body-created-cell">
          <Box>{formatDate(templateData?.createdTime)}</Box>
          <Tooltip
            key={templateData.templateId}
            title={<Box>ID: {templateData.templateId}</Box>}
            arrow
            slotProps={{
              tooltip: {
                className: "template-table__body-created-cell-tooltip",
              },
            }}
            open={tooltipId === templateData.templateId}
            disableFocusListener
            disableHoverListener
            disableTouchListener
          >
            <Box
              display="flex"
              className="cursor-pointer"
              onClick={() => handleTooltip(templateData.templateId)}
            >
              <CSvgIcon
                component={InfoCircle}
                size={18}
                color="secondary"
              />
            </Box>
          </Tooltip>
        </Box>
      );
    };

    const renderTemplateModifiedCell = ({
      cell,
    }: {
      cell: MRT_Cell<TemplateType>;
    }) => {
      const templateData = cell.row.original;
      const lastModified = isReportType
        ? templateData?.savedDate
        : templateData?.lastModifiedTime;
      if (lastModified == undefined && lastModified == null)
        return <Box>-</Box>;
      return (
        <Box className="template-table__body-modified-cell">
          <Box>{formatDate(lastModified)}</Box>
        </Box>
      );
    };

    const renderActionsCell = ({ cell }: { cell: MRT_Cell<TemplateType> }) => {
      const status = cell.row.original?.status;
      const disabledActions = selectedTemplate?.length > 1;
      return (
        <Box
          display="flex"
          alignItems="center"
        >
          {isGoToFolderVisible && (
            <CIconButton
              disabled={
                disabledActions || status === "Incomplete" ? true : false
              }
              onClick={() => onGoToFolderClick(cell.row.original)}
              color="secondary"
            >
              <CSvgIcon
                component={GoToFolder}
                size={20}
              />
            </CIconButton>
          )}
          <CIconButton
            size="medium"
            disabled={
              disabledActions || status === TEMPLATE_STATUS_LABEL.incomplete
                ? true
                : false
            }
            onClick={() => handleAssignTemplate(cell?.row?.original)}
            walkMeId={["template-table", "assignee-task"]}
            className={clsx({
              "template-table__body-action-button": true,
            })}
          >
            <CSvgIcon component={Send} />
          </CIconButton>
          {!isReportType && (
            <>
              <CIconButton
                size="medium"
                disabled={disabledActions}
                walkMeId={["template-table", "copy-task"]}
                className="template-table__action-button"
              >
                <CSvgIcon component={Copy} />
              </CIconButton>
              <CIconButton
                size="medium"
                disabled={disabledActions}
                walkMeId={["template-table", "edit-task"]}
                className="template-table__action-button"
              >
                <CSvgIcon component={Edit} />
              </CIconButton>
            </>
          )}
          <CIconButton
            size="medium"
            severity="destructive"
            disabled={disabledActions || isDeleteTemplateLoading}
            onClick={() => handleDeleteModalOpen(cell?.row?.original)}
            walkMeId={["template-table", "delete-task"]}
            className="template-table__action-button"
          >
            <CSvgIcon component={Delete} />
          </CIconButton>
        </Box>
      );
    };

    const columns = [
      {
        order: 0,
        accessorKey: ICON_NAME,
        header: "",
        hide: false,
        size: 4,
        align: "right",
        Header: renderTemplateIconHeader,
        Cell: isDataLoading
          ? renderTemplateIconSkelton
          : renderTemplateIconCell,
      },
      {
        order: 1,
        accessorKey: TEMPLATE_NAME,
        header: TEMPLATE_TABLE_COLUMN_HEADINGS.name,
        hide: false,
        size: 1,

        Header: renderTemplateNameHeader,
        Cell: isDataLoading
          ? isDesktop
            ? renderTemplateNameSkeltonDesktop
            : renderTemplateNameSkelton
          : renderTemplateNameCell,
      },
      {
        order: 2,
        hide: !isDesktop,
        accessorKey: TAG_TYPE,
        header: TEMPLATE_TABLE_COLUMN_HEADINGS.type,
        Header: renderTemplateHeader,
        size: 4,
        Cell: isDataLoading ? renderTemplateRowSkelton : renderTemplateTypeCell,
        muiTableHeadCellProps: () => ({
          className: "template-head-text",
          style: { width: "200px", padding: "1rem 0.8rem" },
        }),
      },
      {
        order: 3,
        hide: !isDesktop,
        accessorKey: STATUS,
        header: TEMPLATE_TABLE_COLUMN_HEADINGS.status,
        size: 1,
        Header: renderTemplateHeader,
        Cell: isDataLoading
          ? renderTemplateRowSkelton
          : renderTemplateStatusCell,
        muiTableHeadCellProps: () => ({
          className: "template-head-text",
          style: { width: "200px", padding: "1rem 0.8rem" },
        }),
      },
      {
        order: 4,
        accessorKey: CREATED_TIME,
        header: TEMPLATE_TABLE_COLUMN_HEADINGS.created,
        hide: false,
        size: 1,
        Header: renderTemplateCreatedHeader,
        Cell: isDataLoading
          ? renderTemplateCreatedSkelton
          : renderTemplateCreatedCell,
        muiTableHeadCellProps: () => ({
          className: "template-head-text",
          style: { width: "200px", padding: "1rem 0.8rem" },
        }),
      },
      {
        order: 5,
        accessorKey: LAST_MODIFIED_TIME,
        header: TEMPLATE_TABLE_COLUMN_HEADINGS.lastModified,
        hide: false,
        size: 1,
        Header: renderTemplateModifiedHeader,
        Cell: isDataLoading
          ? renderTemplateRowSkelton
          : renderTemplateModifiedCell,
        muiTableHeadCellProps: () => ({
          className: "template-head-text",
          style: { width: "200px", padding: "1rem 0.8rem" },
        }),
      },
      {
        order: 6,
        accessorKey: ACTIONS,
        header: TEMPLATE_TABLE_COLUMN_HEADINGS.actions,
        hide: false,
        size: 1,
        Header: renderTemplateActionHeader,
        Cell: isDataLoading ? renderTemplateActionSkelton : renderActionsCell,
        muiTableHeadCellProps: () => ({
          className: "template-head-text",
          style: { padding: "1rem 1.6rem 1rem 0.8rem" },
        }),
        muiTableBodyCellProps: () => ({
          className: "template-body-text",
          style: { paddingRight: "1.6rem" },
        }),
      },
    ];

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
     * Determines which columns to display for reports and templates.
     * View is also based on desktop and mobile
     * @returns {Array} Array of column objects filtered by the current context
     */

    const getColumns = (): ReturnType<typeof getColumnsValues> => {
      const desktopColumns: TableColumn[] = isReportType
        ? [
            ICON_NAME,
            TEMPLATE_NAME,
            TAG_TYPE,
            STATUS,
            LAST_MODIFIED_TIME,
            ACTIONS,
          ]
        : [
            ICON_NAME,
            TEMPLATE_NAME,
            TAG_TYPE,
            STATUS,
            CREATED_TIME,
            LAST_MODIFIED_TIME,
            ACTIONS,
          ];

      const mobileColumns: TableColumn[] = isReportType
        ? [ICON_NAME, TEMPLATE_NAME, LAST_MODIFIED_TIME, ACTIONS]
        : [ICON_NAME, TEMPLATE_NAME, CREATED_TIME, LAST_MODIFIED_TIME, ACTIONS];

      const columns = isDesktop ? desktopColumns : mobileColumns;

      return getColumnsValues(columns);
    };

    // Only show skeleton when loading initial data (first page), not during infinite scroll
    const shouldShowSkeleton =
      isDataLoading &&
      (!templatesList?.data?.length || templatesList.data.length === 0);

    const templateTableProps = {
      columns: getColumns(),
      data: shouldShowSkeleton
        ? Array.from({ length: 10 }).map((_, idx) => ({
            id: `skeleton-${idx}`,
          }))
        : templatesList?.data || [],
      enableColumnActions: false,
      enableColumnFilters: false,
      enablePagination: false,
      enableSorting: false,
      enableBottomToolbar: false,
      enableTopToolbar: false,
      muiTableBodyRowProps: { hover: false },
    };

    return (
      <div
        ref={ref}
        className={clsx({
          "template-library-table-container": true,
          "template-table": true,
          "template-table-pagination-hidden": paginationData.totalPages <= 1,
        })}
      >
        <CDataTable
          tableProps={templateTableProps}
          isRowSelected={isRowSelected}
          muiTableStyleProps={{
            height: "100%",
            scrollbarWidth: "none",
          }}
          isLoading={isDataLoading}
          pagination={paginationData}
          handlePaginationChange={handlePaginationChange}
          walkMeIdPrefix={["template table", "pagination"]}
          pageSizeOptions={TABLE_PAGINATION_OPTIONS}
          showPagination={paginationData.totalPages > 1}
          enableInfiniteScroll={enableInfiniteScroll}
          onLoadMore={onLoadMore}
          resetScrollKey={resetScrollKey}
        />
        <PreviewModal
          previewModal={previewModal}
          onClose={() => setPreviewModal({ status: false, data: null })}
          isPreviewLoading={isPreviewLoading}
          hasTemplatePreviewError={hasTemplatePreviewError}
        />
        <CModal
          open={deleteModal?.status}
          onConfirm={() => handleDeleteTemplate()}
          onClose={handleDeleteModalClose}
          title={DELETE_MODAL.title}
          showActions={true}
          size="medium"
          severity={BUTTON_SEVERITY.destructive}
          confirmText={DELETE_MODAL.confirmBtnText}
        >
          <ModalBody>
            <Box className="template-delete__modal-body">
              {DELETE_MODAL.description}
            </Box>
          </ModalBody>
        </CModal>
      </div>
    );
  }
);

export default LibraryTable;
