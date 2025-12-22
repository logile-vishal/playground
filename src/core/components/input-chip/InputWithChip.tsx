import { useEffect, useRef } from "react";
import { Box, Chip, TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

import { ChevronDown, ChevronUp, Close } from "@/core/constants/icons";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import clsx from "@/utils/clsx";
import CSvgIcon from "@/core/components/icon/Icon";

import "./InputWithChip.scss";

type InputWithChipProps = Omit<
  TextFieldProps,
  "value" | "onChange" | "placeholder"
> & {
  searchText?: string;
  selectedItems?: NestedMenuItem[];
  onDelete?: (event: React.MouseEvent, data: NestedMenuItem) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSelectIconShown?: boolean;
  placeholder?: string;
  anchorEl?: HTMLElement | null;
  onMenuOpen?: (event: React.MouseEvent<HTMLElement>) => void;
  width?: number | string;
  inputPlacement?: "start" | "end";
  isInputVisible?: boolean;
};

/**
 * @method CInputWithChip
 * @description Renders a select input component with chip display for selected items
 * @param {boolean} isSelectIconShown - Whether to show the select dropdown icon (default: false)
 * @param {HTMLElement | null} anchorEl - Anchor element for menu positioning
 * @param {function} onMenuOpen - Callback function when menu is opened
 * @param {number} width - Width of the component in pixels
 * @return {React.ReactNode} A select input component with chip display
 */
const CInputWithChip: React.FC<InputWithChipProps> = ({
  searchText,
  selectedItems,
  inputPlacement = "end",
  onDelete,
  onChange,
  width = "var(--input-with-chip-width)",
  onMenuOpen,
  placeholder = "Search",
  isInputVisible = true,
  ...props
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    <Box
      className={clsx({
        "input-with-chip": true,
        "input-with-chip--focus": Boolean(props.anchorEl),
      })}
      width={width}
      onClick={onMenuOpen}
    >
      <Box
        className="input-with-chip__scroll-container"
        ref={scrollRef}
      >
        <div
          className={clsx({
            "input-with-chip__content": true,
            "input-with-chip__content--end": inputPlacement === "end",
          })}
        >
          {isInputVisible ? (
            <>
              {/* Hidden element : 
              This hidden element measures the text width so the input can automatically grow to fit its content.*/}
              <span
                className="input-with-chip__content-hidden-field"
                ref={measureRef}
              >
                {searchText}
              </span>
              {/* Growing input */}
              <TextField
                ref={inputRef}
                className="input-with-chip__content-input-field"
                placeholder={selectedItems?.length == 0 ? placeholder : ""}
                value={searchText}
                onChange={onChange}
                {...props}
              />
            </>
          ) : (
            <Box className="input-with-chip__content-placeholder">
              {selectedItems?.length == 0 ? placeholder : ""}
            </Box>
          )}
          <div className="input-with-chip__content-chip-wrapper">
            {/* Chips */}
            {selectedItems?.map((item) => (
              <Chip
                key={item.path || item.value}
                label={item.path || item.value}
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
      <Box className="input-with-chip__icon">
        <CSvgIcon
          component={props.anchorEl ? ChevronUp : ChevronDown}
          size={18}
          color="secondary"
        />
      </Box>
    </Box>
  );
};

export default CInputWithChip;
