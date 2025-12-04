import type { CSSProperties } from "react";
import type { ButtonProps as MUIButtonProps } from "@mui/material";

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
};

export type ButtonProps = Omit<
  MUIButtonProps,
  "variant" | "severity" | "size"
> & {
  severity?: ButtonSeverity;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export type ButtonSeverity = keyof ButtonSeverityProps;
export type ButtonVariant = keyof ButtonVariantsProps;
export type ButtonSize = keyof ButtonSizesProps;
