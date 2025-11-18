import { useEffect, useState, Fragment } from "react";
import useAutocomplete from "@mui/material/useAutocomplete";
import { Popper, Typography, Box } from "@mui/material";

import type { AutoCompleteOptionProps, StyledAutocompleteProps } from "@/core/types/autocomplete.type";
import SvgIcon from "@/core/components/icon/Icon";
import { AUTOCOMPLETE_CONSTANTS } from "@/core/constants/autocomplete";

import "./AutoComplete.scss";

const flattenOptions = (options: AutoCompleteOptionProps[]): AutoCompleteOptionProps[] => {
  const result: AutoCompleteOptionProps[] = [];
  options.forEach((opt) => {
    if (opt.options) {
      result.push(...opt.options.map((child) => ({ ...child, groupLabel: opt.label })));
    } else {
      result.push(opt);
    }
  });
  return result;
};

export default function StyledAutocomplete({
  label = AUTOCOMPLETE_CONSTANTS.label,
  options,
  defaultValue = [],
  value,
  placeholder = AUTOCOMPLETE_CONSTANTS.placeholder,
  handleChange,
}: StyledAutocompleteProps) {
  const [selectedValues, setSelectedValues] = useState<AutoCompleteOptionProps[]>(defaultValue);

  const flatOptions = flattenOptions(options);

  useEffect(() => {
    if (value) setSelectedValues(value);
  }, [value]);

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    setAnchorEl,
    anchorEl,
  } = useAutocomplete<AutoCompleteOptionProps, true, false, false>({
    multiple: true,
    options: flatOptions,
    value: selectedValues,
    getOptionLabel: (option: AutoCompleteOptionProps) => option.label,
    onChange: (_event, newValue) => {
      setSelectedValues(newValue);
      handleChange?.(newValue);
    },
  });

/**
 * Groups flat options by their groupLabel key.
 *
 * Options that have the same `groupLabel` value are placed together.
 * Options without a groupLabel are grouped under `UNGROUPED`.
 *
 * @param {Record<string, AutoCompleteOptionProps[]>} acc - The grouped result so far.
 * @param {AutoCompleteOptionProps} opt - The current option being processed.
 * @returns {Record<string, AutoCompleteOptionProps[]>} The updated grouped options.
 */

  
  const groupedByParent = flatOptions.reduce((acc: Record<string, AutoCompleteOptionProps[]>, opt) => {
    const key = opt.groupLabel || AUTOCOMPLETE_CONSTANTS.ungrouped;
    if (!acc[key]) acc[key] = [];
    acc[key].push(opt);
    return acc;
  }, {});

  return (
    <div className="auto-complete" {...getRootProps()}>
      <label className="auto-complete__label" {...getInputLabelProps()}>
        {label}
      </label>

      <div
        ref={setAnchorEl}
        className={`auto-complete__input-wrapper ${focused ? "focused" : ""}`}
      >
        { selectedValues && selectedValues?.length > 0 && selectedValues?.map((option, index) => {
          const tagProps = getTagProps({ index });
          return (
            <div key={index} className="auto-complete__tag" {...tagProps}>
              <span>{option.label}</span>
              <Box
                className="auto-complete__tag-img-container"
                onClick={tagProps.onDelete}
              >
                <SvgIcon component="close" size={16} fill="#000" />
              </Box>
            </div>
          );
        })}

        <input
          {...getInputProps()}
          placeholder={
            selectedValues?.length === 0 ? placeholder || AUTOCOMPLETE_CONSTANTS.placeholder : ""
          }
        />
      </div>

      {groupedOptions.length > 0 && (
        <Popper open placement="bottom-start" anchorEl={anchorEl}>
          <ul className="auto-complete__listbox" {...getListboxProps()}>
            {Object.entries(groupedByParent).map(([group, groupOptions]) => (
              <Fragment key={group}>
                {group !== AUTOCOMPLETE_CONSTANTS.ungrouped && (
                  <li className="auto-complete__group-header">
                    <Typography className="auto-complete__ungroup-label" >
                      {group}
                    </Typography>
                  </li>
                )}

                {groupOptions.map((option, index) => {
                  const { key, ...optionProps } = getOptionProps({
                    option,
                    index,
                  });
                  return (
                    <li key={key} {...optionProps}>
                      <Typography className="auto-complete__group-label">{option.label}</Typography>
                    </li>
                  );
                })}
              </Fragment>
            ))}
          </ul>
        </Popper>
      )}
    </div>
  );
}
