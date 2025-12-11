import { TextField } from "@mui/material";
import {
  TEXTFIELD_STATUS,
  TEXTFIELD_LABEL_PLACEMENT,
} from "../constants/textfield";

export type TextfieldStatus =
  (typeof TEXTFIELD_STATUS)[keyof typeof TEXTFIELD_STATUS];
export type TextfieldLabelPlacement =
  (typeof TEXTFIELD_LABEL_PLACEMENT)[keyof typeof TEXTFIELD_LABEL_PLACEMENT];

export type TextfieldProps = {
  labelPlacement?: TextfieldLabelPlacement;
  label?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  error?: boolean;
  className?: string;
  errorText?: string;
} & Omit<React.ComponentProps<typeof TextField>, "size">;
