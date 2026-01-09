import React from "react";
import { Switch, type SwitchProps } from "@mui/material";
import clsx from "@/utils/clsx";

import "./Switch.scss";

export type CSwitchSize = "small" | "medium" | "large";

export interface CSwitchProps extends Omit<SwitchProps, "size"> {
  size?: CSwitchSize;
}

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
  ...props
}) => {
  return (
    <div className="switch-wrapper">
      <Switch
        {...props}
        className={clsx({
          [`switch switch--${size}`]: true,
          [className || ""]: !!className,
        })}
        disableRipple
      />
    </div>
  );
};

export default CSwitch;
