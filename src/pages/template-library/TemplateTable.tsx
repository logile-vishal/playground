import { useState } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import type { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import type { MRT_Cell, MRT_Column } from "material-react-table";

import { DataTable } from "@/core/components/table/DataTable";
import SvgIcon from "@/core/components/icon/Icon";
import type { IconName } from "@/core/types/icon.type";
import IconButton from "@/core/components/button/IconButton";
import CommonModal, { ModalBody } from "@/core/components/modal/Modal";
import { BUTTON_SEVERITY } from "@/core/constants/button-constant";
import { DELETE_MODAL, formatDate, TEMPLATE_SORTING, TEMPLATE_TYPE } from "@/pages/template-library/constants/constant";
import { useIsDesktopViewport } from "@/utils/get-viewport-size";
import { renderMacTruncate } from "@/utils/mac-truncate";

import { demoTableData } from "./tableData";
import type { SortOption } from "./types/template-constants.type";
import { templateSkelton } from "./components/skeleton/Skeleton";
import type { ActionMenuKeys, LibraryTableProps, MenuState, TemplateType } from "./types/template-library.type";
import PreviewModal from "./components/preview-modal/PreviewModal";
import type { IconConfigProp } from "./types/template-preview.type";
import "./TemplateStyle.scss";

const StyledMenu = styled((props: MenuProps) => (
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
    border: '1px solid #0A68DB',
    color: 'rgb(55, 65, 81)',
    paddingTop: '6px',
    paddingBottom: '6px',
    boxShadow: 'none',
    '& .MuiMenuItem-root': {
        fontSize:'15px',
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
      '&:focus, &:hover, &:active':{
        background: "transparent",
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));

const LibraryTable: React.FC<LibraryTableProps> = ({
  showCheckbox,
  setShowCheckbox,
  selectedTemplate,
  setSelectedTemplate,
  templatesList,
  isDataLoading, 
  exportMenu,
  handleExportMenuClose,
  handleExportMenuOpen,
}) => {

    const [tableActionMenu, setTableActionMenu] = useState<Record<ActionMenuKeys, MenuState>>({
        name: { status: false, anchorEl: null },
        created: { status: false, anchorEl: null },
        modified: { status: false, anchorEl: null },
    });
    const [previewModal, setPreviewModal] = useState<{status: boolean, data: TemplateType | null}>({status: false, data: null});
    const [tooltipId, setTooltipId] = useState<number | null>(null);
    const [selectedSort, setSelectedSort] = useState<{[key in keyof typeof tableActionMenu]?: SortOption | null}>({
      name: null,
      created: null,
      modified: null,
    });
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

    const handleDeleteModalOpen = (data) => {
      setDeleteModal((prev)=>({...prev, status: true, data: data}))
    }
 
     const handleDeleteModalClose = () => {
      setDeleteModal((prev)=>({...prev, status: false, data: null}))
    }

    const handleDeleteTemplate = () => {
      handleDeleteModalClose();
    }

    const handleRowSelection = (checked:boolean, rowData: TemplateType) => {
      let copyRowData = [...(selectedTemplate as TemplateType[])];
      if(checked) {
        copyRowData.push(rowData);
      }
      else {
        copyRowData = copyRowData.filter((item) => item?.templateId !== rowData?.templateId);
      }
      if(copyRowData.length === 0) {
        setShowCheckbox(false);
      }
      else {
        setShowCheckbox(true);
      }
        setSelectedTemplate(copyRowData);
    }

    const isRowSelected = (rowData: TemplateType) => {
      return selectedTemplate?.some((item) => item?.templateId === rowData?.templateId);
    }
    

    /**
     * Checks if all rows are selected. if yes, it clears the selection; otherwise, it selects all rows.
     * @returns void
    */
    const handleSelectAllRows = () => {
      const templateData = (templatesList?.data?.filter((item): item is TemplateType => 'templateName' in item) || []) as TemplateType[];
      const isAllRowsSelected = selectedTemplate.length === templateData.length;
      if(!isAllRowsSelected) {
        setSelectedTemplate(templateData);
      }
      else {
        setSelectedTemplate([]);
      }
    }
 
 
    const handleTooltip = (id: number) => setTooltipId((prev) => (prev === id ? null : id));
 
    
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, type: keyof typeof tableActionMenu) => {
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
 
    const handleSortSelect = (type: keyof typeof tableActionMenu, item: SortOption) => {
       const newObj: typeof selectedSort  = {};
      Object.entries(selectedSort).map(([key, menuItem])=>{
        if(key !== type) {
          newObj[key] = null;
        }
        else {
          if(menuItem === null || menuItem === undefined || menuItem?.key !== item?.key)
            newObj[key] = item;
          else
            newObj[key] = null;
        }
      })
      setSelectedSort({...newObj});
    };
 
    const handlePreviewModalOpen = (cellData: TemplateType) => {
      setPreviewModal({status: true, data: cellData});
    }
 
    const renderHeaderWithMenu = (column: MRT_Column<TemplateType>, type: keyof typeof tableActionMenu, menuItems: SortOption[]) => {
      const selected = selectedSort[type];
      const isAscending = selected?.key === "ASCENDING";
 
      return (
        <Box display="flex" alignItems="center" gap="4px">
          <Box>{column.columnDef.header}</Box>
 
          {selected ? <Box className="cursor-pointer" height="20px">
            {isAscending ? <SvgIcon component="arrowDown" size={20} fill="var(--icon-secondary)" /> :
              <SvgIcon component="arrowUp" size={20} fill="var(--icon-secondary)" />}
          </Box>: <Box ></Box>}
 
          <Box
            height="20px"
            className="cursor-pointer"
            onClick={(e) => handleMenuClick(e, type)}
          >
            {tableActionMenu[type].status ? (
              <SvgIcon component="arrowUpFill" size={20} fill="var(--icon-secondary)" />
            ) : (
              <SvgIcon component="arrowDownFill" size={20} fill="var(--icon-secondary)" />
            )}
          </Box>
 
          <StyledMenu
            key={`${type}-menu-${tableActionMenu[type].status ? "open" : "closed"}`}
            anchorEl={tableActionMenu[type].anchorEl}
            open={tableActionMenu[type].status}
            onClose={() => handleMenuClose()}
          >
            {menuItems.map((item, index) => {
              const isSelected = selected?.key === item?.key;
              return (
                <MenuItem
                  key={index}
                  disableRipple
                  selected={isSelected}
                  onClick={() => handleSortSelect(type, item)}
                  sx={{
                    color: isSelected ? "#0A68DB" : "var(--text-primary)",
                    fontWeight: isSelected ? "var(--weight-500)" : "var(--weight-400)",
                    "&:hover": { backgroundColor: "transparent" },
                    "&.Mui-selected": {
                      backgroundColor: "transparent",
                      color: "#0A68DB",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" width="100%" color={isSelected ? "#0A68DB" : "var(--text-primary)"} justifyContent="space-between">
                    {item?.getLabel() || ""}
                    {isSelected && (
                      <SvgIcon
                        component="check"
                        size={20}
                        fill="#0A68DB"
                        style={{ marginLeft: "auto" }}
                      />
                    )}
                  </Box>
                </MenuItem>
              );
            })}
          </StyledMenu>
        </Box>
      );
    };
 
const renderTemplateNameHeader = ({ column }: { column: MRT_Column<TemplateType> }) => renderHeaderWithMenu(column, "name", TEMPLATE_SORTING.NAME);
const renderTemplateCreatedHeader = ({ column }: { column: MRT_Column<TemplateType> }) => renderHeaderWithMenu(column, "created", TEMPLATE_SORTING.CREATED);
const renderTemplateModifiedHeader = ({ column }: { column: MRT_Column<TemplateType> }) => renderHeaderWithMenu(column, "modified", TEMPLATE_SORTING.MODIFIED);
 
    const renderTemplateIconHeader = () => {
      return <Box className="tableheader__checkbox-container" >
        { selectedTemplate.length > 0 ?
          <FormControlLabel
              className="tableheader__checkbox cursor-pointer"
              sx={{padding:0, margin:0}}
              control={
                <Checkbox
                onChange={handleSelectAllRows}
                  size="small"
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 20 },
                      color: 'var(--icon-secondary)',
                    '&.Mui-checked': {
                        color: 'var(--bg-primary)',
                      },
                      '&.MuiFormControlLabel-root': {
                        padding: '0px 10px'
                      }
                    }}
                  checked={selectedTemplate.length == templatesList?.data?.length}
                  indeterminate={selectedTemplate.length > 0 && showCheckbox && selectedTemplate.length !== templatesList?.data?.length ? true : false }
                />
              }
              label=""
            />
          : <Box height="20px"></Box>
        }
      </Box>
    }
 
    const renderTemplateCommonHeader = ({column}) => {
      return (
        <Box height="20px" display="flex" alignItems="center">
          {column.columnDef.header}
        </Box>
      )
    }
 
    const renderTemplateActionHeader = ({column}) => {
      return (
        <Box height="20px" display="flex" ml="8px" alignItems="center">
          {column.columnDef.header}
        </Box>
      )
    }

    const getTemplateTypeIconConfig = (tagType: string) => {
      let config: IconConfigProp = {
        color: '',
        icon: 'checkedList',
      }
      switch(tagType?.toUpperCase()) {
        case TEMPLATE_TYPE.CHECKLIST:
          config = {color: "var(--icon-brand-primary)", icon: "checkedList"}
          break;
        case TEMPLATE_TYPE.FORM:
          config = {color:'var(--bg-utility-purple-base)', icon: "form"}
          break;
        case TEMPLATE_TYPE.GRID: 
          config = {color:'var(--icon-brand-primary)', icon: "gridFilled"}
          break;
        case TEMPLATE_TYPE.SPREADSHEET: 
          config = {color:'var(--icon-state-success)', icon: "spreadsheet"}
          break;
      }
      return config;
    }
 
    const renderTemplateIconCell = ({cell }: {cell: MRT_Cell<TemplateType>}) => {
        const data = cell.row?.original;
        const isTableSelectable = selectedTemplate.length > 0 ;
        const iconConfig = getTemplateTypeIconConfig(data?.tagType);
        return <>
              {!isTableSelectable && <Box className="template-checkbox-container tablebody-col__checkbox--toggle" display="flex"
                >
                    <Box onClick={() => handleRowSelection(true, cell.row.original)} className="cursor-pointer icon-container" >
                      <IconButton>
                         <SvgIcon
                            component={iconConfig?.icon}
                            size={18}
                            fill={iconConfig?.color}
                            style={{ pointerEvents: 'none' }}
                         /> 
                      </IconButton>
                    </Box>
                    <FormControlLabel
                    label=""
                      className="form-control-label checkbox-wrapper"
                      onChange={(event) => handleRowSelection((event.target as HTMLInputElement).checked, cell.row.original)}
                        control={
                            <Checkbox
                              size="small"
                              aria-label="select template"
                              checked={isRowSelected(cell.row.original)}
                              sx={{
                                '& .MuiSvgIcon-root': { fontSize: 20 },
                                  color: 'var(--icon-secondary)',
                                '&.Mui-checked': {
                                    color: 'var(--bg-primary)',
                                  },
                                }}
                            />
                        }
                 
                    />
                     </Box>}
               {
                isTableSelectable && <Box className="checkbox-container cursor-pointer"  >
                    <FormControlLabel
                      className="form-control-label"
                      onChange={(event) => handleRowSelection((event.target as HTMLInputElement).checked, cell.row.original)}
                        control={
                            <Checkbox
                              size="small"
                              checked={isRowSelected(cell.row.original)}
                              sx={{
                                '& .MuiSvgIcon-root': { fontSize: 20 },
                                  color: 'var(--icon-secondary)',
                                '&.Mui-checked': {
                                    color: 'var(--bg-primary)',
                                  },
                                }}
                            />
                        }
                      label=""
                    />
                    </Box>
    }
          </>
    }
 
    const renderTemplateNameCell = ({cell}: {cell: MRT_Cell<TemplateType>}) => {
        const data = cell.row?.original;
        return (
               <Box minWidth="300px" display="flex" alignItems="center" gap="10px">
                   <Box width="100%" display="flex" flexDirection="column" gap="6px">
                        <Box width="100%" className="template-body-text cursor-pointer" onClick={()=>handlePreviewModalOpen(data)}>{renderMacTruncate(data?.templateName || "")}</Box>
                          {!isDesktop ?
                          <Box display="flex" gap="24px">
                            <Box display="flex" gap="4px" className="template-body-text template-status"><span className="template-title-text">Type:</span>{data?.tagType || "Checklist"}</Box>
                            <Box display="flex" gap="4px" className="template-body-text template-status"><span className="template-title-text">Status:</span>
                              {data?.status === "Incomplete" ?
                                <Box display='flex' gap='2px' alignItems='center' justifyContent='center' color="#F44336">
                                  <Box>{data?.status}</Box>
                                  <><SvgIcon component={'exclamationTriangle' as IconName} size={16} fill="#F44336" /></>
                                </Box> :
                                <Box display='flex' gap='2px'>{data?.status || "Active"}</Box>
                              }
                            </Box>
                          </Box>
                          :""}
                   </Box>
               </Box>
            )
    }
 
    const renderTemplateStatusCell = ({cell}: {cell: MRT_Cell<TemplateType>}) => {
      const data = cell.row?.original;
      return (<Box>
        {data?.status === "Incomplete" ?
          <Box display='flex' gap='2px' alignItems='center' justifyContent='center' color="#F44336">
            <Box>{data?.status}</Box>
            <><SvgIcon component={'exclamationTriangle' as IconName} size={16} fill="#F44336" /></>
          </Box> :
          <Box display='flex' gap='2px'>{data?.status || "Active"}</Box>
        }
      </Box>
      )
    }
 
     const renderTemplateTypeCell = ({cell}: {cell: MRT_Cell<TemplateType>}) => {
      const data = cell.row?.original;
      return (
          <Box display='flex' gap='2px'>{data?.tagType || "Checklist"}</Box>
      )
    }
 
    const renderTemplateCreatedCell = ({cell}: {cell: MRT_Cell<TemplateType>}) => {
      const templateData = cell.row.original;
      return (
            <Box display="flex" gap="4px" alignItems='center'>
              <Box>{formatDate(templateData?.createdTime)}</Box>
                <Tooltip
                  key={templateData.templateId}
                  title={<Box>ID: {templateData.templateId}</Box>}
                  arrow
                  slotProps={{
                    tooltip: {
                      sx: {
                        fontSize: "12px",
                        padding: "4px 8px",
                      },
                    },
                  }}
                  PopperProps={{
                    sx: { zIndex: 1000 },
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
                    <SvgIcon component="infoCircle" size={18} fill="var(--icon-secondary)" />
                  </Box>
                </Tooltip>
              </Box>
            )
    }
 
    const renderTemplateModifiedCell = ({cell}: {cell: MRT_Cell<TemplateType>}) => {
      const templateData = cell.row.original;
      return (
            <Box display="flex" gap="4px" alignItems='center'>
              <Box>{formatDate(templateData?.lastModifiedTime)}</Box>
            </Box>
            )
    }
 
    const renderActionsCell = ({cell}: {cell: MRT_Cell<TemplateType>}) => {
      const status = cell.row.original?.status;
      const disabledActions = selectedTemplate?.length > 1;
        return (
            <Box display="flex" alignItems="center">
              <IconButton disabled={(disabledActions || status === "Incomplete") ? true : false} disableHover><SvgIcon component="send" size={20} /></IconButton>
              <IconButton disabled={disabledActions} disableHover><SvgIcon component="copy" size={20} /></IconButton>
              <IconButton disabled={disabledActions} disableHover><SvgIcon component="edit" size={20} /></IconButton>
              <IconButton disabled={disabledActions} disableHover><SvgIcon component="download" size={20} /></IconButton>
              <IconButton disabled={disabledActions} disableHover onClick={handleDeleteModalOpen}><SvgIcon component="delete" size={20} fill={disabledActions ? "var(--icon-state-violation-subtle)" : "var(--icon-state-violation)"}/></IconButton>
            </Box>
        )
    }

    const columns = [
      {
        order:0,
        accessorKey: "iconName",
        header: "",
        hide:false,
        size:1,
        Header: renderTemplateIconHeader,
        Cell: isDataLoading ? renderTemplateIconSkelton : renderTemplateIconCell,
        muiTableHeadCellProps: () => ({className: "tableheader-checkbox__container", style:{width: "50px", padding: "0.8rem 0.6rem 0.8rem 1.6rem"} }),
        muiTableBodyCellProps: () => ({className: "template-body-text", style: { padding: "0.8rem 0.6rem 0.8rem 1.6rem"} })
     },
      {
        order:1,
        accessorKey: "templateName",
        header: "Name",
        hide:false,
        size:1,
        Header: renderTemplateNameHeader,
        Cell: isDataLoading ? isDesktop ? renderTemplateNameSkeltonDesktop : renderTemplateNameSkelton : renderTemplateNameCell,
        muiTableHeadCellProps: () => ({className: "template-head-text", style:{width:"200px", padding: "0.8rem 0.4rem 0.8rem 0.6rem"} }),
        muiTableBodyCellProps: () => ({className: "template-body-text", style: {padding: "0.8rem 0.4rem 0.8rem 0.6rem"} })
      },
      {
        order:2,
        hide:!isDesktop,
        accessorKey: "tagType",
        header: "Type",
        Header: renderTemplateCommonHeader,
        size:1,
        Cell: isDataLoading ? renderTemplateRowSkelton : renderTemplateTypeCell,
        muiTableHeadCellProps: () => ({className: "template-head-text", style:{width:"200px", padding:"1rem 0.8rem"} }),
        muiTableBodyCellProps: () => ({className: "template-body-text" })
      },
      {
        order:3,
        hide:!isDesktop,
        accessorKey: "status",
        header: "Status",
        size:1,
        Header: renderTemplateCommonHeader,
        Cell: isDataLoading ? renderTemplateRowSkelton : renderTemplateStatusCell,
        muiTableHeadCellProps: () => ({className: "template-head-text", style:{width:"200px", padding:"1rem 0.8rem"} }),
        muiTableBodyCellProps: () => ({className: "template-body-text" })
      },{
        order:4,
        accessorKey: "createdTime",
        header: "Created",
        hide:false,
        size:1,
        Header: renderTemplateCreatedHeader,
        Cell: isDataLoading ? renderTemplateCreatedSkelton : renderTemplateCreatedCell,
        muiTableHeadCellProps: () => ({className: "template-head-text", style:{width:"200px", padding:"1rem 0.8rem"} }),
        muiTableBodyCellProps: () => ({className: "template-body-text" })
      },
      {
        order:5,
        accessorKey: "lastModifiedTime",
        header: "Last Modified",
        hide:false,
        size:1,
        Header: renderTemplateModifiedHeader,
        Cell: isDataLoading ? renderTemplateRowSkelton : renderTemplateModifiedCell,
        muiTableHeadCellProps: () => ({className: "template-head-text", style:{width:"200px", padding:"1rem 0.8rem"} }),
        muiTableBodyCellProps: () => ({className: "template-body-text" })
      },
     {
        order:6,
        accessorKey: "actions",
        header: "Actions",
        hide:false,
        size:1,
        Header: renderTemplateActionHeader,
        Cell: isDataLoading ? renderTemplateActionSkelton : renderActionsCell,
        muiTableHeadCellProps: () => ({className: "template-head-text", style:{padding:"1rem 1.6rem 1rem 0.8rem"} }),
        muiTableBodyCellProps: () => ({className: "template-body-text", style:{paddingRight:"1.6rem"} })
      },
    ]
 
    const getColumns = () => {
      return columns.filter(i=> !i.hide).sort((a, b) => (a.order || 0) - (b.order || 0));
      // let col = [];
      //  if (isDesktop)
      //     col =  [...columns, ...desktopColumns, ...columns2];
      //  else
      //     col = [...columns, ...columns2];
 
      // return col.sort((a, b) => (a.order || 0) - (b.order || 0));
    };
 
    const templateTableProps = {
    columns: getColumns(),
    data: demoTableData,
    // TODO : NEED TO BE REMOVED WHEN BE IS WORKING FINE
    // isDataLoading
          // ? Array.from({ length: 10 }).map((_, idx) => ({ id: `skeleton-${idx}` })) : templatesList?.data,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    muiTableBodyRowProps: { hover: false },
  }
 
    return (
        <div className="template-library-table-container">
            <DataTable
                tableProps={templateTableProps}
                isRowSelected={isRowSelected}
                muiTableStyleProps={{
                    height:'100%',
                    scrollbarWidth: 'none'
                }}
            />
            <PreviewModal
              previewModal={previewModal}
              onClose={() => setPreviewModal({status: false, data: null})}
              exportMenu={exportMenu}
              handleExportMenuClose={handleExportMenuClose}
              handleExportMenuOpen={handleExportMenuOpen}
            />
            <CommonModal
              open={deleteModal?.status}
              onConfirm={()=>handleDeleteTemplate()}
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
            </CommonModal>
        </div>
    )
}

export default LibraryTable;