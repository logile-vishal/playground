import Box from "@mui/material/Box";
import moment from "moment";

import SvgIcon from "@/core/components/icon/Icon";

import type { SortOption } from "../types/template-constants.type";
import type { PreviewButtonConfigProp } from "../types/template-preview.type";

export const TEMPLATE_LIST_PAGE_SIZE = 50;

export const TEMPLATE_SEARCH_TABS = {
    RECENT: {
        label: 'Recent',
        value: 'RECENT',
    },
    ADVANCE: {
        label: 'Advanced Search',
        value: 'ADVANCE',
    },
}

export const TEMPLATE_TASK_TYPE_OPTIONS = [
    { label: 'Select Task Type', value: '' },
    { label: 'Checklist', value: 'Checklist' },
    { label: 'Radio', value: 'Radio' },
];

export const TEMPLATE_STATUS_OPTIONS = [
    { label: 'All Status Selected', value: '' },
    { label: 'Assigned', value: 'Assigned' },
    { label: 'Not In Use', value: 'Not_In_Use' },
    { label: 'Incomplete', value: 'Not_Completed' },
];


export const TEMPLATE_SORTING: Record<string, SortOption[]> = {
    NAME: [
        {
            getLabel: () => (<Box display="flex" alignItems="center" fontSize="14px" fontWeight="400">Sort A <Box sx={{transform: `rotate(90deg)`, display:"inline-block"}} height="18px"><SvgIcon component="arrowUp" size={18}/></Box> Z</Box>),
            key: 'ASC',
            name: "templateName",
        },
        {
            getLabel: () => (<Box display="flex" alignItems="center"  fontSize="14px"  fontWeight="400">Sort Z <Box sx={{transform: `rotate(90deg)`, display:"inline-block"}} height="18px"><SvgIcon component="arrowUp" size={18}/></Box> A</Box>),
            key: 'DESC',
            name: "templateName",
        }
    ],
    CREATED: [
        {
            getLabel: () => (<Box>Sort Ascending</Box>),
            key: 'ASC',
            name: "createdTime",
        }, 
        {
            getLabel: () => (<Box>Sort Descending</Box>),
            key: 'DESC',
            name: "createdTime",
        }
    ],
    MODIFIED: [
         {
            getLabel: () => (<Box>Sort Ascending</Box>),
            key: 'ASC',
            name: "lastModifiedTime",
        }, 
        {
            getLabel: () => (<Box>Sort Descending</Box>),
            key: 'DESC',
            name: "lastModifiedTime",
        }
    ]

}

export const REPORT_SORTING: Record<string, SortOption[]> = {
    NAME: [
        {
            getLabel: () => (<Box display="flex" alignItems="center" fontSize="14px" fontWeight="400">Sort A <Box sx={{transform: `rotate(90deg)`, display:"inline-block"}} height="18px"><SvgIcon component="arrowUp" size={18}/></Box> Z</Box>),
            key: 'ASC',
            name: "name",
        },
        {
            getLabel: () => (<Box display="flex" alignItems="center"  fontSize="14px"  fontWeight="400">Sort Z <Box sx={{transform: `rotate(90deg)`, display:"inline-block"}} height="18px"><SvgIcon component="arrowUp" size={18}/></Box> A</Box>),
            key: 'DESC',
            name: "name",
        }
    ],
    SAVED_DATE: [
        {
            getLabel: () => (<Box>Sort Ascending</Box>),
            key: 'ASC',
            name: "savedDate",
        }, 
        {
            getLabel: () => (<Box>Sort Descending</Box>),
            key: 'DESC',
            name: "savedDate",
        }
    ],
}

export const TEMPLATE_TABLE_COLUMNS = {
    ICON_NAME: "iconName",
    TEMPLATE_NAME: "templateName",
    TAG_TYPE: "tagType",
    STATUS: "status",
    CREATED_TIME: "createdTime",
    LAST_MODIFIED_TIME: "lastModifiedTime",
    ACTIONS: "actions",
}

export const formatDate = (dateString: string): string => {
  return moment(dateString).format("DD/MM/YY");
};

export const LIB_TYPE = {
    TEMPLATE: "template",
    REPORT: "report",
}

export const TEMPLATE_TYPE = {
    CHECKLIST: 'CHECKLIST',
    FORM: 'FORM',
    GRID: 'GRID',
    SPREADSHEET: 'SPREADSHEET',
}

export const QUESTION_TYPES = {
  NUMERIC: { label: "Numeric", value: "Numeric" },
  DROPDOWN: { label: "Dropdown", value: "Dropdown" },
  RADIO_BUTTON: { label: "Radio Button", value: "Radio Button" },
  CHECKBOX: { label: "Checkbox", value: "Checkbox" },
  USER_INPUT: { label: "User Input", value: "User Input" },
  LONG_USER_INPUT: { label: "Long User Input", value: "Long User Input" },
  LABEL: { label: "Label", value: "Label" },
  REMINDER: { label: "Reminder", value: "Reminder" },
  TITLE: { label: "Title", value: "Title" },
  RESPONSE_TEMPLATE: { label: "Response Template", value: "Response Template" },
  DYNAMIC_DROPDOWN: { label: "Dynamic Dropdown", value: "Dynamic Dropdown" },
  UPC_BARCODE_SCAN: { label: "UPC Barcode Scan", value: "UPC Barcode Scan" },
};

export const USER_INPUT_TYPES = {
  DATE: { label: "Date", value: "Date" },
  DATE_AND_TIME: { label: "Date & Time", value: "Date & Time" }, 
}

export const QUESTION_ATTACHEMENT = {
  PHOTO: { label: "Photo", value: "Photo" },
  BARCODE: { label: "Barcode", value: "Barcode"},
  TEMPERATURE_PROBE: { label: "Temperature Probe", value: "Temperature Probe"},
  NUMERIC: { label: "Numeric", value: "Numeric"},
  ATTACHMENT: { label: "Attachment", value: "Attachment"},
};

export const PREVIEW_BUTTON_CONFIG: PreviewButtonConfigProp = {
    [QUESTION_ATTACHEMENT.PHOTO.value]: { 
        label: "Capture Photo", 
        icon: "scenary"
    },
    [QUESTION_ATTACHEMENT.TEMPERATURE_PROBE.value]: { 
        label: "Capture Temperature", 
        icon: "temperature"
    },
    [QUESTION_ATTACHEMENT.NUMERIC.value]: { 
        label: "Enter Value", 
        icon: "calculator"
    },
    [QUESTION_ATTACHEMENT.BARCODE.value]: { 
        label: "Scan Item", 
        icon: "scan"
    },
    [QUESTION_ATTACHEMENT.ATTACHMENT.value]: { 
        label: "Choose File", 
        icon: "attachment",
        type: "filetype",
    },
}

export const IMPORT_MODAL = {
    title: "Quick Import - Excel",
    description: "Select a .XSLX file to import",
    confirmBtnText: "Import",
    cancelBtnText: "Cancel",
}

export const DELETE_MODAL = {
    title: "Delete Template",
    description: "Do you want to permanently delete the selected template?",
    confirmBtnText: "Ok",
    cancelBtnText: "Cancel",
}

export const EXPORT_MODAL = {
    title: "Export",
    print: "Print",
    pdf: "PDF",
    excel: "Excel",
    csv: "CSV",
}

export const TEMPLATE_PREVIEW_GRID_HEADER = {
    title: "Content",
}

export const TEMPLATE_LIBRARY_HEADING = {
   createTemplate: "Create Template",
   folderTree: "Folder Tree",
   template: "Template",
   templateLibrary: "Template Library",
   searchTemplates: "Search by template name",
}

export const TEMPLATE_LIBRARY_NO_DATA = {
    title: "To view task templates, select a folder on the left or search above",
    description: "Nothing is selected",
    imageSrcName: "emptyState",
}

export const TEMPLATE_TABLE_DATA = {
    reportTask: "Report Task",
    active: "Active"
}