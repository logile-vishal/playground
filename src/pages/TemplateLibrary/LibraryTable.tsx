import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import type { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Table from "@/components/Table/Table";
import { demoTableData } from "./tableData";
import SvgIcon from "@/core/components/Icon";
import IconButton from '@/components/IconButton';
import { IconOutlined } from "@/components/Button/Button";
import CommonModal from "@/components/Modal/Modal";
import { renderPreviewPopupRow, renderPreviewHeading } from "@/pages/TemplateLibrary/components/PreviewType";
import { useGetViewPortSize } from "@/utils/getViewPortSize";
import "./style.scss";
import type { TemplateLibraryTableRowType } from "./types";
import type { MRT_Cell, MRT_Column } from "material-react-table";
import { formatDate } from "@/pages/TemplateLibrary/components/DateFormat";
import type { IconName } from "@/core/types/icon.type";
import { TEMPLATE_SORTING } from "../constant";
import type { SortOption } from "../types/constants.type";
import { renderTemplateActionSkelton, renderTemplateCreatedSkelton, renderTemplateIconSkelton, renderTemplateNameSkelton, renderTemplateNameSkeltonDesktop, renderTemplateRowSkelton } from "./components/Skeleton";

export type TemplateLibrary = {
  template_icon: string;
  template_name: string;
  type: string;
  status: string;
  created: string;
  last_modified: string;
};

type MenuState = {
    status: boolean;
    anchorEl: null | HTMLElement;
};

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
        fontWeight: 400,
        color: '#333333',
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


type LibraryTableProps = {
  showCheckbox: boolean;
  setShowCheckbox: (value: boolean) => void;
  selectedTemplate: TemplateLibraryTableRowType[];
  setSelectedTemplate: (value: TemplateLibraryTableRowType[]) => void;
  hoveredRowId?: string | null;
  setHoveredRowId?: (value: string | null) => void;
};

const LibraryTable: React.FC<LibraryTableProps> = ({
  showCheckbox,
  setShowCheckbox,
  selectedTemplate,
  setSelectedTemplate,
  selectedDirectoryData=[],
  loading,
}) => {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
    const [tableActionMenu, setTableActionMenu] = useState<Record<"name" | "created" | "modified", MenuState>>({
        name: { status: false, anchorEl: null },
        created: { status: false, anchorEl: null },
        modified: { status: false, anchorEl: null },
    });
    const [previewModal, setPreviewModal] = useState<{status: boolean, data: TemplateLibraryTableRowType | null}>({status: false, data: null});
    const [tooltipId, setTooltipId] = useState<number | null>(null);
    const [selectedSort, setSelectedSort] = useState<{[key in keyof typeof tableActionMenu]: string | null}>({
      name: null,
      created: null,
      modified: null,
    });
    const viewportSize = useGetViewPortSize();
    const isDesktop = viewportSize === 'xl' || viewportSize === 'lg';

    const handleRowSelection = (checked:boolean, rowData: TemplateLibraryTableRowType) => {
      let copyRowData = [...selectedTemplate];
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

    const isRowSelected = (rowData: TemplateLibraryTableRowType) => {
      return selectedTemplate?.some((item) => item?.templateId === rowData?.templateId);
    }
    

    /**
     * Checks if all rows are selected. if yes, it clears the selection; otherwise, it selects all rows.
     * @returns void
    */
    const handleSelectAllRows = () => {
      const isAllRowsSelected = selectedTemplate.length === selectedDirectoryData.length;
      if(!isAllRowsSelected) {
        setSelectedTemplate(selectedDirectoryData);
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

    const handleSortSelect = (type: keyof typeof tableActionMenu, item: string) => {
      const newObj:unknown = {}
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

    const handlePreviewModalOpen = (cellData: TemplateLibraryTableRowType) => {
      setPreviewModal({status: true, data: cellData});
    }

    const renderHeaderWithMenu = (column: MRT_Column<TemplateLibraryTableRowType>, type: keyof typeof tableActionMenu, menuItems: SortOption[]) => {
      const selected = selectedSort[type];
      const isAscending = selected?.key === "ASCENDING";

      return (
        <Box display="flex" alignItems="center" gap="4px">
          <Box>{column.columnDef.header}</Box>

          {selected ? <Box className="cursor-pointer" height="20px">
            {isAscending ? <SvgIcon component="arrowDown" size={20} fill="#5C5C5C" /> :
              <SvgIcon component="arrowUp" size={20} fill="#5C5C5C" />}
          </Box>: <Box ></Box>}

          <Box
            height="20px"
            className="cursor-pointer"
            onClick={(e) => handleMenuClick(e, type)}
          >
            {tableActionMenu[type].status ? (
              <SvgIcon component="arrowUpFill" size={20} fill="#5C5C5C" />
            ) : (
              <SvgIcon component="arrowDownFill" size={20} fill="#5C5C5C" />
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
                    color: isSelected ? "#0A68DB" : "#333333",
                    fontWeight: isSelected ? 500 : 400,
                    "&:hover": { backgroundColor: "transparent" },
                    "&.Mui-selected": {
                      backgroundColor: "transparent",
                      color: "#0A68DB",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" width="100%" color={isSelected ? "#0A68DB" : "#333333"} justifyContent="space-between">
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

const renderTemplateNameHeader = ({ column }: { column: MRT_Column<TemplateLibraryTableRowType> }) => renderHeaderWithMenu(column, "name", TEMPLATE_SORTING.NAME);
const renderTemplateCreatedHeader = ({ column }: { column: MRT_Column<TemplateLibraryTableRowType> }) => renderHeaderWithMenu(column, "created", TEMPLATE_SORTING.CREATED);
const renderTemplateModifiedHeader = ({ column }: { column: MRT_Column<TemplateLibraryTableRowType> }) => renderHeaderWithMenu(column, "modified", TEMPLATE_SORTING.MODIFIED);

    const renderTemplateIconHeader = () => {
      return <Box className="template-checkbox-container icon-header-container" >
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
                      color: '#5C5C5C',
                    '&.Mui-checked': {
                      color: '#0A68DB',
                    },
                    '&.MuiFormControlLabel-root': {
                      padding: '0px 10px'
                    }
                  }}
                  checked={selectedTemplate.length == selectedDirectoryData.length}
                  indeterminate={selectedTemplate.length > 0 && showCheckbox && selectedTemplate.length !== selectedDirectoryData.length ? true : false }
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

    const renderTemplateIconCell = ({cell }: {cell: MRT_Cell<TemplateLibraryTableRowType>}) => {
        const data = cell.row?.original;
        const isTableSelectable = selectedTemplate.length > 0 ;
        return <>
              {!isTableSelectable && <Box className="template-checkbox-container tablebody-col__checkbox--toggle" display='flex' 
                >
                    <Box onClick={() => handleRowSelection(true, cell.row.original)} className="cursor-pointer icon-container" >
                      <IconOutlined sx={{ pointerEvents: 'none' }} startIcon={
                        data?.iconName === "v15-Shop-supply" ?
                        <SvgIcon 
                            component="checkedList"
                            size={18}
                            fill="#0A68DB"
                            style={{ pointerEvents: 'none' }}
                         /> :
                        <SvgIcon 
                            component="checkedDoc"
                            size={18}
                            fill="#009B00"
                         />
                        }
                        variant='outlined'
                      />
                    </Box>
                    <FormControlLabel
                      className="form-control-label checkbox-wrapper"
                      onChange={(event) => handleRowSelection((event.target as HTMLInputElement).checked, cell.row.original)}
                        control={
                            <Checkbox
                              size="small"
                              checked={isRowSelected(cell.row.original)}
                              sx={{
                                '& .MuiSvgIcon-root': { fontSize: 20 },
                                  color: '#5C5C5C',
                                '&.Mui-checked': {
                                    color: '#0A68DB',
                                  },
                                }}
                            />
                        }
                      label=""
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
                                  color: '#5C5C5C',
                                '&.Mui-checked': {
                                    color: '#0A68DB',
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

    const renderTemplateNameCell = ({cell}: {cell: MRT_Cell<TemplateLibraryTableRowType>}) => {
        const data = cell.row?.original;
        return (
               <Box minWidth="300px" display="flex" alignItems="center" gap="10px">
                   <Box display="flex" flexDirection="column" gap="6px">
                        <Box className="template-body-text cursor-pointer" onClick={()=>handlePreviewModalOpen(data)}>{data?.templateName || data?.name || ""}</Box>
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

    const renderTemplateStatusCell = ({cell}: {cell: MRT_Cell<TemplateLibraryTableRowType>}) => {
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

     const renderTemplateTypeCell = ({cell}: {cell: MRT_Cell<TemplateLibraryTableRowType>}) => {
      const data = cell.row?.original;
      return (
          <Box display='flex' gap='2px'>{data?.type || "Checklist"}</Box> 
      )
    }

    const renderTemplateCreatedCell = ({cell}: {cell: MRT_Cell<TemplateLibraryTableRowType>}) => {
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
                    <SvgIcon component="infoCircle" size={18} fill="#5C5C5C" />
                  </Box>
                </Tooltip>
              </Box>
            )
    }

    const renderTemplateModifiedCell = ({cell}: {cell: MRT_Cell<TemplateLibraryTableRowType>}) => {
      const templateData = cell.row.original;
      return (
            <Box display="flex" gap="4px" alignItems='center'>
              <Box>{formatDate(templateData?.lastModifiedTime)}</Box>
            </Box>
            )
    }

    const renderActionsCell = ({cell}: {cell: MRT_Cell<TemplateLibraryTableRowType>}) => {
      const status = cell.row.original?.status;
      const disabledActions = selectedTemplate?.length > 1;
        return (
            <Box display="flex" alignItems="center">
              <IconButton disabled={(disabledActions || status === "Incomplete") ? true : false} disableHover><SvgIcon component="send" size={20} /></IconButton>
              <IconButton disabled={disabledActions} disableHover><SvgIcon component="copy" size={20} /></IconButton>
              <IconButton disabled={disabledActions} disableHover><SvgIcon component="edit" size={20} /></IconButton>
              <IconButton disabled={disabledActions} disableHover><SvgIcon component="download" size={20} /></IconButton>
              <IconButton disabled={disabledActions} disableHover><SvgIcon component="delete" size={20} fill={disabledActions ? "#FFCCC8" : "#F4433D"}/></IconButton>
            </Box>
        )
    }

    const [columnVisibility, setColumnVisibility] = useState({});
    const columns = [
      {
        order:0,
        accessorKey: "iconName",
        header: "",
        hide:false,
        size:1,
        Header: renderTemplateIconHeader,
        Cell: (loading?.templates || loading?.reports ) ? renderTemplateIconSkelton : renderTemplateIconCell,
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
        Cell: (loading?.templates || loading?.reports ) ? isDesktop ? renderTemplateNameSkeltonDesktop : renderTemplateNameSkelton : renderTemplateNameCell,
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
        Cell: (loading?.templates || loading?.reports ) ? renderTemplateRowSkelton : renderTemplateTypeCell,
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
        Cell: (loading?.templates || loading?.reports ) ? renderTemplateRowSkelton : renderTemplateStatusCell,
        muiTableHeadCellProps: () => ({className: "template-head-text", style:{width:"200px", padding:"1rem 0.8rem"} }),
        muiTableBodyCellProps: () => ({className: "template-body-text" })
      },{
        order:4,
        accessorKey: "createdTime",
        header: "Created",
        hide:false,
        size:1,
        Header: renderTemplateCreatedHeader,
        Cell: (loading?.templates || loading?.reports ) ? renderTemplateCreatedSkelton : renderTemplateCreatedCell,
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
        Cell: (loading?.templates || loading?.reports ) ? renderTemplateRowSkelton : renderTemplateModifiedCell,
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
        Cell: (loading?.templates || loading?.reports ) ? renderTemplateActionSkelton : renderActionsCell,
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
    data: (loading?.templates || loading?.reports ) 
          ? Array.from({ length: 10 }).map((_, idx) => ({ id: `skeleton-${idx}` })) : selectedDirectoryData,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    muiTableBodyRowProps: { hover: false },
    muiTableContainerProps:() => ({className: "template-table-main" }),
  }

    return (
        <div className="template-library-table-container">
            <Table 
                tableProps={templateTableProps}
                isRowSelected={isRowSelected}
                
            />

           {/* Template Preview Popup */}
            <CommonModal
              open={previewModal.status}
              onClose={() => setPreviewModal({status: false, data: null})}
              title={renderPreviewHeading({
                  heading: `${previewModal?.data?.templateName || ""}`,
                  btn1visible: true, 
                  btn1Name: "upload", 
                  btn2visible: true, 
                  btn2Name: "moreOption"
                })
              }
              showActions={false}
            >
              <Box sx={{ borderRadius: "8px", border: "1px solid #DCDCDC"}}>
                <Box sx={{ padding: "16px", backgroundColor: "#F4F5FA", display: "flex", gap: "10px", fontWeight: "500"}}>
                  <Box width="70%">Question</Box>
                  <Box width="30%" ml="30px">Answer</Box>
                </Box>
                {renderPreviewPopupRow({
                  index: "1",
                  text: "Acknowledge that you have reviewed the alert.",
                  type: "",
                  answer: "Confirmed",
                  mandatory: true
                })}
                {renderPreviewPopupRow({
                  index: "2",
                  text: "Select cause",
                  type: "Dropdown",
                  answer: "Select a cause",
                  mandatory: true
                })}
                {renderPreviewPopupRow({
                  index: "3",
                  text: "Select corrective actions",
                  type: "Dropdown",
                  answer: "Select actions",
                  mandatory: true
                })}
                {renderPreviewPopupRow({
                  index: "4",
                  text: "Comments",
                  type: "Multiline-Textfield",
                  answer: "Comments",
                  mandatory: true
                })}
              </Box>
            </CommonModal>
        </div>
    )
}

export default LibraryTable;
