import { TextField, InputAdornment } from "@mui/material";

import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";

import { textareaPalette } from "./textarea.palette";
import "./Textarea.scss";
import type { TextareaProps, TextareaStatus } from "../types/textarea.type";
import { TEXTAREA_STATUS } from "../constants/textarea";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";

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
    "input::placeholder": {
      opacity: 1,
      ...state.default.placeholder,
    },
  };
};

const CTextarea = ({
  label,
  required = false,
  error = false,
  startIcon,
  endIcon,
  disabled,
  fullWidth = true,
  className = "",
  minRows = 3,
  maxRows,
  isInlineLabel = false,
  id,
  helperText,
  onChange,
  walkMeIdPrefix = [],
  value,
  onClick = () => {},
  name,
}: TextareaProps) => {
  const { generateId } = useWalkmeId();
  const status: TextareaStatus = error
    ? TEXTAREA_STATUS.ERROR
    : TEXTAREA_STATUS.DEFAULT;
  const state = textareaPalette[status];
  const textareaId = `textarea-${Math.random().toString(36).slice(2)} ${id || ""}`;

  const handleOnChange = (e) => {
    const syntheticEvent = {
      ...e,
      target: {
        name,
        value: e.target.value,
      },
    };
    onChange(syntheticEvent);
  };

  return (
    <div
      className={clsx({
        textarea: true,
        "textarea--inline-label": isInlineLabel,
        "textarea--error": error && !disabled,
        "textarea--required": required,
        "textarea-with-helper-text": isNonEmptyValue(helperText),
        [className]: true,
      })}
    >
      {isNonEmptyValue(label) && (
        <label
          className={clsx({
            textarea__label: true,
          })}
          htmlFor={textareaId}
        >
          {label}
        </label>
      )}
      <TextField
        name={name}
        onClick={onClick}
        value={value}
        data-walkme-id={generateId(walkMeIdPrefix)}
        onChange={handleOnChange}
        id={textareaId}
        disabled={disabled}
        fullWidth={fullWidth}
        minRows={minRows}
        maxRows={maxRows}
        multiline={true}
        helperText={helperText}
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
        }}
      />
    </div>
  );
};

export default CTextarea;
