import React from "react";
import type { CSSProperties } from "react";
import { Button as MUIButton } from "@mui/material";

import type { ButtonProps } from "@/core/types/button.type";

import { buttonSizes } from "./button.sizes";
import { buttonPalette } from "./button.palette";

export const CButton: React.FC<ButtonProps> = ({
  severity = "primary",
  variant = "solid",
  size = "large",
  disabled = false,
  className,
  children,
  sx,
  ...props
}) => {
  const variantStyles = buttonPalette[severity][variant];
  const sizeStyles = buttonSizes[size];

  const baseStyle: CSSProperties = {
    minHeight: "auto",
    lineHeight: "normal",
    minWidth: "fit-content",
    textTransform: "none",
    boxShadow: "none",
    outline: "none",
    transition: "all 0.2s ease",
    cursor: disabled ? "not-allowed" : "pointer",
    ...sizeStyles,
    ...variantStyles.default,
  };

  return (
    <MUIButton
      disabled={disabled}
      className={className}
      {...props}
      sx={{
        ...baseStyle,
        "&:hover": !disabled ? variantStyles.hover : {},
        "&:active": !disabled ? variantStyles.pressed : {},
        "&:focus-visible": !disabled ? variantStyles.focus : {},
        "&.Mui-disabled": variantStyles.disabled,
        ...sx,
      }}
    >
      {children}
    </MUIButton>
  );
};
