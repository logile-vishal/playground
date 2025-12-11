import { Checkbox } from "@mui/material";

import {
  GenericCheckboxBlank,
  GenericCheckboxChecked,
  GenericCheckboxIntermediate,
} from "@/core/constants/icons";
import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";
import {
  CHECKBOX_LABEL_PLACEMENT,
  CHECKBOX_SIZE,
  CHECKBOX_STATE,
} from "@/core/components/form/constants/checkbox";
import CSvgIcon from "@/core/components/icon/Icon";

import { checkboxPalette } from "./checkbox.palette";
import "./Checkbox.scss";
import type {
  CheckboxProps,
  CheckboxSize,
  LabelPlacement,
} from "../types/checkbox.type";

const getCheckboxStyle = (checkboxState, disabled) => {
  const baseIconStyles = {
    ...checkboxPalette.default[checkboxState].default.icon,
  };
  return {
    "& svg": {
      ...baseIconStyles,
    },
    "&.Mui-checked svg": {
      ...checkboxPalette.checked[checkboxState].default.icon,
    },
    "&.MuiCheckbox-indeterminate svg": {
      ...checkboxPalette.intermediate[checkboxState].default.icon,
    },
    "&:hover svg": !disabled
      ? checkboxPalette.default[checkboxState].hover.icon
      : {},
    "&.Mui-checked:hover svg": !disabled
      ? checkboxPalette.checked[checkboxState].hover.icon
      : {},
    "&.MuiCheckbox-indeterminate:hover svg": !disabled
      ? checkboxPalette.intermediate[checkboxState].hover.icon
      : {},
    "&.Mui-focusVisible svg": !disabled
      ? checkboxPalette.default[checkboxState].focus.icon
      : {},
    "&.Mui-checked.Mui-focusVisible svg": !disabled
      ? checkboxPalette.checked[checkboxState].focus.icon
      : {},
    "&.MuiCheckbox-indeterminate.Mui-focusVisible svg": !disabled
      ? checkboxPalette.intermediate[checkboxState].focus.icon
      : {},
    "&.Mui-disabled svg": checkboxPalette.default[checkboxState].disabled.icon,
    "&.Mui-checked.Mui-disabled svg":
      checkboxPalette.checked[checkboxState].disabled.icon,
    "&.MuiCheckbox-indeterminate.Mui-disabled svg":
      checkboxPalette.intermediate[checkboxState].disabled.icon,
  };
};

const CCheckbox = ({
  label,
  required = false,
  labelPlacement = CHECKBOX_LABEL_PLACEMENT.END as LabelPlacement,
  className = "",
  error = false,
  disabled = false,
  size = CHECKBOX_SIZE.LARGE as CheckboxSize,
  sx,
  ...props
}: CheckboxProps) => {
  const checkboxState = error ? CHECKBOX_STATE.ERROR : CHECKBOX_STATE.NORMAL;
  const checkboxId =
    props.id ?? `checkbox-${Math.random().toString(36).slice(2)}`;

  // default state
  const baseRootStyles = {
    cursor: disabled ? "not-allowed" : "pointer",
    padding: 0,
    margin: 0,
    ...checkboxPalette.default[checkboxState].default.root,
  };

  return (
    <div
      className={clsx({
        checkbox: true,
        [`checkbox--${size}`]: !!size,
        "checkbox--label-start":
          labelPlacement === CHECKBOX_LABEL_PLACEMENT.START,
        "checkbox--label-end": labelPlacement === CHECKBOX_LABEL_PLACEMENT.END,
        [className]: isNonEmptyValue(className),
      })}
    >
      <Checkbox
        id={checkboxId}
        disableRipple
        disabled={disabled}
        icon={<CSvgIcon component={GenericCheckboxBlank} />}
        checkedIcon={<CSvgIcon component={GenericCheckboxChecked} />}
        indeterminateIcon={<CSvgIcon component={GenericCheckboxIntermediate} />}
        required={required}
        size={size}
        sx={{
          ...baseRootStyles,
          ...sx,
          ...getCheckboxStyle(checkboxState, disabled),
        }}
        {...props}
      />
      <label
        htmlFor={checkboxId}
        className={clsx({
          checkbox__label: true,
          "checkbox__label--required": required,
        })}
      >
        {label}
      </label>
    </div>
  );
};

export default CCheckbox;
