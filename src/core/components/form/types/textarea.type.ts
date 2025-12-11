import { TextField } from "@mui/material";
import {
  TEXTAREA_STATUS,
  TEXTAREA_LABEL_PLACEMENT,
} from "../constants/textarea";

export type TextareaStatus =
  (typeof TEXTAREA_STATUS)[keyof typeof TEXTAREA_STATUS];
export type TextareaLabelPlacement =
  (typeof TEXTAREA_LABEL_PLACEMENT)[keyof typeof TEXTAREA_LABEL_PLACEMENT];

export type TextareaProps = {
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
} & Omit<React.ComponentProps<typeof TextField>, "size">;
