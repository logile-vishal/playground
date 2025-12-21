import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import CSvgIcon from "@/core/components/icon/Icon";
import CModal, { ModalBody, ModalFooter } from "@/core/components/modal/Modal";
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
import type { PaginatedResponse } from "@/core/types/pagination.type";
import type { TreeViewNodeDataType } from "@/core/types/tree-view.type";
import { CButton } from "@/core/components/button/button";
import CNoData from "@/core/components/no-data/NoData";
import CTextfield from "@/core/components/form/textfield/Textfield";
import clsx from "@/utils/clsx";

import type {
  DirectoryType,
  ReportType,
  TemplatePaginationData,
  TemplateType,
} from "./types/template-library.type";
import {
  useGetAllDirectories,
  useGetTemplatesByTagId,
  useGetReportsByReportType,
} from "./services/template-library-api-hooks";
import RenderExportMenu from "./components/export-menubar/ExportMenu";
import { IMPORT_MODAL, TEMPLATE_LIST_PAGE_SIZE } from "./constants/constant";
import { templateSkelton } from "./components/skeleton/Skeleton";
import LibraryTable from "./TemplateTable";
import { useTemplateLibraryTranslations } from "./translation/useTemplateLibraryTranslations";
import "./TemplateStyle.scss";

const TemplateLibrary: React.FC = () => {
  const { TEMPLATE_LIBRARY_HEADING, TEMPLATE_LIBRARY_NO_DATA } =
    useTemplateLibraryTranslations();

  const [searchDrawer, setSearchDrawer] = useState({ status: false, text: "" });
  const [selectedDirectory, setSelectedDirectory] =
    useState<DirectoryType | null>(null);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    TemplateType[] | ReportType[]
  >([]);

  const [paginationData] = useState<TemplatePaginationData>({
    currentPage: 1,
    pageSize: TEMPLATE_LIST_PAGE_SIZE,
  });
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
    mutateAsync: getTemplatesByTagId,
  } = useGetTemplatesByTagId();
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
    directory: TreeViewNodeDataType,
    paramsPayload: Record<string, unknown> = {}
  ) => {
    let payload: Record<string, unknown> = {
      ...paramsPayload,
      ...paginationData,
    };
    if (directory?.reportType) {
      payload = { ...payload, reportTypeId: directory?.reportType };
      getReportsByReportTypeId(payload);
    } else {
      payload = { ...payload, tagId: directory?.tagId };
      getTemplatesByTagId(payload);
    }
  };

  const handleDirectoryClick = (
    event: React.MouseEvent<HTMLElement>,
    directory: TreeViewNodeDataType
  ) => {
    event?.preventDefault();
    event?.stopPropagation();
    fetchData(directory);
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

  useEffect(() => {
    let data = null;
    if (selectedDirectory?.reportType !== undefined) {
      data = reportsList;
    } else if (selectedDirectory?.tagId !== undefined) {
      data = templatesList;
    }
    setTableData(data);
  }, [reportsList, templatesList, selectedDirectory]);

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
          direction={"row"}
          alignItems={"center"}
        >
          <CIconButton
            variant="outline"
            disableHover={true}
            disableTouchRipple
            sx={{
              marginRight: "var(--space-l)",
              backgroundColor: "var(--logile-bg-container-1)",
              padding: ".8rem",
            }}
          >
            <CSvgIcon
              component={ChevronLeft}
              color="secondary"
              size={18}
            />
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
                      variant="primary"
                      disableHover
                      disableRipple
                      disableTouchRipple
                      className="template-library__icon-button"
                      onClick={() => setSelectedTemplate([])}
                    >
                      <CSvgIcon
                        component={ArrowUp}
                        size={24}
                        color="primary"
                      />
                    </CIconButton>
                  </Box>
                  <Box className="template-library__sub-text">
                    {selectedTemplate.length} Selected
                  </Box>
                </Box>
                <Box className="flex-box gap-12">
                  <CIconButton variant="outline">
                    <CSvgIcon
                      component={FolderInput}
                      size={22}
                      color="brand-primary"
                    />
                  </CIconButton>
                  <CIconButton variant="outline">
                    <CSvgIcon
                      component={Delete}
                      size={22}
                      color="violation"
                    />
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
                    autoComplete="off"
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
                  >
                    <CSvgIcon
                      component={Upload}
                      size={20}
                    />
                  </CIconButton>
                  <CIconButton
                    onClick={(event) => handleExportMenuOpen(event)}
                    variant="outline"
                  >
                    <CSvgIcon
                      component={MoreOption}
                      size={20}
                    />
                  </CIconButton>
                </Stack>
              </Box>
            )}
          </Box>
          <Divider className="template-library__border" />

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
            <ModalFooter
              cancelText={IMPORT_MODAL.cancelBtnText}
              onClose={() => setImportPopup(false)}
              confirmText={IMPORT_MODAL.confirmBtnText}
              onConfirm={() => setImportPopup(false)}
            />
          </CModal>
        </Box>
      </PageTemplate.Content>
    </PageTemplate>
  );
};

export default TemplateLibrary;
