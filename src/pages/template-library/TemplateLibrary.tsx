import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";

import CSvgIcon from "@/core/components/icon/Icon";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import CTreeView from "@/core/components/tree-view/TreeView";
import CIconButton from "@/core/components/button/IconButton";
import PageTemplate from "@/layouts/page-template/PageTemplate";
import SearchDrawer from "@/pages/template-library/components/search-drawer/SearchDrawer";
import {
  ArrowUp,
  ChevronLeft,
  Delete,
  Excel,
  FolderInput,
  MoreOption,
  Search,
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
import CTextfield from "@/core/components/form/textfield/Textfield";
import { isNonEmptyValue } from "@/utils";
import clsx from "@/utils/clsx";
import CDivider from "@/core/components/divider/Divider";

import type { ReportType, TemplateType } from "./types/template-library.type";
import {
  useGetAllDirectories,
  useGetReportsByReportType,
  useGetTemplatesByLibraryId,
} from "./services/template-library-api-hooks";
import RenderExportMenu from "./components/export-menubar/ExportMenu";
import { TEMPLATE_LIST_PAGE_SIZE } from "./constants/constant";
import { templateSkelton } from "./components/skeleton/Skeleton";
import LibraryTable from "./TemplateTable";
import { useTemplateLibraryTranslations } from "./translation/useTemplateLibraryTranslations";
import "./TemplateStyle.scss";

const defaultPagination: Pagination = {
  currentPage: 1,
  pageSize: TEMPLATE_LIST_PAGE_SIZE,
  totalPages: 1,
  totalItems: 0,
};

const TemplateLibrary: React.FC = () => {
  const { TEMPLATE_LIBRARY_HEADING, TEMPLATE_LIBRARY_NO_DATA, IMPORT_MODAL } =
    useTemplateLibraryTranslations();

  const [searchDrawer, setSearchDrawer] = useState({ status: false, text: "" });
  const [selectedDirectory, setSelectedDirectory] =
    useState<DirectoryType | null>(null);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    TemplateType[] | ReportType[]
  >([]);

  const [paginationData, setPaginationData] =
    useState<Pagination>(defaultPagination);
  const [searchTemplateText, setSearchTemplateText] = useState("");
  const [exportMenu, setExportMenu] = useState<{
    anchorEl: null | HTMLElement;
    status: boolean;
  }>({
    anchorEl: null,
    status: false,
  });
  const [importPopup, setImportPopup] = useState<boolean>(false);
  const isDesktop = useIsDesktopViewport();
  const navigate = useNavigate();

  /* API */
  const { data: directoriesList, isLoading: isDirectoriesLoading } =
    useGetAllDirectories();
  const {
    data: templatesList,
    isPending: isTemplatesLoading,
    mutateAsync: getTemplatesByLibraryId,
  } = useGetTemplatesByLibraryId();
  const {
    data: reportsList,
    isPending: isReportsLoading,
    mutateAsync: getReportsByReportTypeId,
  } = useGetReportsByReportType();
  const { renderDirectorySkelton } = templateSkelton;
  const [tableData, setTableData] =
    useState<PaginatedResponse<TemplateType | ReportType>>();
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);

  const openSearchDrawer = () => {
    setSearchDrawer((prev) => ({ ...prev, status: true }));
  };
  const closeSearchDrawer = () => {
    setSearchDrawer((prev) => ({ ...prev, status: false, text: "" }));
  };

  const fetchData = (
    directory: DirectoryType,
    paramsPayload: Record<string, unknown> = {}
  ) => {
    let payload: Record<string, unknown> = {
      ...paginationData,
      ...paramsPayload,
    };
    if (directory?.reportLibraryId) {
      payload = { ...payload, reportTypeId: directory?.reportLibraryId };
      getReportsByReportTypeId(payload);
    } else {
      payload = { ...payload, libraryId: directory?.libraryId };
      getTemplatesByLibraryId(payload);
    }
  };

  const handleDirectoryClick = (
    event: React.MouseEvent<HTMLElement>,
    directory: DirectoryType
  ) => {
    event?.preventDefault();
    event?.stopPropagation();
    const paginationPayload = defaultPagination;
    setPaginationData(paginationPayload);
    fetchData(directory, paginationPayload);
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
      fetchData(selectedDirectory, newPagination);
    }
    setPaginationData(newPagination);
  };

  useEffect(() => {
    let data = null;
    if (selectedDirectory?.reportLibraryId !== undefined) {
      data = reportsList;
    } else if (selectedDirectory?.libraryId !== undefined) {
      data = templatesList;
    }
    setTableData(data);
  }, [reportsList, templatesList, selectedDirectory]);

  useEffect(() => {
    if (isNonEmptyValue(tableData?.pagination)) {
      setPaginationData((prev) => ({
        ...prev,
        ...tableData?.pagination,
      }));
    }
  }, [tableData]);

  useEffect(() => {
    setIsTableDataLoading(isTemplatesLoading);
  }, [isTemplatesLoading]);

  useEffect(() => {
    setIsTableDataLoading(isReportsLoading);
  }, [isReportsLoading]);

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
                <Box className="template-library__searchbar">
                  <CTextfield
                    placeholder={TEMPLATE_LIBRARY_HEADING.searchTemplates}
                    value={searchTemplateText}
                    className="template-library__searchbar-field"
                    onClick={openSearchDrawer}
                    endIcon={
                      <CSvgIcon
                        component={Search}
                        size={20}
                      />
                    }
                  />
                </Box>
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
                <LibraryTable
                  showCheckbox={showCheckbox}
                  setShowCheckbox={setShowCheckbox}
                  selectedDirectory={selectedDirectory}
                  setSelectedTemplate={setSelectedTemplate}
                  selectedTemplate={selectedTemplate}
                  templatesList={tableData}
                  isDataLoading={isTableDataLoading}
                  exportMenu={exportMenu}
                  handleExportMenuClose={handleExportMenuClose}
                  handleExportMenuOpen={handleExportMenuOpen}
                  fetchData={fetchData}
                  paginationData={paginationData}
                  handlePaginationChange={handlePaginationChange}
                />
              )}
            </Box>
          </Box>

          <RenderExportMenu
            exportMenu={exportMenu}
            handleExportMenuClose={handleExportMenuClose}
          />

          <SearchDrawer
            open={searchDrawer.status}
            onClose={closeSearchDrawer}
            paginationData={paginationData}
            setTableData={
              setTableData as (
                value: PaginatedResponse<TemplateType | ReportType>
              ) => void
            }
            setIsTableDataLoading={setIsTableDataLoading}
            searchText={searchTemplateText}
            setSearchText={setSearchTemplateText}
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
