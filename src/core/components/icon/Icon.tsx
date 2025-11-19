import React from "react";
import Box from "@mui/material/Box";

import type { IconColorType } from "@/core/types/icon.type";
import clsx from "@/utils/clsx";

import "./icon-color-classnames.scss";

export type SvgIconProps = {
  component: React.FC<React.SVGProps<SVGSVGElement>>;
  size?: string | number;
  className?: string;
  fill?: string;
  stroke?: string;
  style?: React.CSSProperties;
  color?: IconColorType
};

export type SvgIconComponent = React.FC<SvgIconProps>;

const SvgIcon: React.FC<SvgIconProps> = ({
  component,
  size = 24,
  className,
  fill = "currentColor",
  stroke,
  style,
  color,
  ...props
}) => {
    const Component = component
    if (!Component) {
       return <Box sx={{width:size, height: size, bgcolor:"lightgray", borderRadius:"50%"}}></Box>
    }
    const iconClassName = clsx({
      [className || ""]: Boolean(className),
      [color]: Boolean(color)
    })
    const iconFill = fill ?? "currentColor";
    
  return (
    <Component
      width={size}
      height={size}
      className={iconClassName}
      fill={iconFill}
      stroke={stroke}
      style={style}
      {...props}
    />
  );
};

export default SvgIcon;