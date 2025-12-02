import React, { useEffect, useRef, useState } from "react";
import { Box, InputAdornment, MenuItem, Select, TextField } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import { ChevronDown, Search } from "@/core/constants/icons";
import SvgIcon from "@/core/components/icon/Icon";
import type { SharedDropdownProps, SharedTextAreaProps, SharedTextFieldProps } from "@/core/types/form-elements.type";
import clsx from "@/utils/clsx";

import "./FormElements.scss";


/**
 * @method SharedTextField
 * @description Renders a customizable text field component with label and optional required indicator
 * @param {string} label - The label text for the text field
 * @param {string} width - Width of the text field (default: "200px")
 * @param {boolean} isRequired - Whether the field is required (default: false)
 * @param {SharedTextFieldProps} props - Additional props passed to the TextField component
 * @return {React.ReactNode} A text field component with label
 */
export const SharedTextField: React.FC<SharedTextFieldProps> = ({ label, width, isRequired = false, ...props }) => {
  const inputId = useRef(uuidv4()).current;
  return (
    <Box className="shared-textfield">
      <label htmlFor={inputId} className={clsx({"shared-textfield__label": true, "shared-textfield__label--required": isRequired})}>{label}</label>
      <TextField
        id={inputId}
        size="small"
        className="shared-textfield__input-field"
        sx={{ width: width ? `${width}px` : "100%" }}
        {...props}
      />
    </Box>
  );
};


/**
 * @method SharedTextArea
 * @description Renders a multiline text area component with label and configurable rows
 * @param {string} label - The label text for the text area
 * @param {string} placeholder - Placeholder text for the text area
 * @param {number} rows - Number of rows for the text area (default: 1)
 * @param {string} width - Width of the text area (default: "200px")
 * @param {boolean} isRequired - Whether the field is required (default: false)
 * @param {SharedTextAreaProps} props - Additional props passed to the TextField component
 * @return {React.ReactNode} A multiline text area component with label
 */
export const SharedTextArea: React.FC<SharedTextAreaProps> = ({ label, rows = 1, width, isRequired = false, ...props }) => {
  const inputId = useRef(uuidv4()).current;
  return (
    <Box className="shared-textfield">
      <label htmlFor={inputId} className={clsx({"shared-textfield__label": true, "shared-textfield__label--required": isRequired})}>{label}</label>
      <TextField
        id={inputId}
        size="small"
        className="shared-textfield__input-field"
        multiline={true}
        sx={{ width: width ? `${width}px` : "100%" }}
        rows={rows}
        {...props}
      />
    </Box>
  );
};


/**
 * @method SharedDropdown
 * @description Renders a searchable dropdown component with filtering capabilities and custom placeholder
 * @param {string} label - The label text for the dropdown
 * @param {boolean} isRequired - Whether the field is required (default: false)
 * @param {string} value - Currently selected value
 * @param {Array} options - Array of option objects with label and value properties
 * @param {string} width - Width of the dropdown
 * @param {string} placeholder - Placeholder text when no option is selected (default: "Select Option")
 * @param {string} menuClassName - Additional CSS class for the dropdown menu
 * @param {SharedDropdownProps} props - Additional props passed to the Select component
 * @return {React.ReactNode} A searchable dropdown component with label
 */
export const SharedDropdown: React.FC<SharedDropdownProps> = ({
  label = "",
  isRequired = false,
  value = "",
  options,
  width,
  placeholder = "Select Option",
  menuClassName,
  ...props
}) => {
  const [optionsList, setOptionsList] = useState([]);
  const [search, setSearch] = useState("");
  const inputId = useRef(uuidv4()).current;

  /**
   * @method handleFilter
   * @description Handles the search input change to filter dropdown options
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
   * @return {void}
   */
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  useEffect(() => {
    const filteredOptions = options?.filter((option) => {
      return option?.label?.toLowerCase()?.includes(search?.toLowerCase())
    })
    setOptionsList(filteredOptions)
  }, [search, options])

  return (
    <Box className="shared-dropdown">
      <label htmlFor={inputId} className={clsx({"shared-dropdown__label": true, "shared-dropdown__label-required": isRequired})}>{label}</label>
      <Select
        id={inputId}
        size="small"
        displayEmpty
        value={value}
        className={clsx({ "shared-dropdown__input-field": true })}
        sx={{ width: width ? `${width}px` : "100%" }}
        IconComponent={ChevronDown}
        MenuProps={{ classes: { paper: clsx({"shared-dropdown__menu-paper": true, [menuClassName]: true })}}}
        renderValue={(selected) => {
          if (selected === "") {
            return (
              <Box className="shared-dropdown__placeholder">
                {placeholder}
              </Box>
            );
          }

        }}
        {...props}
      >
        <MenuItem id="shared-dropdown__menu-paper--search-field" onKeyDown={(e) => e.stopPropagation()}>
          <TextField
            autoFocus
            value={search}
            onChange={handleFilter}
            onClick={(e) => e.stopPropagation()}
            size="small"
            className="shared-dropdown__textfield"
            placeholder={"Search..."}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <SvgIcon component={Search} size={20} color="secondary" />
                </InputAdornment>
              ),
            }}
            multiline={true}
          />
        </MenuItem>
        {
          optionsList && optionsList?.length > 0 ?
            optionsList?.map(option => {
              return (
                <MenuItem value={option?.value}>
                  <Box>{option?.label}</Box>
                </MenuItem>
              )
            })
           :
          <MenuItem value="">No Option</MenuItem>
        }
      </Select>
    </Box>
  );
};