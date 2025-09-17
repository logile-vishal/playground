import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SvgIcon from '../core/components/Icon';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import './style.scss';
import { Divider, TextField, Typography } from '@mui/material';
import { TEMPLATE_SEARCH_TABS, TEMPLATE_TASK_TYPE_OPTIONS, TEMPLATE_STATUS_OPTIONS } from './constant';
import { useState } from 'react';
import { PrimaryButton } from '../components/Button/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import StyledAutocomplete from '../components/Autocomplete/Autocomplete';

const SearchField = styled(TextField)(( ) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontWeight: "400",
    "& fieldset": {
      border: "1px solid lightgray",
    },
    "&:hover fieldset": {
      border: "1px solid lightgray",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid gray",
    },
  },
}));

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
    borderBottom: '1px solid #DCDCDC',
    minHeight: 'auto',
    '& .MuiButtonBase-root': {
        padding:"4px 12px",
        minHeight:"auto",
        textTransform:'capitalize',
        fontSize:'15px',
        fontWeight:400,
        color:'#5C5C5C',
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
}

function StyledDropdown ({
  label = "",
  handleChange = () => {},
  width = "100%",
  options = []
}: StyledDropdownProps) {
    return (
      <Box width={width}>
         <Typography className='text-label'>{label}</Typography>
         <Select
         className='dropdown-select'
         onChange={handleChange}
         IconComponent={()=><Box sx={{transform: `rotate(-90deg)`}}><SvgIcon component='chevronLeft' size={18} fill='#5C5C5C' /></Box>}
        >
            {
               options && options.length > 0 && options.map((option) => (
                 <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
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
    const handleTabChange = (e: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    }
    return (
        <StyledDrawer
           anchor='top'
           open={open}
           onClose={onClose}
        >
            <Box className="template-library-search-drawer-main">
                <Box display="flex" alignItems="center" padding="12px 12px 4px 12px">
                    <Button className='back-btn' startIcon={<SvgIcon component='chevronLeft' fill='#000' size="24px"/>}></Button>
                     <SearchField
                        className="search-bar"
                        variant="outlined"
                        placeholder="Search by template name"
                        size="small"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                  <SvgIcon component="search" size={20} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Divider color='#DCDCDC'/>
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
                                        <SvgIcon component='history' size={24} fill='#5C5C5C' />
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
                                        <SvgIcon component='history' size={24} fill='#5C5C5C' />
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
                                        <SvgIcon component='history' size={24} fill='#5C5C5C' />
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
                                />

                                 <StyledDropdown
                                label='Status'
                                width="15%"
                                options={TEMPLATE_STATUS_OPTIONS}
                                />
                            </Box>
                            <Box className="advance-search-group">
                                <Box display="flex" alignItems="center" gap="8px" mt="25px">
                                    <Typography className='text-label'>Show tasks modified in last:</Typography>
                                    <Box>
                                        <TextField type='number' className='text-field-input days-text-field' fullWidth variant='outlined'/>
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
                                <PrimaryButton className='search-btn'>Search</PrimaryButton>
                            </Box>
                        </Box>
                    </TabPanel>
                </Box>
            </Box>
        </StyledDrawer>
    )
}
export default SearchDrawer;