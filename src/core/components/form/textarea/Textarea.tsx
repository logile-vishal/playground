import { TextField, InputAdornment } from "@mui/material";

import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";

import "./Textarea.scss";
import type { TextareaProps } from "../types/textarea.type";

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
  placeholder,
}: TextareaProps) => {
  const { generateId } = useWalkmeId();
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
        placeholder={placeholder}
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
      />
    </div>
  );
};

export default CTextarea;
