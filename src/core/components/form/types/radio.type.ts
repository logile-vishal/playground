import type { IdentifierProps } from "@/core/types/IdentifierProps.type";

import type { MandatoryFormElementProps } from "./form-element.type";

export type RadioCheckedStatus = "checked" | "unchecked";
export type RadioState = "default" | "error";
export type RadioSize = "large" | "medium" | "small";
export type LabelPlacement = "end" | "start";

export type RadioProp = MandatoryFormElementProps &
  IdentifierProps & {
    size?: RadioSize;
    labelPlacement?: LabelPlacement;
    className?: string;
    id?: string;
    helperText?: string;
    inLineLabel?: boolean;
    hideLabel?: boolean;
    walkMeIdPrefix?: string[];
    required?: boolean;
    disabled?: boolean;
    checked?: boolean;
  };
