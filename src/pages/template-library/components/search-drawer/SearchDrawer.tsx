import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SvgIcon from '../../../../core/components/icon/Icon';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import './SearchDrawer.scss';
import { Divider, menuClasses, TextField, Typography, Select, MenuItem, menuItemClasses } from '@mui/material';
import { TEMPLATE_SEARCH_TABS, TEMPLATE_TASK_TYPE_OPTIONS, TEMPLATE_STATUS_OPTIONS } from '../../constants/constant';
import { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import StyledAutocomplete from '@/core/components/auto-complete/AutoComplete';

const SearchField = styled(TextField)(( ) => ({
  "& input": {
        padding: "var(--space-md)",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontWeight: "var(--weight-400)",
    height: "36px",
    backgroundColor: "var(--bg-container-1)",

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

const StyledMenuItem = styled(MenuItem)(( ) => ({
  "&:hover": {
    backgroundColor: "var(--bg-primary-x-subtle)",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "var(--bg-primary-x-subtle)", 
  },
  "&.Mui-selected": {
    backgroundColor: "var(--bg-primary-x-subtle)",
    "&:hover": {
      backgroundColor: "var(--bg-primary-x-subtle)", 
    },
  },
}))

interface TabPanelProps {
  children?: React.ReactNode;
  value: boolean;
}
const StyledDrawer = styled(Drawer)(() => ({
    '& .MuiDrawer-paper': {
      borderBottomLeftRadius:"8px",
      borderBottomRightRadius: "8px",
    }
}))

const StyledTabs = styled(Tabs)(() => ({
    borderBottom: '1px solid var(--border-secondary)',
    minHeight: 'auto',
    '& .MuiButtonBase-root': {
        padding:"10px 12px",
        minHeight:"auto",
        textTransform:'capitalize',
        fontSize:'15px',
        fontWeight:'var(--weight-400)',
        color:'var(--text-primary)',
    }
}));

function TabPanel(props: TabPanelProps) {
  const { children, value } = props;

  return (
    <div>
      {value && <Box>{children}</Box>}
    </div>
  );
}
function StyledTextField({label="", width="100%"}) {
    return (
      <Box width={width}>
            <Typography className='text-label'>{label}</Typography>
            <TextField className='text-field-input' fullWidth variant='outlined'/>
      </Box>
    )
}

interface DropdownOption {
  value: string | number;
  label: string;
}


interface StyledDropdownProps {
  label?: string;
  handleChange?: (event: SelectChangeEvent, child?: React.ReactNode) => void;
  value?: string | number;
  width?: string;
  options?: DropdownOption[];
  placeholder?: string;
}

function StyledDropdown ({
  label = "",
  handleChange = () => {},
  width = "100%",
  options = [],
  placeholder="",
}: StyledDropdownProps) {
    return (
      <Box width={width}>
         <Typography className='text-label'>{label}</Typography>
         <Select
         className='dropdown-select'
         onChange={handleChange}
         defaultValue=""
         displayEmpty
         renderValue={(selected) => {
            if (!selected)
                return <span style={{fontSize:"15px", fontWeight:400, color: "#888888" }}>{placeholder}</span>;
            return options.find((opt) => opt.value === selected)?.label;
         }}
         IconComponent={()=><Box sx={{transform: `rotate(-90deg)`}}><SvgIcon component='chevronLeft' size={18} fill='var(--icon-secondary)' /></Box>}
        >
            {
               options && options.length > 0 && options.map((option) => (
                 <StyledMenuItem key={option.value} value={option.value}>{option.label}</StyledMenuItem>
               ))
            }
        </Select>
      </Box>  
)}

interface SearchDrawerProps {
    open: boolean;
    onClose: () => void;
}

const SearchDrawer = ({
    open,
    onClose
}: SearchDrawerProps) => {
    const {RECENT, ADVANCE} = TEMPLATE_SEARCH_TABS;
    const [currentTab, setCurrentTab] = useState(RECENT.value);
    const [searchText, setSearchText] = useState("");
    const handleTabChange = (e: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    }
     const handleSearch = (e) => {
        setSearchText(e.target.value )
    }

    const handleClearSearch = () => {
        setSearchText("")
    }
    return (
        <StyledDrawer
           anchor='top'
           open={open}
           onClose={onClose}
        >
            <Box className="template-library-search-drawer-main">
                <Box display="flex" alignItems="center" padding="12px 12px 4px 12px">
                    <Button className='back-btn' onClick={onClose} startIcon={<SvgIcon component='chevronLeft' fill="var(--icon-secondary)" size="24px"/>}></Button>
                     <SearchField
                        className="search-bar"
                        variant="outlined"
                        placeholder="Search by template name"
                        size="small"
                        fullWidth
                        value={searchText}
                        onChange={handleSearch}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" sx={{cursor:'pointer'}} onClick={searchText?.length > 0 ? handleClearSearch : null} >
                                  <SvgIcon component={!searchText ||  searchText?.length == 0 ? "search": "close"} size={20} fill="var(--icon-secondary)" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Divider />
                <Box className="tab-container">
                    <StyledTabs onChange={handleTabChange} value={currentTab}>
                        <Tab label={RECENT.label} value={RECENT.value}/>
                        <Tab label={ADVANCE.label} value={ADVANCE.value} />
                    </StyledTabs>
                    <TabPanel value={currentTab === RECENT.value}>
                        <Box className="recent-tab-content">
                            <Box className="recent-search-main">
                                <Box className="recent-search-item">
                                    <Box height="24px">
                                        <SvgIcon component='history' size={24} fill='var(--icon-secondary)' />
                                    </Box>
                                    <Box>
                                        <Typography className='template-name'>Bakery Cleaning <span className='template-code'>(TT-59141)</span></Typography>
                                        <Typography className='template-code'>EG &gt; 5S Audits &gt; 5S Simplicity Leads</Typography>
                                    </Box>
                                </Box>
                                <Typography className='template-code'>
                                    Last Modified: <span className='black-fg'>12/01/2022</span>
                                </Typography>
                            </Box>

                             <Box className="recent-search-main">
                                <Box className="recent-search-item">
                                    <Box height="24px">
                                        <SvgIcon component='history' size={24} fill='var(--icon-secondary)' />
                                    </Box>
                                    <Box>
                                        <Typography className='template-name'>Bakery Annual Safety Training 2021 <span className='template-code'>(TT-59142)</span></Typography>
                                        <Typography className='template-code'>EG &gt; 5S Audits &gt; 5S Simplicity Leads</Typography>
                                    </Box>
                                </Box>
                                <Typography className='template-code'>
                                    Last Modified: <span className='black-fg'>11/29/2022</span>
                                </Typography>
                            </Box>

                             <Box className="recent-search-main">
                                <Box className="recent-search-item">
                                    <Box height="24px">
                                        <SvgIcon component='history' size={24} fill='var(--icon-secondary)' />
                                    </Box>
                                    <Box>
                                        <Typography className='template-name'>Bakery Annual Safety Training 2021 <span className='template-code'>(TT-59142)</span></Typography>
                                        <Typography className='template-code'>EG &gt; 5S Audits &gt; 5S Simplicity Leads</Typography>
                                    </Box>
                                </Box>
                                <Typography className='template-code'>
                                    Last Modified: <span className='black-fg'>11/29/2022</span>
                                </Typography>
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={currentTab === ADVANCE.value}>
                        <Box className="advance-tab-content">
                            <Box className="advance-search-group">
                                <StyledTextField
                                label='Question Text'
                                width="70%"
                                />

                                <StyledDropdown
                                label='Task Type'
                                width="15%"
                                options={TEMPLATE_TASK_TYPE_OPTIONS}
                                placeholder="Select Task Type"
                                />

                                 <StyledDropdown
                                label='Status'
                                width="15%"
                                options={TEMPLATE_STATUS_OPTIONS}
                                placeholder="Select Status"
                                />
                            </Box>
                            <Box className="advance-search-group">
                                <Box display="flex" alignItems="center" gap="8px" mt="25px">
                                    <Typography className='text-label'>Show tasks modified in last:</Typography>
                                    <Box>
                                        <TextField className='text-field-input days-text-field' fullWidth variant='outlined'/>
                                    </Box>
                                    <Typography className='text-label'>days</Typography>
                                </Box>

                                <StyledAutocomplete
                                options={TEMPLATE_STATUS_OPTIONS}
                                getOptionLabel={(option: DropdownOption) => option.label}
                                placeholder="Select Task Tags"
                                label='Task Tags'
                                />

                                <StyledAutocomplete
                                options={TEMPLATE_STATUS_OPTIONS}
                                getOptionLabel={(option: DropdownOption) => option.label}
                                placeholder="Search Question Tags"
                                label='Question Tags'
                                />
                            </Box>
                            <Box mt="25px" width="100%" display="flex" justifyContent="center" alignItems="center" gap="20px">
                                <Button className='clear-btn'>Clear All</Button>
                                <Button variant='contained' className='search-btn'>Search</Button>
                            </Box>
                        </Box>
                    </TabPanel>
                </Box>
            </Box>
        </StyledDrawer>
    )
}
export default SearchDrawer;