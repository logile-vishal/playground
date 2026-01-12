import { useEffect, useRef } from "react";
import { Box, Chip, TextField } from "@mui/material";

import { ChevronDown, ChevronUp, Close } from "@/core/constants/icons";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import clsx from "@/utils/clsx";
import CSvgIcon from "@/core/components/icon/Icon";

import "./InputWithChip.scss";

export type InputWithChipProps = {
  label?: string;
  name?: string;
  id?: string;
  searchText?: string;
  selectedItems?: NestedMenuItem[];
  onDelete?: (event: React.MouseEvent, data: NestedMenuItem) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSelectIconShown?: boolean;
  placeholder?: string;
  anchorEl?: HTMLElement | null;
  width?: number | string;
  inputPlacement?: "start" | "end";
  isInputVisible?: boolean;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  inLineLabel?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  renderInputChipLabel?: (item: NestedMenuItem) => React.ReactNode;
  isFocused?: boolean;
  error?: boolean;
  helperText?: string;
  hideEndIcon?: boolean;
  className?: string;
  disabled?: boolean;
};

const CInputWithChip: React.FC<InputWithChipProps> = ({
  searchText,
  selectedItems,
  inputPlacement = "end",
  onDelete,
  onChange,
  width,
  placeholder,
  isInputVisible = true,
  renderInputChipLabel,
  endIcon,
  startIcon,
  inLineLabel,
  label,
  name,
  id,
  isFocused,
  error,
  helperText,
  hideEndIcon = true,
  onClick,
  disabled,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /**
   * @method getInputChipLabel
   * @param {NestedMenuItem} item - The menu item to get the label for
   * @description Returns the label for the chip, using custom render function if provided
   * @returns {React.ReactNode} - The label for the chip
   */
  const getInputChipLabel = (item: NestedMenuItem) => {
    if (renderInputChipLabel) {
      return renderInputChipLabel(item);
    }
    return item.label || item.value;
  };

  /**
   * @method handleFieldClick
   * @param e - Mouse event
   * @description Handles click on the input wrapper area to focus input
   * @returns {void}
   */
  const handleFieldClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Set dynamic input width
  useEffect(() => {
    if (!measureRef.current || !inputRef.current) return;

    // Use requestAnimationFrame for smoother, non-blocking width updates
    const inputWidthRaf = requestAnimationFrame(() => {
      if (searchText?.length > 0) {
        // When user types, measure text width and apply it to the input
        const measureWidth = measureRef.current.offsetWidth;
        inputRef.current.style.width = `${measureWidth}px`;
      } else if (!searchText?.length && !selectedItems?.length) {
        // When nothing typed & no items selected, input should stretch fully
        inputRef.current.style.width = "100%";
      } else {
        // Fallback minimal width for input cursor when nothing typed
        inputRef.current.style.width = "2px";
      }
    });

    // Cleanup animation frame to avoid memory leaks and invalid updates
    return () => cancelAnimationFrame(inputWidthRaf);
  }, [searchText, selectedItems]);

  // Auto scroll to right
  useEffect(() => {
    if (!scrollRef.current || searchText?.length > 0) return;
    const container = scrollRef.current;

    // Use requestAnimationFrame to ensure scroll happens after DOM updates
    const containerRef = requestAnimationFrame(() => {
      if (inputPlacement == "start") {
        // If input is placed at the start, scroll to the beginning
        container.scrollLeft = container.scrollWidth;
        setTimeout(() => {
          container.scrollLeft = 0;
          inputRef.current?.focus();
        }, 500); // Slight delay to ensure scroll happens after render
      } else {
        // If input is placed at the end, scroll to the end
        container.scrollLeft = container.scrollWidth;
        inputRef.current?.focus();
      }
    });
    return () => cancelAnimationFrame(containerRef);
  }, [searchText, selectedItems, inputPlacement]);

  return (
    <div
      className={clsx({
        "input-with-chip": true,
        [className || ""]: Boolean(className),
        "input-with-chip--inline-label": inLineLabel,
        "input-with-chip--error": Boolean(error),
      })}
    >
      <label className="input-with-chip__label">{label}</label>
      <Box
        className={clsx({
          "input-with-chip__input": true,
          "input-with-chip__input--focus": Boolean(isFocused),
        })}
        width={width}
        onClick={handleFieldClick}
      >
        {startIcon && (
          <Box className="input-with-chip__input-icon">{startIcon}</Box>
        )}
        <Box
          className="input-with-chip__input-scroll-container"
          ref={scrollRef}
        >
          <div
            className={clsx({
              "input-with-chip__input-content": true,
              "input-with-chip__input-content--end": inputPlacement === "end",
            })}
          >
            {isInputVisible ? (
              <>
                {/* Hidden element : 
              This hidden element measures the text width so the input can automatically grow to fit its content.*/}
                <span
                  className="input-with-chip__input-content-hidden-field"
                  ref={measureRef}
                >
                  {searchText}
                </span>
                {/* Growing input */}
                <TextField
                  inputRef={inputRef}
                  className="input-with-chip__input-content-input-field"
                  placeholder={selectedItems?.length == 0 ? placeholder : ""}
                  value={searchText}
                  onChange={onChange}
                  name={name}
                  id={id}
                  disabled={disabled}
                />
              </>
            ) : (
              <Box className="input-with-chip__input-content-placeholder">
                {selectedItems?.length == 0 ? placeholder : ""}
              </Box>
            )}
            <div className="input-with-chip__input-content-chip-wrapper">
              {/* Chips */}
              {selectedItems?.map((item) => (
                <Chip
                  key={item.label || item.value}
                  label={getInputChipLabel(item)}
                  size="small"
                  deleteIcon={
                    <CSvgIcon
                      component={Close}
                      size={16}
                    />
                  }
                  onDelete={(e) => onDelete(e, item)}
                />
              ))}
            </div>
          </div>
        </Box>
        {!hideEndIcon && (
          <Box className="input-with-chip__input-icon">
            {endIcon ? (
              endIcon
            ) : (
              <CSvgIcon
                component={isFocused ? ChevronUp : ChevronDown}
                size={18}
                color="secondary"
              />
            )}
          </Box>
        )}
      </Box>

      <div className="input-with-chip__helper-text">{helperText}</div>
    </div>
  );
};

export default CInputWithChip;
