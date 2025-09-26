import SvgIcon from "@/core/components/icon/Icon";
import Box from "@mui/material/Box";
import moment from "moment";
import type { SortOption } from "../types/template-constants.type";

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
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Archived', value: 'ARCHIVED' },
];


export const TEMPLATE_SORTING: Record<string, SortOption[]> = {
    NAME: [
        {
            getLabel: () => (<Box display="flex" alignItems="center" fontSize="14px" fontWeight="400">Sort A <Box sx={{transform: `rotate(90deg)`, display:"inline-block"}} height="18px"><SvgIcon component="arrowUp" size={18}/></Box> Z</Box>),
            key: 'ASCENDING',
        },
        {
            getLabel: () => (<Box display="flex" alignItems="center"  fontSize="14px"  fontWeight="400">Sort Z <Box sx={{transform: `rotate(90deg)`, display:"inline-block"}} height="18px"><SvgIcon component="arrowUp" size={18}/></Box> A</Box>),
            key: 'DESCENDING',
        }
    ],
    CREATED: [
        {
            getLabel: () => (<Box>Sort Ascending</Box>),
            key: 'ASCENDING',
        }, 
        {
            getLabel: () => (<Box>Sort Descending</Box>),
            key: 'DESCENDING',
        }
    ],
    MODIFIED: [
         {
            getLabel: () => (<Box>Sort Ascending</Box>),
            key: 'ASCENDING',
        }, 
        {
            getLabel: () => (<Box>Sort Descending</Box>),
            key: 'DESCENDING',
        }
    ]

}


export const formatDate = (dateString: string): string => {
  return moment(dateString).format("DD/MM/YY");
};
