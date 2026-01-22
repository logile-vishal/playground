import type { IdentifierProps } from "@/core/types/IdentifierProps.type";
import type { MandatoryFormElementProps } from "./form-element.type";

export type LabelPlacement = "start" | "end";

export type CheckboxSize = "large" | "medium" | "small";

export type CheckboxProps = MandatoryFormElementProps &
  IdentifierProps & {
    label?: string | React.ReactNode;
    labelPlacement?: LabelPlacement;
    size?: CheckboxSize;
    className?: string;
    error?: boolean;
    disabled?: boolean;
    checked?: boolean;
  };
