import type { TemplateType } from "@/pages/template-library/types/template-library.type";
import type { SxProps, Theme } from "@mui/material";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import type { MRT_RowData, MRT_Row } from "material-react-table";
 
interface TableProps {
  tableProps;
  isRowSelected?: (rowData: TemplateType) => boolean;
  muiTableStyleProps?: SxProps<Theme>
}
 
const Table = ({ tableProps, isRowSelected,muiTableStyleProps, ...props }: TableProps) => {
  const table = useMaterialReactTable({
    ...tableProps,
    enableStickyHeader:true,
    muiTableContainerProps:{
      sx:{
       
        '& .MuiTableHead-root':{
              backgroundColor:'var(--bg-table-header)',
        },
        '& tbody':{
          bgcolor:"var(--bg-table-row)"
        },
        '& th':{
          backgroundColor:'var(--bg-table-header)'
        },
        '& td':{
            color: 'var(--text-primary)'
        },
        ...(muiTableStyleProps && muiTableStyleProps)
      }
    },
    muiTableBodyRowProps: ({ row }: { row: MRT_Row<MRT_RowData> }) => ({
      hover: isRowSelected && isRowSelected(row.original as TemplateType) ? false : true,
      sx: {
        
        backgroundColor: isRowSelected && isRowSelected(row.original as TemplateType) ? "var(--bg-primary-x-subtle)" : "inherit",
        transition: "backgroundColor 1s",
      },
    }),
  });
  return <MaterialReactTable table={table} {...props} />;
};
 
export default Table;