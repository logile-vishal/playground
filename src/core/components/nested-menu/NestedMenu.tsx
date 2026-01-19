import React, { useState, useMemo, useEffect } from "react";
import { type PopperPlacementType } from "@mui/material";
import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";
import { Search } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import { NESTED_MENU_PATH_DELIMITER } from "@/core/constants/nested-menu";

import "./NestedMenu.scss";
import type { MenuItemTemplates, NestedMenuItem } from "./types";
import { NESTED_MENU } from "./constants";
import CNestedMenuItem from "./components/NestedMenuItem";
import CTextfield from "../form/textfield/Textfield";
import CPopper from "../popper/Popper";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";

export type NestedMenuProps = {
  anchorEl: HTMLElement | null;
  onClose: (event?: MouseEvent | TouchEvent) => void;
  menuItems: NestedMenuItem[];
  level?: number;
  showSearch?: boolean;
  selectedItems?: NestedMenuItem[];
  keepMounted?: boolean;
  className?: string;
  parentItem?: NestedMenuItem;

  onClick?: (e: React.MouseEvent<HTMLElement>, item: NestedMenuItem) => void;
  onSelect?: (menuItem: NestedMenuItem) => void;
  menuWidth?: number | string;
  menuHeight?: number | string;
  templates?: MenuItemTemplates;
  menuPlacement?: PopperPlacementType;
};

/**
 * @function flattenMenuItems
 * @param {NestedMenuItem[]} menuItems - Array of nested menu items to flatten
 * @returns {NestedMenuItem[]} Flattened array of menu items with all nested items at the same level
 * @description
 * Recursively traverses nested menu items and returns a flat array for search functionality.
 * This function extracts all items from their hierarchical structure while preserving
 * their original properties. Useful for implementing search across all menu levels.
 */
const flattenMenuItems = (menuItems: NestedMenuItem[]) => {
  return menuItems.flatMap((item) => {
    const base = {
      ...item,
    };
    const children =
      Array.isArray(item.subMenu?.items) && item.subMenu?.items.length > 0
        ? flattenMenuItems(item.subMenu.items)
        : [];
    return [base, ...children];
  });
};
/**
 * @function filterMenuItems
 * @param {NestedMenuItem[]} flattenedItems - List of menu items that have already been flattened
 * @param {string} searchTerm - The text used to filter menu item names
 * @returns {NestedMenuItem[]} Filtered list of menu items that match the search term
 * @description
 * Takes an already flattened list of menu items and returns only those
 * whose 'label' property matches the provided search term (case-insensitive).
 * If the search term is empty or only whitespace, an empty array is returned.
 * This function performs a substring match on the item's label.
 */
const filterMenuItems = (flattenedItems, searchTerm: string) => {
  if (!searchTerm.trim()) return [];
  const term = searchTerm.trim()?.toLowerCase();
  return flattenedItems.filter((item) =>
    item.label.toLowerCase().includes(term)
  );
};
/**
 * @function addFilterPath
 * @param {NestedMenuItem[]} menuItems - Array of menu items to process
 * @param {string[]} parentPath - Array representing the current hierarchical path
 * @returns {NestedMenuItem[]} Menu items with filterPath property added
 * @description
 * Recursively adds a 'filterPath' property to each menu item that represents
 * the full hierarchical path as a string (e.g., "Parent > Child > Item").
 * If an item already has a filterPath, it's preserved. For nested items,
 * the function recursively processes sub-menu items with an extended path.
 */
const addFilterPath = (
  menuItems: NestedMenuItem[],
  parentPath: string[] = []
): NestedMenuItem[] => {
  return menuItems.map((item) => {
    if (item.filterPath) {
      return item;
    }
    const newItem = { ...item };
    if (
      Array.isArray(newItem.subMenu?.items) &&
      newItem.subMenu?.items?.length > 0
    ) {
      newItem.subMenu.items = addFilterPath(newItem.subMenu?.items ?? [], [
        ...parentPath,
        newItem.label,
      ]);
    }
    newItem.filterPath = [...parentPath, newItem.label].join(
      NESTED_MENU_PATH_DELIMITER
    );
    return newItem;
  });
};

const CNestedMenu: React.FC<NestedMenuProps> = ({
  anchorEl,
  onClose,
  menuItems: providedMenuItems = [],
  level = 0,
  showSearch = false,
  selectedItems = [],
  keepMounted = true,
  className,
  parentItem,
  onSelect,
  onClick,
  menuWidth: providedMenuWidth,
  menuHeight,
  templates,
  menuPlacement,
}) => {
  const { NESTED_MENU: NESTED_MENU_TRANSLATIONS } = useCommonTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuWidth, setMenuWidth] = useState<number | string | undefined>(
    undefined
  );
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null);

  /**
   * @method updateMenuWidth
   * @description Updates menu width based on anchor element or custom width
   * @param {HTMLElement | null} anchorEl - Anchor element reference
   * @param {number | string | undefined} providedMenuWidth - Custom width override
   * @summary
   * - If level > 0, sets menuWidth to "max-content" - apply to main menu only
   * - If providedMenuWidth is provided, sets menuWidth to that value
   * - Otherwise, calculates width from anchorEl's bounding rectangle
   * - Runs whenever anchorEl or providedMenuWidth changes
   * @returns {void}
   */
  const updateMenuWidth = () => {
    if (providedMenuWidth) {
      setMenuWidth(providedMenuWidth);
      return;
    }
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setMenuWidth(rect.width);
      return;
    }
  };

  /**
   * @method handleMenuItemClick
   * @description Handles click events on menu items, triggering selection or submenu opening
   * @param {React.MouseEvent<HTMLElement>} e - The click event
   * @param {NestedMenuItem} item - The clicked menu item
   * @summary
   * - Stops event propagation to prevent unwanted side effects
   * - Checks if the clicked item has nested submenus or custom submenus
   * - If not, invokes the onSelect callback with the item
   * @returns {void}
   */
  const handleMenuItemClick = (
    e: React.MouseEvent<HTMLElement>,
    item: NestedMenuItem
  ) => {
    e?.stopPropagation();
    onClick?.(e, item);
    const hasNested =
      Array.isArray(item.subMenu?.items) && item.subMenu.items.length > 0;
    const hasCustom = isNonEmptyValue(item.customSubMenu);
    if (hasNested || hasCustom) {
      return;
    }
    // trigger onSelect only if the clicked item doesn't have a child menu
    onSelect?.(item);
  };

  /**
   * @method handleSubmenuToggle
   * @description Handles opening/closing of submenus, ensuring only one submenu is open at a time
   * @param {string} itemId - The unique identifier of the menu item
   * @summary
   * - If the clicked submenu is already active, closes it
   * - Otherwise, closes any active submenu and opens the new one
   * @returns {void}
   */
  const handleSubmenuToggle = (itemId: string) => {
    setActiveSubmenuId((prevId) => (prevId === itemId ? null : itemId));
  };

  /**
   * @method handlefilterChange
   * @description Updates the search term state when user types in the search input
   * @param {React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>} event - The input change event
   * @summary
   * - Stops event propagation to prevent unwanted side effects
   * - Updates the searchTerm state with the new input value
   * - Triggers re-filtering of menu items through useMemo dependencies
   * @returns {void}
   */
  const handlefilterChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    event.stopPropagation();
    setSearchTerm(event.target.value);
  };

  /**
   * @constant menuItems
   * @description Memoized computation that includes filter paths to provided menu items
   * @returns {NestedMenuItem[]} Menu items enhanced with filter paths for search functionality
   * @summary Processes the provided menu items to add hierarchical filter paths
   */
  const menuItems = useMemo(
    () => addFilterPath(providedMenuItems),
    [providedMenuItems]
  );

  /**
   * @constant flattenedItems
   * @description Memoized computation of the flattened nested menu structure
   * @returns {NestedMenuItem[]} Flattened array of all menu items for efficient searching
   * @summary Converts the nested menu structure into a flat array for search operations
   */
  const flattenedItems = useMemo(
    () => flattenMenuItems(menuItems),
    [menuItems]
  );

  /**
   * @ignore filteredFlatItems
   * @description Memoized computation of filtered flattened items based on search term
   * @returns {NestedMenuItem[]} Filtered array of menu items matching the search criteria
   * @summary Applies search filtering to the flattened menu items
   */
  const filteredFlatItems = useMemo(
    () => filterMenuItems(flattenedItems, searchTerm),
    [searchTerm, flattenedItems]
  );
  const popperPlacement =
    level === 0 ? (menuPlacement ?? "bottom-start") : undefined;
  useEffect(updateMenuWidth, [anchorEl, providedMenuWidth]);

  return (
    <CPopper
      onClose={onClose}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      placement={popperPlacement}
      className={clsx({
        "nested-menu": true,
        [className || ""]: !!className,
      })}
      sx={{
        width: menuWidth || NESTED_MENU.defaultMenuWidth,
        maxHeight: menuHeight || NESTED_MENU.defaultMenuHeight,
      }}
    >
      {/* Search Field */}
      {level === 0 && showSearch && (
        <div
          className="nested-menu__filter"
          onKeyDown={(e) => e.stopPropagation()}
        >
          <CTextfield
            placeholder={NESTED_MENU_TRANSLATIONS.filterPlaceholder}
            fullWidth
            value={searchTerm}
            onChange={handlefilterChange}
            onClick={(e) => e.stopPropagation()}
            startIcon={
              <CSvgIcon
                component={Search}
                size={18}
                color="secondary"
              />
            }
          />
        </div>
      )}

      {/* Parent heading in submenu if parentAsItem is true */}
      {level > 0 && parentItem?.parentAsItem && (
        <div className="nested-menu__submenu-header">
          <CNestedMenuItem
            menuItemData={{
              label: parentItem.label,
              value: parentItem.value,
              filterPath: parentItem.filterPath,
            }}
            key={`parent-header-${level}`}
            searchTerm={searchTerm}
            selectedItems={selectedItems}
            keepMounted={keepMounted}
            level={level + 1}
            onClose={onClose}
            onClick={handleMenuItemClick}
          />
        </div>
      )}

      {/* Render items */}
      {(searchTerm ? filteredFlatItems : menuItems).map((item, index) => {
        const subMenuId = `${item.value || item.name}-${level}-${index}`;
        const key = `menu-item-${level}-${index}-${item.value || item.name}`;
        return (
          <CNestedMenuItem
            menuItemData={item}
            key={key}
            searchTerm={searchTerm}
            selectedItems={selectedItems}
            keepMounted={keepMounted}
            level={level + 1}
            onClick={handleMenuItemClick}
            onClose={onClose}
            activeSubmenuId={activeSubmenuId}
            onSubmenuToggle={handleSubmenuToggle}
            subMenuId={subMenuId}
            templates={{
              itemTemplate: templates?.itemTemplate,
              labelTemplate: templates?.labelTemplate,
              leftIconTemplate: templates?.leftIconTemplate,
              rightIconTemplate: templates?.rightIconTemplate,
            }}
          />
        );
      })}
    </CPopper>
  );
};

export default CNestedMenu;
