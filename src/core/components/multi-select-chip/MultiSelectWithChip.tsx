import { useEffect, useState } from "react";
import type { PopoverProps } from "@mui/material";

import type { NestedMenuItem } from "@/core/components/nested-menu/types/index";
import CInputWithChip from "@/core/components/input-chip/InputWithChip";
import CNestedMenu from "@/core/components/nested-menu/NestedMenu";
import clsx from "@/utils/clsx";

import "./MultiSelectWithChip.scss";

export type MultiSelectWithChipProps = {
  isSelectIconShown?: boolean;
  options: NestedMenuItem[];
  onDelete?: (
    event: React.MouseEvent<HTMLElement>,
    item: NestedMenuItem
  ) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: number | string;
  inputPlacement?: "start" | "end";
  className?: string;
  isInputVisible?: boolean;
  inputStartIcon?: React.ReactNode;
  inputEndIcon?: React.ReactNode;
  name?: string;
  value?: NestedMenuItem[];
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  anchorOrigin?: PopoverProps["anchorOrigin"];
  transformOrigin?: PopoverProps["transformOrigin"];
  menuWidth?: number | string;
  inputWidth?: number | string;
  isInLineLabel?: boolean;
  label?: string;
  hideInputEndIcon?: boolean;
  renderInputChipLabel?: (item: NestedMenuItem) => React.ReactNode | string;
  menuHeight?: number | string;
  disabled?: boolean;
};

const CMultiSelectWithChip = ({
  options = [],
  inputPlacement,
  onDelete,
  onChange,
  placeholder,
  isInputVisible = false,
  inputStartIcon,
  inputEndIcon,
  className,
  value,
  name,
  error,
  helperText,
  onInputChange,
  menuWidth,
  inputWidth,
  isInLineLabel,
  label,
  hideInputEndIcon = false,
  renderInputChipLabel,
  menuHeight,
  disabled,
}: MultiSelectWithChipProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedBadges, setSelectedBadges] = useState<NestedMenuItem[]>([]);
  const [searchBarAnchorRef, setSearchBarAnchorRef] =
    useState<HTMLDivElement | null>(null);

  /**
   * @method handleChange
   * @description Handles selection of a menu item, adds it to the selected items if not already selected
   * @param {NestedMenuItem} menuItem - The menu item that was selected
   * @summary
   * - Checks if the item is already selected using label comparison
   * - If not selected, adds the item to the selected badges array
   * - Creates a synthetic event and triggers the onChange callback
   * @returns {void}
   */
  const handleChange = (menuItem: NestedMenuItem) => {
    const isSelected = selectedBadges?.some(
      (selected) => selected.label === menuItem.label
    );

    if (isSelected) return;
    const selectedItems = [...selectedBadges, menuItem];
    setSelectedBadges(selectedItems);
    const syntheticEvent = {
      target: {
        name,
        value: selectedItems,
      },
    } as unknown as React.ChangeEvent<{
      name: string;
      value: NestedMenuItem[];
    }>;
    onChange(syntheticEvent as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  /**
   * @method handleOnDelete
   * @description Handles deletion of a selected chip/item
   * @param {React.MouseEvent<HTMLElement>} event - The click event from the delete button
   * @param {NestedMenuItem} item - The item to be deleted
   * @summary
   * - Stops event propagation to prevent unwanted side effects
   * - Calls the external onDelete callback if provided
   * - Filters out the item from selectedBadges array using value comparison
   * - Creates a synthetic event and triggers the onChange callback with updated list
   * @returns {void}
   */
  const handleOnDelete = (
    event: React.MouseEvent<HTMLElement>,
    item: NestedMenuItem
  ) => {
    event.stopPropagation();
    onDelete(event, item);
    const filteredBadges = selectedBadges.filter(
      (badge) => badge.label !== item.label
    );
    setSelectedBadges(filteredBadges);
    onChange({
      target: {
        name,
        value: filteredBadges,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  /**
   * @method handleInputChange
   * @description Handles input text changes in the search field
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event
   * @summary
   * - Updates the input value state
   * - Calls the optional onInputChange callback if provided
   * @returns {void}
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onInputChange?.(event);
  };

  /**
   * @method handleOnInputClick
   * @description Handles click events on the input field to open/position the menu
   * @param {React.MouseEvent<HTMLDivElement>} event - The click event from the input field
   * @summary
   * - Sets the search bar anchor reference to the clicked element for menu positioning
   * @returns {void}
   */
  const handleOnInputClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setSearchBarAnchorRef(event.currentTarget as HTMLDivElement);
  };

  /**
   * @method handleMenuClose
   * @description Handles closing of the dropdown menu and resets search state
   * @summary
   * - Sets the search bar anchor reference to null to close the menu
   * - Clears the input value to reset the search state
   * @returns {void}
   */
  const handleMenuClose = () => {
    setSearchBarAnchorRef(null);
  };

  const handleRenderInputChipLabel = (item: NestedMenuItem) => {
    if (renderInputChipLabel) {
      return renderInputChipLabel(item);
    }
    return item.filterPath || item.label || item.value;
  };

  useEffect(() => {
    setSelectedBadges(value || []);
  }, [value]);

  return (
    <div
      className={clsx({
        "multi-select-with-chip": true,
        "multi-select-with-chip--disabled": Boolean(disabled),
        [className]: Boolean(className),
      })}
      aria-expanded={Boolean(searchBarAnchorRef)}
    >
      <CInputWithChip
        disabled={disabled}
        label={label}
        isInLineLabel={isInLineLabel}
        searchText={inputValue}
        selectedItems={selectedBadges}
        onDelete={handleOnDelete}
        onChange={handleInputChange}
        inputPlacement={inputPlacement}
        onClick={handleOnInputClick}
        width={inputWidth}
        placeholder={placeholder}
        isInputVisible={isInputVisible}
        error={error}
        helperText={helperText}
        startIcon={inputStartIcon}
        endIcon={inputEndIcon}
        hideEndIcon={hideInputEndIcon}
        renderInputChipLabel={handleRenderInputChipLabel}
      />

      {searchBarAnchorRef && ( // to complete the anchor ref from dom for nested menus
        <CNestedMenu
          anchorEl={searchBarAnchorRef}
          onClose={handleMenuClose}
          menuItems={options}
          showSearch
          onSelect={handleChange}
          selectedItems={selectedBadges}
          menuWidth={menuWidth}
          menuHeight={menuHeight}
        />
      )}
    </div>
  );
};

export default CMultiSelectWithChip;
