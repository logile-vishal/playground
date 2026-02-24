import React from "react";
import { Switch } from "@mui/material";
import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";

import "./Switch.scss";
import type { CSwitchProps } from "@/core/components/form/types/switch.type";

/**
 * @method CSwitch
 * @description Custom styled switch component with size variants (small, medium, large)
 * @param {CSwitchProps} props - Component props
 * @param {CSwitchSize} [props.size="large"] - Switch size variant (small, medium, large)
 * @param {boolean} [props.defaultChecked] - Initial checked state
 * @param {boolean} [props.disabled] - Disable the switch
 * @param {Function} [props.onChange] - Callback when switch state changes
 * @return {React.ReactNode} Custom styled switch component
 */
const CSwitch: React.FC<CSwitchProps> = ({
  size = "medium",
  className,
  walkMeIdPrefix,
  onChange,
  value,
  error,
  checked,
  defaultChecked,
  label,
  required,
  name,
  id,
  disabled,
}) => {
  const { generateId } = useWalkmeId();

  const handleOnChange = (e) => {
    const syntheticEvent = {
      target: {
        name,
        value: e.target.checked,
      },
    };
    onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
  };
  return (
    <div
      className={clsx({
        switch: true,
        [className || ""]: !!className,
        "switch--error": error,
        "switch--required": required,
        [`switch--${size}`]: true,
      })}
      id={id}
    >
      {isNonEmptyValue(label) && (
        <label className="switch__label">{label}</label>
      )}
      <Switch
        name={name}
        disabled={disabled}
        disableRipple
        defaultChecked={defaultChecked}
        checked={checked}
        value={value}
        onChange={handleOnChange}
        data-walkme-id={generateId(walkMeIdPrefix)}
        className={clsx({
          [`switch__input`]: true,
          [className || ""]: !!className,
        })}
        id={id}
      />
    </div>
  );
};

export default CSwitch;
