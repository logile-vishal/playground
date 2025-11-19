import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import { Divider, TextField, Typography, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

import { CommonButton } from '@/core/components/button/button';
import StyledAutocomplete from '@/core/components/auto-complete/AutoComplete';
import NoDataTemplate from '@/core/components/no-data-template/NoDataTemplate';
import type { PaginatedResponse } from '@/core/types/pagination.type';
import type { AutoCompleteOptionProps } from '@/core/types/autocomplete.type';
import SvgIcon from '@/core/components/icon/Icon';

import { useFilterTemplates, useGetQuestionTagsOptions, useGetTaskTagsOptions, useGetTaskTypesOptions } from '../../services/template-library-api-hooks';
import type { ReportType, TagOptionsType, TaskTypeOptions, TemplatePaginationData } from '../../types/template-library.type';
import { TEMPLATE_LIBRARY_HEADING, TEMPLATE_SEARCH_TABS, TEMPLATE_STATUS_OPTIONS } from '../../constants/constant';
import type { TemplateType } from '../../types/template-preview.type';
import './SearchDrawer.scss';
import { ChevronLeft, Search, Close, EmptyState, History } from '@/core/constants/icons';


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
function StyledTextField({label="", width="100%", value, handleChange}) {
    return (
      <Box width={width}>
            <Typography className='template-library-search-drawer__text-label'>{label}</Typography>
            <TextField value={value} onChange={handleChange} className='template-library-search-drawer__text-field-input' fullWidth variant='outlined' autoComplete='off' />
      </Box>
    )
}

interface StyledDropdownProps {
  label?: string;
  handleChange?: (event: SelectChangeEvent, child?: React.ReactNode) => void;
  value?: string[] | number[] | string | number;
  width?: string;
  options?: AutoCompleteOptionProps[];
  placeholder?: string;
}

function StyledDropdown ({
  label = "",
  handleChange = () => {},
  width = "100%",
  options,
  placeholder="",
  ...props
}: StyledDropdownProps) {
    return (
      <Box width={width}>
         <Typography className='template-library-search-drawer__text-label'>{label}</Typography>
         <StyledDropdownSelect
         className='template-library-search-drawer__dropdown-select'
         onChange={handleChange}
         MenuProps={{
          classes: { paper: "template-library-search-drawer__dropdown-menu-paper" },
        }}
        {...props}
        renderValue={(selected) => {
            if (!selected)
                return <span className='template-library-search-drawer__placeholder-text'>{placeholder}</span>;
            return options?.find((opt) => opt?.value === selected)?.label;
         }}
         IconComponent={()=> (
          <Box className="template-library-search-drawer__rotate-icon">
            <SvgIcon component={ChevronLeft} size={18} color='secondary' />
          </Box>
          )}
        >
            {
               options && options.length > 0 && options.map((option) => (
                 <StyledMenuItem key={option?.label} value={option?.value}>{option?.label}</StyledMenuItem>
               ))
            }
        </StyledDropdownSelect>
      </Box>  
)}


interface SearchDrawerProps {
    open: boolean;
    onClose: () => void;
    paginationData: TemplatePaginationData;
    setTableData?: (value: PaginatedResponse<TemplateType | ReportType>) => void;
    setIsTableDataLoading: (value: boolean) => void;
    searchText: string;
    setSearchText: (value: string) => void;
}

const defaultFilter = {
        questionText: "",
        taskType: "",
        status: [],
        modifiedInLast: "",
        taskTagsList: [] as AutoCompleteOptionProps[],
        questionTagsList: [] as AutoCompleteOptionProps[],
}

const SearchDrawer = ({
    open,
    onClose,
    paginationData,
    setTableData,
    setIsTableDataLoading,
    searchText,
    setSearchText
}: SearchDrawerProps) => {
    const {RECENT, ADVANCE} = TEMPLATE_SEARCH_TABS;
    const [currentTab, setCurrentTab] = useState(ADVANCE.value);
    const [recentFilterData] = useState([]);
    const [advanceFilterData, setAdvanceFilterData] = useState(defaultFilter);
    const [optionsData, setOptionsData] = useState({
        taskTypeOptions: [] as { label: string; value: number; }[],
        taskTagsOptions: [] as { label: string; value: number; }[],
        questionTagsOptions: [] as { label: string; value: number; }[],
    });
    const { t } = useTranslation();
    const {data: taskTypeOptions} = useGetTaskTypesOptions();
    const {data: taskTagsOptions} = useGetTaskTagsOptions();
    const {data: questionTagsOptions} = useGetQuestionTagsOptions();
    const {data: filterData, mutateAsync: filterTemplate, isPending: isFilterDataLoading } = useFilterTemplates();
    
    const handleTabChange = (_e: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    }

    /**
      * @method handleClearSearch
      * @description handler for template search text
      * @returns {void}
    */
     const handleSearch = (e) => {
        setSearchText(e.target.value )
    }

     /**
      * @method handleClearSearch
      * @description clear the template search text
      * @returns {void}
    */
    const handleClearSearch = () => {
        setSearchText("")
    }

    const handleFilter= () => {
      const payload = getPayload();
      filterTemplate(payload);
    }

    /**
      * @method handleChange
      * @description common handler for the various fields
      * @returns {void}
    */
    const handleChange = (field: string, event) => {
      const value = event?.target ? event.target.value : (event?.value || event);
        setAdvanceFilterData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    /**
      * @method getPayload
      * @description structure and get all the required payloads
      * @returns {void}
    */
    const getPayload = () => {
      const questionTagsList = advanceFilterData?.questionTagsList?.map((tag: AutoCompleteOptionProps)=>tag?.value)
      const taskTagsList = advanceFilterData?.taskTagsList?.map((tag: AutoCompleteOptionProps)=>tag?.value)
      const payload = {
        ...advanceFilterData,
        ...paginationData,
        questionTagsList,
        taskTagsList: taskTagsList,
        templateName: searchText,
      }
      return payload;
    }

    /**
      * @method handleClearFilter
      * @description clear and reset all the filters
      * @returns {void}
    */
    const handleClearFilter = () => {
        setAdvanceFilterData(JSON.parse(JSON.stringify(defaultFilter)));
        setSearchText("");
    }

    useEffect(()=>{
        const data = taskTypeOptions?.data?.map((item: TaskTypeOptions) => ({
                label: item?.typeName,
                value: item?.typeId,
            }));
        setOptionsData(prev=>({...prev, taskTypeOptions: data}));
    },[taskTypeOptions]);

    useEffect(()=>{
        const data = taskTagsOptions?.data?.map((item: TagOptionsType) => ({
                label: item?.tagValue,
                value: item?.tagId,
            }));
        setOptionsData(prev=>({...prev, taskTagsOptions: data}));
    },[taskTagsOptions]);

    useEffect(()=>{
        const data = questionTagsOptions?.data?.map((item: TagOptionsType) => ({
                label: item?.tagValue,
                value: item?.tagId,
            }));
        setOptionsData(prev=>({...prev, questionTagsOptions: data}));
    },[questionTagsOptions]);

    useEffect(()=>{
      setTableData?.(filterData);
    },[filterData, setTableData])

    useEffect(()=>{
      onClose();
      setIsTableDataLoading(isFilterDataLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isFilterDataLoading])

    return (
        <StyledDrawer
           anchor='top'
           open={open}
           onClose={onClose}
           elevation={0}
        >
            <Box className="template-library-search-drawer">
                <Box className="template-library-search-drawer__header">
                    <Button 
                    className='template-library-search-drawer__back-btn' 
                    onClick={onClose} 
                    startIcon={
                        <SvgIcon component={ChevronLeft} color="secondary" size="24px"/>
                        }>
                    </Button>
                     <SearchField
                        className="template-library-search-drawer__search-bar"
                        variant="outlined"
                        placeholder={TEMPLATE_LIBRARY_HEADING.searchTemplates}
                        size="small"
                        autoComplete="off"
                        fullWidth
                        value={searchText}
                        onChange={handleSearch}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" className='template-library-search-drawer__cursor-pointer' onClick={searchText?.length > 0 ? handleClearSearch : null} >
                                  <SvgIcon component={!searchText ||  searchText?.length == 0 ? Search: Close} size={20} color="secondary" />
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
                            !recentFilterData || recentFilterData?.length === 0 ? 
                            <NoDataTemplate
                              title ={t("NO_DATA_SEARCH.title")}
                              description={t("NO_DATA_SEARCH.description")}
                              imageSrcName = {EmptyState}
                              imageWidth={90}
                          /> 
                            :
                            recentFilterData?.map(()=>{
                              return (
                                <Box className="template-library-search-drawer__recent-search-main">
                                    <Box className="template-library-search-drawer__recent-search-item">
                                        <Box height="24px">
                                            <SvgIcon component={History} size={24} color='secondary' />
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
                                handleChange={(event) => handleChange('questionText', event)}
                                value={advanceFilterData?.questionText}
                                />

                                <StyledDropdown
                                label='Task Type'
                                width="15%"
                                options={optionsData?.taskTypeOptions}
                                placeholder="Select Task Type"
                                handleChange={(event) => handleChange('taskType', event)}
                                value={advanceFilterData?.taskType}
                                />

                                <StyledDropdown
                                label='Status'
                                width="15%"
                                options={TEMPLATE_STATUS_OPTIONS}
                                placeholder="Select Status"
                                handleChange={(event) => handleChange('status', event)}
                                value={advanceFilterData?.status}
                                />
                            </Box>
                            <Box className="template-library-search-drawer__advance-search-group">
                                <Box className="template-library-search-drawer__modified-wrapper">
                                    <Typography className='template-library-search-drawer__text-label'>Show tasks modified in last:</Typography>
                                    <Box>
                                        <TextField 
                                        onChange={(event) => handleChange('modifiedInLast', event)} 
                                        className='template-library-search-drawer__text-field-input template-library-search-drawer__days-text-field' 
                                        fullWidth 
                                        autoComplete="off"
                                        variant="outlined"
                                        value={advanceFilterData?.modifiedInLast}
                                        />
                                    </Box>
                                    <Typography className='template-library-search-drawer__text-label'>days</Typography>
                                </Box>

                                <StyledAutocomplete
                                options={optionsData?.taskTagsOptions}
                                placeholder="Select Task Tags"
                                label='Task Tags'
                                value={advanceFilterData?.taskTagsList}
                                handleChange={(value) => handleChange('taskTagsList', value)}
                                />

                                <StyledAutocomplete
                                options={optionsData?.questionTagsOptions}
                                placeholder="Search Question Tags"
                                label='Question Tags'
                                value={advanceFilterData?.questionTagsList}
                                handleChange={(value) => handleChange('questionTagsList', value)}
                                />
                            </Box>
                            <Box className="template-library-search-drawer__button-wrapper">
                                <CommonButton severity="primary" variant="text" size="large" onClick={handleClearFilter}>Clear All</CommonButton>
                                <CommonButton severity="primary" variant="solid" size="large" onClick={handleFilter}>{isFilterDataLoading ? "Loading..." : "Search"}</CommonButton>
                            </Box>
                        </Box>
                    </TabPanel>
                </Box>
            </Box>
        </StyledDrawer>
    )
}
export default SearchDrawer;