import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";

import SvgIcon from '@/core/components/icon/Icon';
import CommonModal, { ModalBody, ModalFooter } from '@/core/components/modal/Modal';
import TreeView from '@/core/components/tree-view/TreeView';
import IconButton from '@/core/components/button/IconButton';
import PageTemplate from '@/layouts/page-template/PageTemplate';
import SearchDrawer from '@/pages/template-library/components/search-drawer/SearchDrawer';
import { useIsDesktopViewport } from '@/utils/get-viewport-size';
import clsx from '@/utils/clsx';

import { folderTreeData } from './tableData';
import LibraryTable from './TemplateTable';
import type { DirectoryType, ReportType, TemplatePaginationData, TemplateType } from './types/template-library.type';
import {  useGetTemplatesByTagId } from './services/template-library-api-hooks';
import RenderExportMenu from './components/export-menubar/ExportMenu';
import { IMPORT_MODAL, TEMPLATE_LIBRARY_HEADING } from './constants/constant';
import "./TemplateStyle.scss";
import { CommonButton } from '@/core/components/button/button';
 
const SearchField = styled(TextField)(( ) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontWeight: "var(--weight-400)",
    "& fieldset": {
      border: "1px solid var(--border-secondary)",
    },
    "&:hover fieldset": {
      border: "1px solid var(--border-secondary)",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid gray",
    },
  },
}));
 
const PAGE_SIZE = 10;

const TemplateLibrary: React.FC = () => {
 
    const [searchDrawer, setSearchDrawer] = useState({status: false, text: ""});
    const [selectedDirectory, setSelectedDirectory] = useState<DirectoryType | null>(null);
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType[] | ReportType[]>([]);
 
    const [paginationData] = useState<TemplatePaginationData>({
            currentPage: 1,
            pageSize: PAGE_SIZE,
    }); // TODO : TO BE USED WHEN PAGINATION IS IMPLEMENTED
    const [exportMenu, setExportMenu] = useState<{
      anchorEl: null | HTMLElement;
      status: boolean;
    }>({
      anchorEl: null,
      status: false,
    });
    // const { data: directoriesList, isLoading: isDirectoriesLoading } = useGetAllDirectories();
    const { data: templatesList, isLoading: isTemplatesLoading, } = useGetTemplatesByTagId(selectedDirectory?.tagId, paginationData);
    const { data: reportsList, isLoading: isReportsLoading, } = useGetTemplatesByTagId(+selectedDirectory?.reportType, paginationData);
    // const { renderDirectorySkelton } = templateSkelton;
    const [importPopup, setImportPopup] = useState<boolean>(false);
    const isDesktop = useIsDesktopViewport();
 
    const openSearchDrawer = () => {
        setSearchDrawer((prev) => ({ ...prev, status: true }));
    };
    const closeSearchDrawer = () => {
        setSearchDrawer((prev) => ({ ...prev, status: false, text: "" }));
    };
 
    const handleDirectoryClick = (event:  React.MouseEvent<HTMLElement>, directory:DirectoryType) => {
      event?.preventDefault();
      event?.stopPropagation();
      setSelectedDirectory(directory);
    }
 
    const handleImportPopupOpen = () => {
      setImportPopup(true);
    }
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
 
    return <PageTemplate>
      <PageTemplate.Header>
      <Stack direction={"row"} alignItems={'center'}>
        <IconButton variant="outline" disableHover={true} disableTouchRipple sx={{
          marginRight: 'var(--space-l)',
          backgroundColor: 'var(--bg-container-1)',
          padding: '.8rem'
        }}>
          <SvgIcon component={"chevronLeft"} fill='var(--icon-secondary)' size={18} />
        </IconButton>
        <Typography color="var(--text-primary)" variant='h2'>{TEMPLATE_LIBRARY_HEADING.template}</Typography>
      </Stack>
      </PageTemplate.Header>
      <PageTemplate.Content className="template-library-page-template__content">
      <Box className={clsx({"template-library": true, "template-library--desktop": isDesktop})}>
         <Box className='template-library__header'>
            <Box className='template-library__text'>{TEMPLATE_LIBRARY_HEADING.folderTree}</Box>
            { selectedTemplate.length > 0 ?
              <Box className="template-library__header-selected-count">
                <Box className="template-library__label-wrapper">
                  <Box className="template-library__icon">
                  <IconButton variant='primary' disableHover disableRipple disableTouchRipple
                    className='template-library__icon-button' onClick={() => setSelectedTemplate([])}>
                    <SvgIcon component="arrowUp" size={24} fill="var(--icon-primary)" />
                  </IconButton>
                </Box>
                <Box className='template-library__sub-text'>
                  {selectedTemplate.length} Selected
                </Box>
              </Box>
              <Box className="flex-box gap-12">
                <IconButton variant='outline'>
                  <SvgIcon component="folderInput" size={22} fill="#0A68DB" />
                </IconButton>
                <IconButton variant='outline'>
                  <SvgIcon component="delete" size={22} fill="#F44336" />
                </IconButton>
              </Box>
            </Box> :
            <Box className="template-library__inner-header">
              <Box className="template-library__inner-header-text">{TEMPLATE_LIBRARY_HEADING.templateLibrary}</Box>
              <Box className="template-library__searchbar">
                <SearchField
                  className="search-bar"
                  variant="outlined"
                  placeholder="Search by template name"
                  size="small"
                  fullWidth
                  onClick={openSearchDrawer}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SvgIcon component="search" size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Stack direction={"row"} alignItems="center" gap="12px">
                <Box className="ws-nowrap"><CommonButton severity="primary" variant="solid" size="large">{TEMPLATE_LIBRARY_HEADING.createTemplate}</CommonButton></Box>
                <IconButton onClick={handleImportPopupOpen} variant='outline'><SvgIcon component="upload" size={20} /></IconButton>
                <IconButton onClick={(event) => handleExportMenuOpen(event)} variant='outline'><SvgIcon component="moreOption" size={20} /></IconButton>
              </Stack>
            </Box>
          }
        </Box>
        <Divider className="template-library__border" />

        <Box className="template-library__container">

          <div className="directory-tree__container">

            {/* { 
                isDirectoriesLoading ? renderDirectorySkelton() :
                <TreeView data={directoriesList?.data || []} handleClick={handleDirectoryClick} />
              } */}
            <TreeView data={folderTreeData?.data || []} handleClick={handleDirectoryClick} />

          </div>
          <Box className="template-library__table-wrapper">

            {/* TODO : TO BE REMOVED WHEN BE IS WORKING FINE
              {!isTemplatesLoading && !isReportsLoading  && (!templatesList?.data || templatesList?.data?.length == 0) ?  
                    <NoDataTemplate
                        title = "To view task templates, select a folder on the left or search above"
                        description = "Nothing is selected"
                        imageSrcName = "emptyState"
                        imageWidth={90}
                    /> : */}
                    <LibraryTable
                      showCheckbox={showCheckbox}
                      setShowCheckbox={setShowCheckbox}
                      setSelectedTemplate={setSelectedTemplate}
                      selectedTemplate={selectedTemplate}
                      templatesList={templatesList || reportsList}
                      isDataLoading={isTemplatesLoading || isReportsLoading}
                      exportMenu={exportMenu} 
                      handleExportMenuClose={handleExportMenuClose}
                      handleExportMenuOpen={handleExportMenuOpen}
                    />
                {/* TODO : TO BE REMOVED WHEN BE IS WORKING FINE */}
                {/* } */}
            </Box>
        </Box>

        <RenderExportMenu 
          exportMenu={exportMenu} 
          handleExportMenuClose={handleExportMenuClose} 
        />

        <SearchDrawer
            open={searchDrawer.status}
            onClose={closeSearchDrawer}
        /> 
        
        {/* Import Popup */}
        <CommonModal
          open={importPopup}
          title={IMPORT_MODAL.title}
          size="medium"
          onClose={() => setImportPopup(false)}
          onConfirm={() => setImportPopup(false)}
         >
          <ModalBody>
            <Box className="template-library__import-modal">
              <SvgIcon component="excel" size={44} fill="var(--icon-state-success)" />
              <Box>{IMPORT_MODAL.description}</Box>
            </Box>
          </ModalBody>
          <ModalFooter
            cancelText={IMPORT_MODAL.cancelBtnText}
            onClose={() => setImportPopup(false)}
            confirmText={IMPORT_MODAL.confirmBtnText}
            onConfirm={() => setImportPopup(false)}
          />
        </CommonModal>

      </Box>
    </PageTemplate.Content>
  </PageTemplate>
    ;
};

export default TemplateLibrary;