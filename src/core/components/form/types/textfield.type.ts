import type { HTMLInputTypeAttribute } from "react";
import {
  TEXTFIELD_STATUS,
  TEXTFIELD_LABEL_PLACEMENT,
} from "../constants/textfield";
import type { MandatoryFormElementProps } from "./form-element.type";
import type { IdentifierProps } from "@/core/types/IdentifierProps.type";

export type TextfieldStatus =
  (typeof TEXTFIELD_STATUS)[keyof typeof TEXTFIELD_STATUS];
export type TextfieldLabelPlacement =
  (typeof TEXTFIELD_LABEL_PLACEMENT)[keyof typeof TEXTFIELD_LABEL_PLACEMENT];

export type TextfieldProps = MandatoryFormElementProps &
  IdentifierProps & {
    labelPlacement?: TextfieldLabelPlacement;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disabled?: boolean;
    fullWidth?: boolean;
    helperText?: React.ReactNode;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    width?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onClick?: (
      e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLInputElement>
    ) => void;
    acceptFileFormats?: string;
    ref?: React.Ref<HTMLInputElement>;
    isInlineLabel?: boolean;
  };
