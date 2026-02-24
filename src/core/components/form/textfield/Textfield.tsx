import { TextField, InputAdornment } from "@mui/material";

import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";

import "./Textfield.scss";
import type { TextfieldProps } from "../types/textfield.type";

const CTextfield = ({
  label,
  required = false,
  error = false,
  startIcon,
  endIcon,
  disabled,
  fullWidth = true,
  className = "",
  helperText,
  onChange,
  name,
  value,
  id,
  placeholder,
  type,
  width,
  onKeyDown,
  onClick = () => {},
  ref,
  acceptFileFormats,
  allowMultipleFileUpload,
  isInlineLabel,
  min,
  max,
}: TextfieldProps) => {
  const textfieldId = id ?? `textfield-${Math.random().toString(36).slice(2)}`;

  return (
    <div
      className={clsx({
        textfield: true,
        "textfield--inline-label": isInlineLabel,
        "textfield--error": error && !disabled,
        "textfield--required": required,
        "textfield-with-helper-text": Boolean(helperText),
        [className]: true,
      })}
    >
      {isNonEmptyValue(label) && (
        <label
          className={clsx({
            textfield__label: true,
          })}
          htmlFor={textfieldId}
        >
          {label}
        </label>
      )}
      <TextField
        onKeyDown={onKeyDown}
        type={type}
        onClick={onClick}
        name={name}
        value={value}
        onChange={onChange}
        id={textfieldId}
        disabled={disabled}
        fullWidth={fullWidth}
        helperText={helperText}
        required={required}
        error={error}
        placeholder={placeholder}
        inputRef={ref}
        slotProps={{
          htmlInput: {
            ...(type === "file" && acceptFileFormats
              ? { accept: acceptFileFormats }
              : {}),
            ...(type === "file" && allowMultipleFileUpload
              ? { multiple: true }
              : {}),
            ...(type === "number" && min !== undefined ? { min: min } : {}),
            ...(type === "number" && max !== undefined ? { max: max } : {}),
          },
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
          width: width,
        }}
      />
    </div>
  );
};

export default CTextfield;
