import React from "react";
import { icons } from "../constants/Icons";
import Box from "@mui/material/Box";
import type { IconName } from "../types/icon.type";

interface SvgIconProps {
  component: IconName;
  size?: string | number;
  className?: string;
  fill?: string;
  stroke?: string;
  style?: React.CSSProperties;
}

const SvgIcon: React.FC<SvgIconProps> = ({
  component,
  size = 24,
  className,
  fill = "currentColor",
  stroke,
  style,
  ...props
}) => {
    const Component = icons[component]
    if (!Component) {
       return <Box sx={{width:size, height: size, bgcolor:"lightgray", borderRadius:"50%"}}></Box>
    }
  return (
    <Component
      width={size}
      height={size}
      className={className}
      fill={fill}
      stroke={stroke}
      style={style}
      {...props}
    />
  );
};

export default SvgIcon;