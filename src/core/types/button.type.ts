import type { CSSProperties } from "react";
import type { ButtonProps as MUIButtonProps } from "@mui/material";
import type { IdentifierProps } from "./IdentifierProps.type";

export type ButtonStatesProps = {
  pressed: CSSProperties;
  hover: CSSProperties;
  disabled: CSSProperties;
  focus: CSSProperties;
  default: CSSProperties;
};

export type ButtonVariantsProps = {
  solid: ButtonStatesProps;
  outline: ButtonStatesProps;
  text: ButtonStatesProps;
  ghost: ButtonStatesProps;
};

export type ButtonSeverityProps = {
  primary?: ButtonVariantsProps;
  secondary?: ButtonVariantsProps;
  destructive?: ButtonVariantsProps;
};

export type ButtonThemeProps = {
  light?: ButtonSeverityProps;
  dark?: ButtonSeverityProps;
};

export type ButtonSizesProps = {
  small: string;
  medium: string;
  large: string;
  compact: string;
};

export type ButtonProps = IdentifierProps &
  Omit<MUIButtonProps, "variant" | "severity" | "size"> & {
    severity?: ButtonSeverity;
    variant?: ButtonVariant;
    size?: ButtonSize;
    walkMeId?: string[];
  };

export type IconButtonProps = ButtonProps;

export type ButtonSeverity = keyof ButtonSeverityProps;
export type ButtonVariant = keyof ButtonVariantsProps;
export type ButtonSize = keyof ButtonSizesProps;
