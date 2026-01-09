import { Checkbox, Typography } from "@mui/material";
import {
  type SelectProps as MuiSelectProps,
  type SelectChangeEvent,
} from "@mui/material/Select";
import React, { useMemo } from "react";

import clsx from "@/utils/clsx";
import { CheckboxChecked, CheckboxEmpty } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";

import StyledMuiSelect from "./components/StyledSelect";
import StyledMenuItem from "./components/StyledMenuItem";
import "./MultiSelect.scss";
import type { OptionType } from "./types";
import { MULTISELECT } from "./constants";

export type MultiSelectProps = MuiSelectProps & {
  options: OptionType[];
  allowMultiSelect?: boolean;
  optionLabelKey?: string;
  optionValueKey?: string;
  renderOption?: (option: OptionType) => React.ReactNode;
  renderOptionValue?: (option: OptionType) => string;
  value?: Array<OptionType>;
  placeholder?: string;
};

const CMultiSelect = (props: MultiSelectProps) => {
  /**
   * @method isAllOptionsSelected
   * @description This function is used to check if all options are selected
   * @returns boolean
   */
  const isAllOptionsSelected = useMemo(() => {
    if (Array.isArray(props.value)) {
      return (
        props.options.length > 0 && props.value?.length === props.options.length
      );
    }
    return false;
  }, [props.value, props.options]);

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
    let selectAllChangeObject = null;
    if (isAllOptionsSelected) {
      selectAllChangeObject = {
        target: { value: [] },
      } as unknown as SelectChangeEvent;
    } else {
      const allOptionValues = props.options.map((option) => {
        if (typeof option === "object" && props.optionValueKey) {
          return (option as object)[props.optionValueKey];
        }
        return option;
      });
      selectAllChangeObject = {
        target: {
          value: allOptionValues,
        },
      } as unknown as SelectChangeEvent;
    }
    props.onChange(selectAllChangeObject, null);
  };
  /**
   * @method renderValue
   * @description This function is used to render business logic based values in input field
   * if renderValue is provided then it will be used to render values
   * else if selected length is 0 then placeholder will be shown
   * else if isAllOptionsSelected is true then "All Items Selected" will be shown
   * else `${selected.length} Items Selected` will be shown
   * @param selected Array of selected options
   * @returns String or span element
   */
  const renderValue = (selected: Array<OptionType>) => {
    if (props.renderValue) {
      return props.renderValue(selected);
    }
    if (selected?.length == 0) {
      return (
        <span className="multiselect__placeholder-text">
          {props.placeholder}
        </span>
      );
    }

    if (!isAllOptionsSelected) {
      return `${selected?.length} ${props.label} Selected`;
    }
    return `All ${props.label ?? "Items"} Selected`;
  };

  return (
    <div className={`multiselect multiselect-wrapper ${props.className ?? ""}`}>
      <label className="multiselect__label">{props.label}</label>
      <StyledMuiSelect
        {...props}
        label={""}
        multiple
        displayEmpty
        className={"multiselect__input"}
        renderValue={renderValue}
        MenuProps={{
          PaperProps: {
            className: "multiselect__menu",
            elevation: 0,
          },
        }}
      >
        {/**Select all feature option */}
        <div>
          <StyledMenuItem
            key={"all-options-selected"}
            className={clsx({
              "multiselect__menu-item--selected": isAllOptionsSelected,
              "multiselect__menu-item-select-all-feature": true,
            })}
            onClick={toggleSelectAllOptions}
          >
            <Checkbox
              checkedIcon={
                <CSvgIcon
                  component={CheckboxChecked}
                  size={20}
                  fill="var(--logile-bg-primary)"
                />
              }
              icon={
                <CSvgIcon
                  component={CheckboxEmpty}
                  fill="none"
                  stroke="var(--logile-border-primary)"
                  size={20}
                />
              }
              id="all-options-selected"
              className="multiselect__menu-item-checkbox"
              checked={isAllOptionsSelected}
            />
            <label htmlFor="all-options-selected">
              {MULTISELECT.SELECT_ALL_FEATURE_LABEL}
            </label>
          </StyledMenuItem>
        </div>

        {/*Options*/}
        {Array.isArray(props.options) &&
          props.options.map((option, index) => {
            const optionValue =
              typeof option === "object" && props.optionValueKey
                ? (option as object)[props.optionValueKey]
                : option;
            const optionLabel =
              typeof option === "object" && props.optionLabelKey
                ? (option as object)[props.optionLabelKey]
                : option;
            const isOptionSelected = Array.isArray(props.value)
              ? props.value.indexOf(optionValue) > -1
              : false;

            return (
              <StyledMenuItem
                key={index}
                value={optionValue}
                className={clsx({
                  "multiselect__menu-item": true,
                  "multiselect__menu-item--selected": isOptionSelected,
                })}
              >
                <Checkbox
                  checkedIcon={
                    <CSvgIcon
                      component={CheckboxChecked}
                      size={20}
                      fill="var(--logile-bg-primary)"
                    />
                  }
                  icon={
                    <CSvgIcon
                      component={CheckboxEmpty}
                      fill="none"
                      stroke="var(--logile-border-primary)"
                      size={20}
                    />
                  }
                  id={optionValue}
                  checked={isOptionSelected}
                />
                <label className="multiselect__menu-item-label-wrapper">
                  <Typography
                    component="span"
                    className={clsx({
                      "multiselect__menu-item-label": true,
                      "multiselect__menu-item--selected": isOptionSelected,
                    })}
                  >
                    {optionLabel as string}
                  </Typography>
                </label>
              </StyledMenuItem>
            );
          })}
      </StyledMuiSelect>
    </div>
  );
};
export default CMultiSelect;
