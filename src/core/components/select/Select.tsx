import { type SelectProps as MuiSelectProps } from "@mui/material/Select";
import { useEffect, useState } from "react";

import { ChevronDown } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import { isNonEmptyValue } from "@/utils";

import CFilterSortToolbar from "./components/FilterSortToolbar";
import StyledMuiSelect from "./components/StyledSelect";
import StyledMenuItem from "./components/StyledMenuItem";
import type { OptionType } from "./types";
import "./Select.scss";

type SelectProps = MuiSelectProps & {
  options: OptionType[];
  optionLabelKey?: string;
  optionValueKey?: string;
  allowFilter?: boolean;
  allowSort?: boolean;
  renderOption?: (option: OptionType) => React.ReactNode;
  renderOptionValue?: (option: OptionType) => string;
  value?: Array<OptionType>;
  placeholder?: string;
};

const CSelect = (props: SelectProps) => {
  const { options, allowFilter, allowSort } = props;
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    setFilteredOptions(isNonEmptyValue(options) ? options : []);
  }, [options]);

  const renderValue = (selected: unknown) => {
    if (!selected) {
      return (
        <span className="select__placeholder-text">{props.placeholder}</span>
      );
    }
    if (props.renderValue) {
      return props.renderValue(selected);
    }
    return selected as string;
  };
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <div className={`select select-wrapper ${props.className ?? ""}`}>
      <label className="select__label">{props.label}</label>
      <StyledMuiSelect
        {...props}
        label=""
        displayEmpty
        renderValue={renderValue}
        onKeyDown={handleOnKeyDown}
        IconComponent={
          props.IconComponent ??
          ((iconProps) => (
            <CSvgIcon
              component={ChevronDown}
              size={18}
              color="secondary"
              {...iconProps}
            />
          ))
        }
        MenuProps={{
          PaperProps: {
            className: "select__menu",
          },
        }}
      >
        {(allowFilter || allowSort) && (
          <CFilterSortToolbar
            allowFilter={allowFilter}
            allowSort={allowSort}
            setOptions={setFilteredOptions}
            options={options}
            optionFilterLabelKey={props.optionLabelKey}
          />
        )}

        {filteredOptions?.map((option, index) => {
          const optionValue =
            typeof option === "object" && props.optionValueKey
              ? (option as object)[props.optionValueKey]
              : option;
          const optionLabel =
            typeof option === "object" && props.optionLabelKey
              ? (option as object)[props.optionLabelKey]
              : option;
          return (
            <StyledMenuItem
              key={index}
              value={optionValue}
            >
              {optionLabel as string}
            </StyledMenuItem>
          );
        })}
      </StyledMuiSelect>
    </div>
  );
};
export default CSelect;
