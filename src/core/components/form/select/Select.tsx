import { MenuItem, Typography } from "@mui/material";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import React, { useMemo, useEffect, useState, useCallback } from "react";

import clsx from "@/utils/clsx";
import { ChevronDown } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";
import { isNonEmptyValue } from "@/utils";

import CFilterSortToolbar from "./components/FilterSortToolbar";
import { SelectMenuItemContent } from "./components/SelectMenuItemContent";
import type {
  SelectOption,
  SelectProps,
  selectValueType,
} from "../types/select.type";
import "./Select.scss";

const CSelect = ({
  options,
  allowFilter,
  allowSort,
  allowMultiSelect,
  templates,
  value,
  onChange,
  name,
  label,
  placeholder,
  className,
  isInlineLabel,
  error,
  helperText,
  walkMeIdPrefix,
  IconComponent,
  required,
  optionValueKey,
  optionLabelKey,
}: SelectProps) => {
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    Map<selectValueType, selectValueType>
  >(new Map());
  const { generateId } = useWalkmeId();

  useEffect(() => {
    setFilteredOptions(isNonEmptyValue(options) ? options : []);
  }, [options]);

  /**
   * @method toggleSelectAllOptions
   * @description This function is used to select/de-select all options in value
   * if isAllOptionsSelected is true then all options will be de-selected
   * else all options will be selected
   * a fake event is created to pass onChange
   * @returns void
   */
  const toggleSelectAllOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    let syntheticEvent = null;
    if (!allowMultiSelect) return;
    if (!isAllOptionsSelected) {
      const enabledOptions = filteredOptions.filter(
        (option) => !option.disabled
      );
      const allOptionValues = enabledOptions.map(getOptionValue);
      syntheticEvent = {
        ...e,
        target: {
          value: allOptionValues,
          name: name,
        },
      } as unknown as SelectChangeEvent;
      onChange(syntheticEvent, null);
      return;
    }
    if (isAllOptionsSelected) {
      syntheticEvent = {
        ...e,
        target: { value: [], name: name },
      } as unknown as SelectChangeEvent;
      onChange(syntheticEvent, null);
      return;
    }
  };

  /**
   * @method renderValue
   * @description This function is used to render input value
   * - if custom render id provided it has higher priority
   * - if no custom render id is provided, it falls back to default rendering
   * - if no value is selected, it renders a placeholder
   * - if multiple values are selected, it shows a count of selected items
   * - if a single value is selected, it shows the label of the selected item
   * @param selected Selected option(s)
   * @returns String or span element
   */
  const renderValue = (selected: selectValueType) => {
    // Custom rendering logic

    if (templates?.inputValueTemplate) {
      return templates.inputValueTemplate({
        selectedItems: selected,
        options: options,
        isAllSelected: isAllOptionsSelected,
        hasMultiSelect: allowMultiSelect,
      });
    }
    // Render placeholder if no value is selected
    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      return <span className="select__placeholder-text">{placeholder}</span>;
    }

    if (allowMultiSelect) {
      // if multi-select Render selected values count
      if (Array.isArray(selected)) {
        if (isAllOptionsSelected) {
          return `All ${label ?? "Items"} Selected`;
        }
        return `${selected?.length} ${label} Selected`;
      }
    }
    if (!allowMultiSelect) {
      if (typeof selected === "object" && optionValueKey) {
        return `${selected[optionValueKey]}`;
      }
      return `${selected}`;
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getSelectValues = (value: selectValueType) => {
    if (optionValueKey) {
      if (allowMultiSelect && Array.isArray(value)) {
        return value.map((val) => {
          return val[optionValueKey] || val;
        });
      }
      if (!allowMultiSelect && typeof value === "object") {
        return value?.[optionValueKey];
      }
    }
    return value;
  };

  /**
   * @method getOptionValue
   * @description This function is used to get the value of an option
   * - If the option is an object, and optionValueKey is defined it returns the value using the optionValueKey
   * - If the option is a primitive or object value, it returns the value itself
   * @param option The option to get the value from
   * @returns The value of the option
   */
  const getOptionValue = useCallback(
    (option: selectValueType) => {
      if (typeof option == "object" && optionValueKey) {
        return option[optionValueKey];
      }
      return option;
    },
    [optionValueKey]
  );
  /**
   * @method getOptionLabel
   * @description This function is used to get the label of an option
   * - If the option is an object, and optionLabelKey is defined it returns the label using the optionLabelKey
   * - If the option is a primitive or object value, it returns the value itself
   * @param option The option to get the label from
   * @returns The label of the option
   */
  const getOptionLabel = (option: SelectOption) => {
    if (typeof option == "object" && optionLabelKey) {
      return option[optionLabelKey];
    }
    return option;
  };

  /**
   * @method isAllOptionsSelected
   * @description This function is used to check if all options are selected (multi-select only)
   * - it is only checked on value that is given to menuitem value prop
   * @returns boolean
   */
  const isAllOptionsSelected = useMemo(() => {
    return options.every((option) =>
      selectedOptions.has(getOptionValue(option))
    );
  }, [selectedOptions, options, getOptionValue]);

  /**
   * @description This function is used to update selected options
   * - If multi-select is enabled, it maps the selected values to their corresponding option values
   * - If single-select is enabled, it sets the selected option directly
   */
  useEffect(() => {
    //handle multiselect
    if (allowMultiSelect && Array.isArray(value)) {
      const valuesMap = new Map(
        value.map((item) => [getOptionValue(item), item])
      );
      setSelectedOptions(valuesMap);
    }
    //handle single select
    if (!allowMultiSelect && value && !Array.isArray(value)) {
      setSelectedOptions(new Map([[getOptionValue(value), value]]));
    }
  }, [value, allowMultiSelect, getOptionValue]);

  return (
    <div
      className={clsx({
        "select select-wrapper": true,
        "select--inline-label": isInlineLabel,
        "select--error": error,
        "select--required": required,
        "select-with-helper-text": isNonEmptyValue(helperText),
        [className]: Boolean(className),
      })}
    >
      <label className="select__label">{label}</label>
      <div className="select__input-layout">
        <Select
          fullWidth
          value={getSelectValues(value)}
          name={name || ""}
          data-walkme-id={generateId(walkMeIdPrefix)}
          onChange={onChange}
          label=""
          multiple={allowMultiSelect}
          displayEmpty
          className="select__input"
          renderValue={renderValue}
          onKeyDown={handleOnKeyDown}
          IconComponent={
            IconComponent ??
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

              elevation: 0,
            },
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          }}
        >
          {/* Filter and Sort toolbar - appears after select all if multi-select is enabled */}
          {(allowFilter || allowSort || allowMultiSelect) && (
            <CFilterSortToolbar
              allowFilter={allowFilter}
              allowSort={allowSort}
              setOptions={setFilteredOptions}
              options={options}
              optionFilterLabelKey="label"
              allowSelectAll={allowMultiSelect}
              handleSelectAll={toggleSelectAllOptions}
              isAllOptionsSelected={isAllOptionsSelected}
            />
          )}

          {/* Options */}
          {filteredOptions?.map((option, index) => {
            const isOptionSelected = Boolean(
              selectedOptions.has(getOptionValue(option))
            );

            return (
              <MenuItem
                disableRipple
                disableTouchRipple
                disabled={option.disabled}
                key={index}
                value={getOptionValue(option)}
                className={clsx({
                  "select__menu-item": true,
                  "select__menu-item--selected": isOptionSelected,
                })}
              >
                {templates && templates.menuItemTemplate ? (
                  templates.menuItemTemplate({
                    option,
                    isSelected: isOptionSelected,
                    isDisabled: option.disabled,
                    hasMultiSelect: allowMultiSelect,
                    hasLeftIcon: Boolean(option.labelStartIcon),
                    hasRightIcon: Boolean(option.labelEndIcon),
                  })
                ) : (
                  <SelectMenuItemContent
                    option={option}
                    isOptionSelected={isOptionSelected}
                    allowMultiSelect={allowMultiSelect}
                    getOptionLabel={getOptionLabel}
                  />
                )}
              </MenuItem>
            );
          })}
        </Select>

        {isNonEmptyValue(helperText) && (
          <Typography className="select__helper-text">
            {helperText || ""}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default CSelect;
