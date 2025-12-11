import { Checkbox, type SxProps, type Theme } from "@mui/material";

export type LabelPlacement = "start" | "end";

export type CheckboxSize = "large" | "medium" | "small";

export type CheckboxProps = {
  label: string | React.ReactNode;
  labelPlacement?: LabelPlacement;
  size?: CheckboxSize;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
} & React.ComponentProps<typeof Checkbox>;
