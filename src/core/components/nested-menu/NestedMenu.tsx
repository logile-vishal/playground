import React, { useState, useMemo, useEffect } from "react";
import { Menu, TextField } from "@mui/material";
import type { TextFieldProps, PopoverProps } from "@mui/material";

import { NESTED_MENU_PATH_DELIMITER } from "@/core/constants/nested-menu";
import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";

import "./NestedMenu.scss";
import type { NestedMenuItem, PopupPosition } from "./types";
import { NESTED_MENU } from "./constants";
import CNestedMenuItem from "./components/NestedMenuItem";

type NestedMenuProps = {
  anchorEl: HTMLElement | null;
  onClose: (event?: React.MouseEvent<HTMLElement>) => void;
  menuItems: NestedMenuItem[];
  level?: number;
  showSearch?: boolean;
  selectedItems?: NestedMenuItem[];
  onMenuItemSelect?: (item: NestedMenuItem, fullPath: string) => void;
  keepMounted?: boolean;
  className?: string;
  minMenuWidth?: string | number;
  slotProps?: {
    textField?: Partial<TextFieldProps>;
    popover?: Partial<PopoverProps>;
  };
  customMenuWidth?: number | string;
  parentPath?: string[];
  parentItem?: NestedMenuItem;
  subMenuPosition?: "left" | "right";
  anchorOrigin?: PopupPosition["anchorOrigin"];
  transformOrigin?: PopupPosition["transformOrigin"];
  onClick?: (e: React.MouseEvent<HTMLElement>, item: NestedMenuItem) => void;
  onSubmenuClick?: (
    e: React.MouseEvent<HTMLElement>,
    item: NestedMenuItem
  ) => void;
};

/**
 * @method flattenMenuItems
 * @param {NestedMenuItem[]} menuItems
 * @param {string[]} parentPath
 * @summary Flattens the nested menu items into a single array for search functionality
 * @description
 * Recursively traverses nested menu items and returns a flat array.
 * Each item is added with:
 * - 'fullPath': A string like "Parent > Child > Subchild"
 * - 'pathArray': An array representing the hierarchy path
 * @return {NestedMenuItem[]} Flattened array of menu items
 */
const flattenMenuItems = (
  menuItems: NestedMenuItem[],
  parentPath: string[]
) => {
  if (!Array.isArray(parentPath)) parentPath = [];
  return menuItems.flatMap((item) => {
    const currentPath = [...parentPath, item.name];
    const base = {
      ...item,
      fullPath: currentPath.join(NESTED_MENU_PATH_DELIMITER),
      pathArray: currentPath,
    };
    const children =
      Array.isArray(item.subMenu?.items) && item.subMenu?.items.length > 0
        ? flattenMenuItems(item.subMenu?.items, currentPath)
        : [];
    return [base, ...children];
  });
};
/**
 * @function filterMenuItems
 * @param {NestedMenuItem[]} flattenedItems - List of menu items that have already been flattened.
 * @param {string} searchTerm - The text used to filter menu item names.
 *
 * @summary Filters flattened menu items based on a search term.
 * @description
 * Takes an already flattened list of menu items and returns only those
 * whose 'name' property matches the provided search term (case-insensitive).
 * If the search term is empty or only whitespace, an empty array is returned.
 *
 * @returns {NestedMenuItem[]} Filtered list of menu items.
 */
const filterMenuItems = (flattenedItems, searchTerm: string) => {
  if (!searchTerm.trim()) return [];
  const term = searchTerm.trim().toLowerCase();
  return flattenedItems.filter((item) =>
    item.name.toLowerCase().includes(term)
  );
};

const CNestedMenu: React.FC<NestedMenuProps> = ({
  anchorEl,
  onClose,
  menuItems = [],
  level = 0,
  showSearch = false,
  selectedItems = [],
  keepMounted = true,
  className,
  slotProps = {},
  parentPath = [],
  parentItem,
  minMenuWidth = 200,
  subMenuPosition = "right",
  anchorOrigin,
  transformOrigin,
  onMenuItemSelect,
  onSubmenuClick,
  customMenuWidth,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (anchorEl && !isNonEmptyValue(customMenuWidth)) {
      const rect = anchorEl.getBoundingClientRect();
      setMenuWidth(rect.width);
    } else if (isNonEmptyValue(customMenuWidth)) {
      setMenuWidth(customMenuWidth as number);
    }
  }, [anchorEl, customMenuWidth]);

  const flattenedItems = useMemo(
    () => flattenMenuItems(menuItems, parentPath),
    [menuItems, parentPath]
  );

  /**
   * @method filteredFlatItems
   * @description Filters the flattened menu items based on the search term
   * @return {NestedMenuItem[]} Filtered array of menu items
   */
  const filteredFlatItems = useMemo(
    () => filterMenuItems(flattenedItems, searchTerm),
    [searchTerm, flattenedItems]
  );

  /**
   * @method handleItemClick
   * @description Handles click events on menu items, triggering selection or submenu opening
   * @param {React.MouseEvent<HTMLElement>} e - The click event
   * @param {NestedMenuItem} item - The clicked menu item
   * @param {string[]} currentPath - The path array of the clicked item
   * @summary
   * - Stops event propagation to prevent unwanted side effects
   * - Checks if the clicked item has nested submenus or custom submenus
   * - If not, invokes the onMenuItemSelect callback with the item and its full path
   * @return {void}
   */
  const handleItemClick = (
    e: React.MouseEvent<HTMLElement>,
    item: NestedMenuItem,
    currentPath: string[]
  ) => {
    e?.stopPropagation();
    const hasNested =
      Array.isArray(item.subMenu?.items) && item.subMenu?.items.length > 0;
    const hasCustom = isNonEmptyValue(item.customSubMenu);
    if (!hasNested && !hasCustom) {
      // trigger onMenuItemSelect only if the clicked item doesn't have a child menu
      onMenuItemSelect(item, currentPath.join(NESTED_MENU_PATH_DELIMITER));
    }
  };

  /**
   * @method handlefilterChange
   * @description Updates the search term state and resets active menu item
   * @param event - Change event for search input
   * @summary Updates the search term state and resets active menu item
   */
  const handlefilterChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    event.stopPropagation();
    setSearchTerm(event.target.value);
  };

  const handleCloseAll = () => {
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleCloseAll}
      transitionDuration={0}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      elevation={0}
      slotProps={{
        paper: {
          style: {
            width: menuWidth,
            minWidth: minMenuWidth,
          },
        },
      }}
      className={clsx({
        "nested-menu": true,
        [className || ""]: !!className,
      })}
      keepMounted={keepMounted}
    >
      {/* Search Field */}
      {level === 0 && showSearch && (
        <div
          className="nested-menu__filter"
          onKeyDown={(e) => e.stopPropagation()}
        >
          <TextField
            placeholder={NESTED_MENU.searchPlaceholder}
            size="small"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handlefilterChange}
            onClick={(e) => e.stopPropagation()}
            {...slotProps.textField}
          />
        </div>
      )}

      {/* Parent heading in submenu if parentAsItem is true */}
      {level > 0 && parentItem?.parentAsItem && parentPath.length > 0 && (
        <div className="nested-menu__submenu-header">
          <CNestedMenuItem
            menuItemData={{
              name: parentPath[parentPath.length - 1],
              value: parentPath[parentPath.length - 1],
            }}
            key={`parent-header-${level}`}
            searchTerm={searchTerm}
            onMenuItemClick={(e) =>
              handleItemClick(
                e,
                {
                  name: parentPath[parentPath.length - 1],
                  value: parentPath[parentPath.length - 1],
                },
                parentPath
              )
            }
            subMenuPosition={subMenuPosition}
            selectedItems={selectedItems}
            parentPath={parentPath.slice(0, -1)} // keep parent path correct
            keepMounted={keepMounted}
            level={level + 1}
            onSelect={onMenuItemSelect}
            onClose={handleCloseAll}
          />
        </div>
      )}

      {/* Render items */}
      {(searchTerm ? filteredFlatItems : menuItems).map((item, index) => {
        const key = `menu-item-${level}-${index}-${item.value || item.name}`;
        return (
          <CNestedMenuItem
            menuItemData={item}
            key={key}
            searchTerm={searchTerm}
            onMenuItemClick={handleItemClick}
            subMenuPosition={subMenuPosition}
            selectedItems={selectedItems}
            parentPath={parentPath}
            keepMounted={keepMounted}
            level={level + 1}
            onSelect={onMenuItemSelect}
            onClose={handleCloseAll}
            onSubmenuClick={onSubmenuClick}
          />
        );
      })}
    </Menu>
  );
};

export default CNestedMenu;
