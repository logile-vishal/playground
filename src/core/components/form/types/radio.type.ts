import type { RadioProps } from "@mui/material";

export type RadioCheckedStatus = "checked" | "unchecked";
export type RadioState = "default" | "error";
export type RadioSize = "large" | "medium" | "small";
export type LabelPlacement = "end" | "start";

export type RadioProp = Omit<RadioProps, "size"> & {
  error?: boolean;
  size?: RadioSize;
  label?: string;
  labelPlacement?: LabelPlacement;
  className?: string;
};
