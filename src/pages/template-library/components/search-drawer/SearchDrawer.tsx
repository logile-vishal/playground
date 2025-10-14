import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import { Divider, TextField, Typography, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/core/components/icon/Icon';
import NoDataTemplate from '@/core/components/no-data-template/NoDataTemplate';
import StyledAutocomplete from '@/core/components/auto-complete/AutoComplete';

import { TEMPLATE_SEARCH_TABS, TEMPLATE_TASK_TYPE_OPTIONS, TEMPLATE_STATUS_OPTIONS } from '../../constants/constant';
import './SearchDrawer.scss';

const SearchField = styled(TextField)(( ) => ({
  "& input": {
        padding: "var(--space-m)",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "var(--radius-m)",
    fontWeight: "var(--weight-400)",
    height: "36px",
    backgroundColor: "var(--bg-container-1)",

    "& fieldset": {
      borderColor: "var(--border-secondary)",
    },
    "&:hover fieldset": {
      borderColor: "var(--border-brand-primary-subtle)",
    },
    "&:focus fieldset": {
      borderColor: "var(--border-brand-primary-subtle)",
    },
  },
}));

const StyledDropdownSelect = styled(Select)(()=>({
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border-brand-primary-subtle)"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border-brand-primary-subtle)"
    },
}))

const StyledMenuItem = styled(MenuItem)(( ) => ({
  "&" : {
      color: "var(--text-primary)",
      fontSize: "var(--size-body)",
    },
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
      borderBottomLeftRadius:"var(--radius-m)",
      borderBottomRightRadius: "var(--radius-m)",
    }
}))

const StyledTabs = styled(Tabs)(() => ({
    borderBottom: 'var(--border-s) solid var(--border-secondary)',
    minHeight: 'auto',
    '& .MuiButtonBase-root': {
        padding:"var(--space-m) var(--space-l)",
        minHeight:"auto",
        textTransform:'capitalize',
        fontSize:'var(--size-body)',
        fontWeight:'var(--weight-400)',
        color:'var(--text-primary)',
    },
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
            <Typography className='template-library-search-drawer__text-label'>{label}</Typography>
            <TextField className='template-library-search-drawer__text-field-input' fullWidth variant='outlined'/>
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
         <Typography className='template-library-search-drawer__text-label'>{label}</Typography>
         <StyledDropdownSelect
         className='template-library-search-drawer__dropdown-select'
         onChange={handleChange}
         defaultValue=""
         displayEmpty
         renderValue={(selected) => {
            if (!selected)
                return <span className='template-library-search-drawer__placeholder-text'>{placeholder}</span>;
            return options.find((opt) => opt.value === selected)?.label;
         }}
         IconComponent={()=> (
          <Box className="template-library-search-drawer__rotate-icon">
            <SvgIcon component='chevronLeft' size={18} fill='var(--icon-secondary)' />
          </Box>
          )}
        >
            {
               options && options.length > 0 && options.map((option) => (
                 <StyledMenuItem key={option.value} value={option.value}>{option.label}</StyledMenuItem>
               ))
            }
        </StyledDropdownSelect>
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
    const [recentData] = useState([]);
    const { t } = useTranslation();

    const handleTabChange = (_e: React.SyntheticEvent, newValue: string) => {
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
            <Box className="template-library-search-drawer">
                <Box className="template-library-search-drawer__header">
                    <Button 
                    className='template-library-search-drawer__back-btn' 
                    onClick={onClose} 
                    startIcon={
                        <SvgIcon component='chevronLeft' fill="var(--icon-secondary)" size="24px"/>
                        }>
                    </Button>
                     <SearchField
                        className="template-library-search-drawer__search-bar"
                        variant="outlined"
                        placeholder="Search by template name"
                        size="small"
                        fullWidth
                        value={searchText}
                        onChange={handleSearch}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" className='template-library-search-drawer__cursor-pointer' onClick={searchText?.length > 0 ? handleClearSearch : null} >
                                  <SvgIcon component={!searchText ||  searchText?.length == 0 ? "search": "close"} size={20} fill="var(--icon-secondary)" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Divider />
                <Box className="template-library-search-drawer__tab-container">
                    <StyledTabs onChange={handleTabChange} value={currentTab}>
                        <Tab label={RECENT.label} value={RECENT.value}/>
                        <Tab label={ADVANCE.label} value={ADVANCE.value} />
                    </StyledTabs>
                    <TabPanel value={currentTab === RECENT.value}>
                        <Box className="template-library-search-drawer__recent-tab-content">
                          {
                            !recentData || recentData?.length === 0 ? 
                            <NoDataTemplate
                              title ={t("NO_DATA_SEARCH.title")}
                              description={t("NO_DATA_SEARCH.description")}
                              imageSrcName = "emptyState"
                              imageWidth={90}
                          /> 
                            :
                            recentData?.map(()=>{
                              return (
                                <Box className="template-library-search-drawer__recent-search-main">
                                    <Box className="template-library-search-drawer__recent-search-item">
                                        <Box height="24px">
                                            <SvgIcon component='history' size={24} fill='var(--icon-secondary)' />
                                        </Box>
                                        <Box>
                                            <Typography className='template-library-search-drawer__template-name'>Bakery Cleaning <span className='template-code'>(TT-59141)</span></Typography>
                                            <Typography className='template-library-search-drawer__template-code'>EG &gt; 5S Audits &gt; 5S Simplicity Leads</Typography>
                                        </Box>
                                    </Box>
                                    <Typography className='template-library-search-drawer__template-code'>
                                        Last Modified: <span className='template-library-search-drawer__black-fg'>12/01/2022</span>
                                    </Typography>
                                </Box>
                              )
                            })
                          }
                        </Box>
                    </TabPanel>
                    <TabPanel value={currentTab === ADVANCE.value}>
                        <Box className="template-library-search-drawer__advance-tab-content">
                            <Box className="template-library-search-drawer__advance-search-group">
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
                            <Box className="template-library-search-drawer__advance-search-group">
                                <Box className="template-library-search-drawer__modified-wrapper">
                                    <Typography className='template-library-search-drawer__text-label'>Show tasks modified in last:</Typography>
                                    <Box>
                                        <TextField className='template-library-search-drawer__text-field-input template-library-search-drawer__days-text-field' fullWidth variant='outlined'/>
                                    </Box>
                                    <Typography className='template-library-search-drawer__text-label'>days</Typography>
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
                            <Box className="template-library-search-drawer__button-wrapper">
                                <Button className='template-library-search-drawer__clear-btn'>Clear All</Button>
                                <Button variant='contained' className='template-library-search-drawer__search-btn'>Search</Button>
                            </Box>
                        </Box>
                    </TabPanel>
                </Box>
            </Box>
        </StyledDrawer>
    )
}
export default SearchDrawer;