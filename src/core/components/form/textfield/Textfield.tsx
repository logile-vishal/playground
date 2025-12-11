import { TextField, InputAdornment } from "@mui/material";

import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";

import { textfieldPalette } from "./textfield.palette";
import "./Textfield.scss";
import type { TextfieldProps, TextfieldStatus } from "../types/textfield.type";
import {
  TEXTFIELD_STATUS,
  TEXTFIELD_LABEL_PLACEMENT,
  TEXTFIELD_ERROR,
} from "../constants/textfield";

const getStyle = (state) => {
  return {
    /* ROOT STYLES */
    "& .MuiOutlinedInput-root": {
      ...state.default.root,
      transition: "all .2s ease",

      "&:hover:not(.Mui-disabled)": {
        ...state.hover.root,

        ".MuiOutlinedInput-notchedOutline": {
          ...state.hover.fieldset,
        },
        svg: {
          ...state.hover.icon,
        },
        ".MuiOutlinedInput-input": {
          ...state.hover.input,
        },
      },

      "&:focus, &:focus-visible, &.Mui-focused": {
        ...state.focus.root,

        ".MuiOutlinedInput-notchedOutline": {
          ...state.focus.fieldset,
        },
        svg: {
          ...state.focus.icon,
        },
        ".MuiOutlinedInput-input": {
          ...state.focus.input,
        },
      },

      "&:active:not(.Mui-disabled)": {
        ...state.active.root,

        ".MuiOutlinedInput-notchedOutline": {
          ...state.active.fieldset,
        },
        svg: {
          ...state.active.icon,
        },
        ".MuiOutlinedInput-input": {
          ...state.active.input,
        },
      },

      "&.Mui-disabled": {
        ...state.disabled.root,

        ".MuiOutlinedInput-notchedOutline": {
          ...state.disabled.fieldset,
        },
        svg: {
          ...state.disabled.icon,
        },
        ".MuiOutlinedInput-input": {
          ...state.disabled.input,
        },
      },
    },

    svg: {
      ...state.default.icon,
      "&:hover:not(.Mui-disabled)": {
        ...state.hover.icon,
      },
      "&:focus, &:focus-visible, &.Mui-focused": {
        ...state.focus.icon,
      },
      "&:active:not(.Mui-disabled)": {
        ...state.active.icon,
      },
      "&.Mui-disabled": {
        ...state.disabled.icon,
      },
    },

    /* Input */
    ".MuiOutlinedInput-input": {
      ...state.default.input,
      "&:hover:not(.Mui-disabled)": {
        ...state.hover.input,
      },
      "&:focus, &:focus-visible, &.Mui-focused": {
        ...state.focus.input,
      },
      "&:active:not(.Mui-disabled)": {
        ...state.active.input,
      },
      "&.Mui-disabled": {
        ...state.disabled.input,
      },
    },

    /* Oultined */
    ".MuiOutlinedInput-notchedOutline": {
      ...state.default.fieldset,
      "&:hover:not(.Mui-disabled)": {
        ...state.hover.fieldset,
      },
      "&:focus, &:focus-visible, &.Mui-focused": {
        ...state.focus.fieldset,
      },
      "&:active:not(.Mui-disabled)": {
        ...state.active.fieldset,
      },
      "&.Mui-disabled": {
        ...state.disabled.fieldset,
      },
    },
  };
};

const CTextfield = ({
  label,
  required = false,
  error = false,
  startIcon,
  endIcon,
  disabled,
  fullWidth = true,
  className = "",
  errorText = TEXTFIELD_ERROR.REQUIRED_FIELD,
  labelPlacement = TEXTFIELD_LABEL_PLACEMENT.COLUMN,
  sx,
  ...props
}: TextfieldProps) => {
  const status: TextfieldStatus = error
    ? TEXTFIELD_STATUS.ERROR
    : TEXTFIELD_STATUS.DEFAULT;
  const state = textfieldPalette[status];
  const textfieldId =
    props.id ?? `textfield-${Math.random().toString(36).slice(2)}`;

  return (
    <div
      className={clsx({
        textfield: true,
        ["textfield__label--row"]:
          labelPlacement === TEXTFIELD_LABEL_PLACEMENT.ROW,
        [className]: true,
      })}
    >
      {isNonEmptyValue(label) && (
        <label
          className={clsx({
            textfield__label: true,
            "textfield__label--error": error && !disabled,
            "textfield__label--required": required,
          })}
          htmlFor={textfieldId}
        >
          {label}
        </label>
      )}
      <TextField
        {...props}
        id={textfieldId}
        disabled={disabled}
        fullWidth={fullWidth}
        helperText={error ? errorText : undefined}
        required={required}
        error={error}
        slotProps={{
          input: {
            startAdornment: startIcon ? (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ) : undefined,

            endAdornment: endIcon ? (
              <InputAdornment position="end">{endIcon}</InputAdornment>
            ) : undefined,
          },
        }}
        sx={{
          ...getStyle(state),
          ...sx,
        }}
      />
    </div>
  );
};

export default CTextfield;
