import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Stack, type MenuProps } from '@mui/material';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";

import SvgIcon from '@/core/components/icon/Icon';
import { useGetTemplatesByTagId } from './services/template-library-api-hooks';
import type { DirectoryType, ReportType, TemplatePaginationData, TemplateType } from './types/template-library.type';
import { folderTreeData } from './tableData';
import CommonModal from '@/core/components/modal/Modal';
import TreeView from '@/core/components/tree-view/TreeView';
import IconButton from '@/core/components/button/IconButton';

import LibraryTable from './TemplateTable';
import PageTemplate from '../../layouts/pageTemplate/PageTemplate';
import SearchDrawer from '@/pages/template-library/components/search-drawer/SearchDrawer';
import "./TemplateStyle.scss";

const SearchField = styled(TextField)(() => ({
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

const StyledExportMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    border: '1px solid var(--border-secondary)',
    color: 'rgb(55, 65, 81)',
    padding: '0px',
    boxShadow: 'none',
    '& .MuiMenuItem-root': {
      fontSize: '15px',
      fontWeight: "var(--weight-400)",
      color: 'var(--text-primary)',
      padding: '4px 12px',
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
        ...theme.applyStyles('dark', {
          color: 'inherit',
        }),
      },
      '&:focus, &:hover, &:active': {
        background: "transparent",
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));

const PAGE_SIZE = 10;

const TemplateLibrary: React.FC = () => {

  const [searchDrawer, setSearchDrawer] = useState({ status: false, text: "" });
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

  const openSearchDrawer = () => {
    setSearchDrawer((prev) => ({ ...prev, status: true }));
  };
  const closeSearchDrawer = () => {
    setSearchDrawer((prev) => ({ ...prev, status: false, text: "" }));
  };

  const handleDirectoryClick = (event: React.MouseEvent<HTMLElement>, directory: DirectoryType) => {
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

  const renderExportMenu = () => {
    return (
      <StyledExportMenu
        anchorEl={exportMenu?.anchorEl}
        open={exportMenu?.status}
        onClose={() => handleExportMenuClose()}
      >
        <MenuItem
          disableRipple
        >
          <Box className="template-library__export-menu_main">
            <Typography className='title'>Export</Typography>
            <Box className="tools-wrapper">
              <Box className="tools-item">
                <SvgIcon component="doc" fill="var(--icon-state-information-bold)" size={15} />
                <Typography className='label'>Print</Typography>
              </Box>
              <Box className="tools-item">
                <SvgIcon component="pdf" fill="var(--icon-state-violation)" size={15} />
                <Typography className='label'>PDF</Typography>
              </Box>

              <Box className="tools-item">
                <SvgIcon component="excel" fill="var(--icon-state-success)" size={15} />
                <Typography className='label'>Excel</Typography>
              </Box>

              <Box className="tools-item">
                <SvgIcon component="doc" fill="var(--teal-base)" size={15} />
                <Typography className='label'>CSV</Typography>
              </Box>
            </Box>
          </Box>
        </MenuItem>
      </StyledExportMenu>
    )
  }


  return <PageTemplate>
    <PageTemplate.Header style={{
      height: '5rem'
    }}>
      <Stack direction={"row"} alignItems={'center'}>
        <IconButton variant="outline" disableHover={true} disableTouchRipple sx={{
          marginRight: 'var(--space-l)',
          backgroundColor: 'var(--bg-container-1)',
          padding: '.8rem'
        }}>
          <SvgIcon component={"chevronLeft"} fill='var(--icon-secondary)' size={18} />
        </IconButton>
        <Typography color="var(--text-primary)" variant='h2'>Template</Typography>
      </Stack>
    </PageTemplate.Header>
    <PageTemplate.Content style={{
      height: 'calc(100% - 5.6rem)'
    }}>
      <Box className="template-library">
        <Box className='template-library__header'>
          <Box className='template-library__text'>Folder Tree</Box>
          {selectedTemplate.length > 0 ?
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
              <Box className="template-library__inner-header-text">Template Library</Box>
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
                <Box className="ws-nowrap"><Button variant="primary-filled">Create Template</Button></Box>
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
            />
            {/* } */}
          </Box>
        </Box>

        {renderExportMenu()}

        <SearchDrawer
          open={searchDrawer.status}
          onClose={closeSearchDrawer}
        />


        {/* Import Popup */}
        <CommonModal
          open={importPopup}
          onClose={() => setImportPopup(false)}
          title={<Box className="template-library__import-header">Quick Import - Excel</Box>}
          width="500px"
          showActions={true}
          confirmText="Import"
          cancelText="Cancel"
        >
          <Box className="template-library__import-modal">
            <SvgIcon component="excel" size={44} fill="var(--icon-state-success)" />
            <Box>Select a .XSLX file to import</Box>
          </Box>
        </CommonModal>

      </Box>
    </PageTemplate.Content>
  </PageTemplate>
    ;
};

export default TemplateLibrary;