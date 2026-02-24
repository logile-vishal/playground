import { Checkbox } from "@mui/material";
import { useId } from "react";

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
} from "@/core/components/form/constants/checkbox";
import CSvgIcon from "@/core/components/icon/Icon";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";
import type {
  CheckboxProps,
  CheckboxSize,
  LabelPlacement,
} from "@/core/components/form/types/checkbox.type";

import "./Checkbox.scss";

const CCheckbox = ({
  label,
  required = false,
  labelPlacement = CHECKBOX_LABEL_PLACEMENT.END as LabelPlacement,
  className,
  error = false,
  disabled = false,
  size = CHECKBOX_SIZE.LARGE as CheckboxSize,
  onChange,
  name,
  id,
  value,
  walkMeIdPrefix = [],
  checked = false,
  indeterminate,
}: CheckboxProps) => {
  const checkBoxGeneratedId = useId();
  const checkboxId = id ?? `checkbox-${checkBoxGeneratedId}`;
  const { generateId } = useWalkmeId();

  return (
    <div
      className={clsx({
        checkbox: true,
        [`checkbox--${size}`]: !!size,
        "checkbox--error": error,
        "checkbox--label-start":
          labelPlacement === CHECKBOX_LABEL_PLACEMENT.START,
        "checkbox--label-end": labelPlacement === CHECKBOX_LABEL_PLACEMENT.END,
        [className]: isNonEmptyValue(className),
      })}
    >
      <Checkbox
        data-walkme-id={generateId(walkMeIdPrefix)}
        value={value}
        checked={Boolean(value) || checked}
        id={checkboxId}
        onChange={onChange}
        name={name}
        disableRipple
        disabled={disabled}
        icon={<CSvgIcon component={GenericCheckboxBlank} />}
        checkedIcon={<CSvgIcon component={GenericCheckboxChecked} />}
        indeterminateIcon={<CSvgIcon component={GenericCheckboxIntermediate} />}
        required={required}
        size={size}
        indeterminate={indeterminate}
      />
      {isNonEmptyValue(label) && (
        <label
          htmlFor={checkboxId}
          className={clsx({
            checkbox__label: true,
            "checkbox__label--required": required,
          })}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default CCheckbox;
