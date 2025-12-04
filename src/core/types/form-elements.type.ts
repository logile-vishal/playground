import type { TextFieldProps as MuiTextFieldProps } from "@mui/material";
import type { SelectProps as MuiSelectProps } from "@mui/material";

export type BaseFieldProps = {
  label?: string;
  width?: string;
  isRequired?: boolean;
};

export type TextFieldProps = MuiTextFieldProps & BaseFieldProps;

export type TextAreaProps = MuiTextFieldProps & BaseFieldProps;

export type Option = {
  label: string;
  value: string;
};

export type DropdownProps = MuiSelectProps &
  BaseFieldProps & {
    options?: Option[];
    placeholder?: string;
    isDesktopPreview?: boolean;
    menuClassName?: string;
  };
