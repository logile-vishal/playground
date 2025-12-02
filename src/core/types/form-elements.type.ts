import type { TextFieldProps } from "@mui/material";
import type { SelectProps } from "@mui/material";

export type SharedTextFieldProps = TextFieldProps & {
    label?: string;
    width?: string;
    isRequired?: boolean;
}

export type SharedTextAreaProps = TextFieldProps & {
    label?: string;
    width?: string;
    isRequired?: boolean;
}

type Option = {
    label: string;
    value: string;
}

export type SharedDropdownProps = SelectProps & {
    label?: string;
    options?: Option[];
    width?: string;
    placeholder?: string;
    isDesktopPreview?: boolean;
    menuClassName?: string;
    isRequired?: boolean;
}