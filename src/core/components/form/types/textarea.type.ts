import type { IdentifierProps } from "@/core/types/IdentifierProps.type";
import {
  TEXTAREA_STATUS,
  TEXTAREA_LABEL_PLACEMENT,
} from "../constants/textarea";
import type { MandatoryFormElementProps } from "./form-element.type";

export type TextareaStatus =
  (typeof TEXTAREA_STATUS)[keyof typeof TEXTAREA_STATUS];
export type TextareaLabelPlacement =
  (typeof TEXTAREA_LABEL_PLACEMENT)[keyof typeof TEXTAREA_LABEL_PLACEMENT];

export type TextareaProps = MandatoryFormElementProps &
  IdentifierProps & {
    labelPlacement?: TextareaLabelPlacement;
    label?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disabled?: boolean;
    fullWidth?: boolean;
    error?: boolean;
    className?: string;
    minRows?: number;
    errorText?: string;
    helperText?: string;
    isInlineLabel?: boolean;
    maxRows?: number;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
  };
