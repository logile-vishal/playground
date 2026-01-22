import type { IdentifierProps } from "@/core/types/IdentifierProps.type";
import type { MandatoryFormElementProps } from "./form-element.type";

export type LabelPlacement = "start" | "end";

export type CheckboxSize = "large" | "medium" | "small";

export type CheckboxProps = MandatoryFormElementProps &
  IdentifierProps & {
    labelPlacement?: LabelPlacement;
    size?: CheckboxSize;
    disabled?: boolean;
    checked?: boolean;
    walkMeIdPrefix?: string[];
  };
