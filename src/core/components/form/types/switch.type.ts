import type { IdentifierProps } from "@/core/types/IdentifierProps.type";

import type { MandatoryFormElementProps } from "./form-element.type";

export type CSwitchSize = "small" | "medium" | "large";

export type CSwitchProps = MandatoryFormElementProps &
  IdentifierProps & {
    size?: CSwitchSize;
    walkMeIdPrefix?: string[];
    checked?: boolean;
    className?: string;
    defaultChecked?: boolean;
    label?: string;
    disabled?: boolean;
  };
