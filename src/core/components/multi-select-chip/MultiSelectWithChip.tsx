import type { PopoverProps, TextFieldProps } from "@mui/material";

import type { NestedMenuItem } from "@/core/components/nested-menu/types/index";
import CInputWithChip from "@/core/components/input-chip/InputWithChip";
import CNestedMenu from "@/core/components/nested-menu/NestedMenu";

type MultiSelectWithChipProps = {
  isSelectIconShown?: boolean;
  anchorEl: HTMLElement | null;
  menuItems: NestedMenuItem[];
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  searchText: string;
  selectedItems: NestedMenuItem[];
  onDelete: (
    event: React.MouseEvent<HTMLElement>,
    item: NestedMenuItem
  ) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onMenuItemSelect: (item: NestedMenuItem, path?: string) => void;
  width?: number | string;
  inputPlacement?: "start" | "end";
  className?: string;
  [key: string]: unknown;
  isInputVisible?: boolean;
  slotProps?: {
    textField?: Partial<TextFieldProps>;
    popover?: Partial<PopoverProps>;
  };
};

/**
 * @method CMultiSelectWithChipProps
 * @description Renders a multi-select component with chip display and nested menu popup
 * @param {boolean} isSelectIconShown - Whether to show the select dropdown icon (default: true)
 * @param {HTMLElement | null} anchorEl - The anchor element for positioning the menu
 * @param {NestedMenuItem[]} menuItems - Array of menu items to display
 * @param {function} onMenuOpen - Callback function when menu is opened
 * @param {function} onMenuClose - Callback function when menu is closed
 * @param {NestedMenuItem[]} initialSelectedItems - Initial array of selected items (default: [])
 * @return {React.ReactNode} A multi-select component with chip display
 */
const CMultiSelectWithChip: React.FC<MultiSelectWithChipProps> = ({
  anchorEl,
  menuItems = [],
  onMenuOpen,
  searchText,
  selectedItems,
  inputPlacement,
  onDelete,
  onChange,
  placeholder,
  onMenuClose,
  onMenuItemSelect,
  width,
  isInputVisible,
  slotProps,
  className,
  ...props
}) => {
  return (
    <div>
      <CInputWithChip
        searchText={searchText}
        selectedItems={selectedItems}
        onDelete={onDelete}
        onChange={onChange}
        inputPlacement={inputPlacement}
        anchorEl={anchorEl}
        onMenuOpen={onMenuOpen}
        width={width}
        placeholder={placeholder}
        isInputVisible={isInputVisible}
      />

      <CNestedMenu
        anchorEl={anchorEl}
        onClose={onMenuClose}
        menuItems={menuItems}
        showSearch
        onMenuItemSelect={onMenuItemSelect}
        selectedItems={selectedItems}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={slotProps}
        className={className}
        {...props}
      />
    </div>
  );
};

export default CMultiSelectWithChip;
