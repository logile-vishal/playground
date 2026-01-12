import { useMemo, useRef, useState } from "react";
import { MenuItem, type MenuItemProps, Typography } from "@mui/material";

import { ChevronRight } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import { isNonEmptyValue } from "@/utils";
import clsx from "@/utils/clsx";
import CPopper from "@/core/components/popper/Popper";

import type {
  MenuItemTemplateContext,
  MenuItemTemplates,
  NestedMenuItem,
} from "../types";
import CNestedMenu from "../NestedMenu";

export type NestedMenuItemProps = {
  menuItemData: NestedMenuItem;
  level?: number;
  searchTerm: string;
  selectedItems: NestedMenuItem[];
  onSelect?: (menuItem: NestedMenuItem) => void;
  parentPath?: string[];
  subMenuPosition?: "left" | "right";
  onMenuItemClick?: (
    e: React.MouseEvent<HTMLElement>,
    item: NestedMenuItem,
    pathArray: string[]
  ) => void;
  keepMounted?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>, item: NestedMenuItem) => void;
  onClose: (event?: MouseEvent | TouchEvent) => void;
  menuProps?: {
    onClick?: (item: NestedMenuItem) => void;
    onClose?: (event?: MouseEvent | TouchEvent) => void;
    onSelect?: (item: NestedMenuItem) => void;
  };
  closeAll?: () => void;
  onSubmenuClick?: (
    e: React.MouseEvent<HTMLElement>,
    item: NestedMenuItem
  ) => void;
  templates?: MenuItemTemplates;
  activeSubmenuId?: string | null;
  onSubmenuToggle?: (itemId: string) => void;
  subMenuId?: string;
};

const CNestedMenuItem = ({
  menuItemData,
  selectedItems,
  searchTerm,
  keepMounted,
  level = 0,
  onClick,
  onClose,
  templates,
  activeSubmenuId,
  onSubmenuToggle,
  subMenuId,
}: NestedMenuItemProps) => {
  const menuItemAnchorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const hasCustomMenu = isNonEmptyValue(menuItemData.customSubMenu);
  const isNested =
    Array.isArray(menuItemData?.subMenu?.items) &&
    menuItemData?.subMenu.items.length > 0;

  const isSubmenuOpen = activeSubmenuId === subMenuId;

  const menuItemProps: Partial<MenuItemProps> =
    isNested || hasCustomMenu
      ? { component: "li", disableRipple: true }
      : { component: "li" };

  const handleCloseSubmenu = () => {
    onSubmenuToggle?.(subMenuId);
    menuItemAnchorRef.current = null;
  };
  const handleOpenSubMenu = (e) => {
    onSubmenuToggle?.(subMenuId);
    menuItemAnchorRef.current = e.currentTarget;
  };
  /**
   * @method handleOnClick
   * @description Handles click event on menu item
   * @param {React.MouseEvent<HTMLElement>} e - The click event
   * @summary
   * - Stops event propagation to prevent unwanted side effects
   * - Toggles submenu for nested items or custom menus
   * - Sets focus state for items with submenus
   * - Invokes onClick callback for leaf items (items without submenus)
   * - Closes the menu when a leaf item is selected
   * @returns {void}
   */

  const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (hasCustomMenu || isNested) {
      handleOpenSubMenu(e);
      // Toggle submenu for items with submenus
      setIsFocused(!isSubmenuOpen);
      return;
    }
    onClose?.();
    handleCloseSubmenu();
    setIsFocused(false);
    onClick(e, menuItemData);
  };

  /**
   * @method handleOnClose
   * @description Handles closing of submenu and resets component state
   * @param {React.MouseEvent<HTMLElement>} e - The close event
   * @summary
   * - Stops event propagation to prevent unwanted side effects
   * - Resets the isFocused state to remove focus styling
   * - Calls the onSubmenuClose callback to close all submenus
   * @returns {void}
   */
  const handleOnClose = (e: TouchEvent | MouseEvent) => {
    e?.stopPropagation();
    handleCloseSubmenu();
    setIsFocused(false);
  };

  /**
   * @const isSelected
   * @description Memoized computation that checks if the current menu item is selected
   * @returns {boolean} True if the menu item is in the selectedItems array
   * @summary Compares the menu item value with selected items to determine selection state
   */
  const isSelected = useMemo(
    () => selectedItems.some((s) => s.value === menuItemData.value),
    [selectedItems, menuItemData]
  );

  /**
   * @const templateContext
   * @description Memoized context object passed to template functions for custom rendering
   * @returns {MenuItemTemplateContext} Context containing item state and metadata
   */
  const templateContext: MenuItemTemplateContext = useMemo(
    () => ({
      item: menuItemData,
      isSelected,
      isFocused,
      isNested,
      hasCustomMenu,
      level,
    }),
    [menuItemData, isSelected, isFocused, isNested, hasCustomMenu, level]
  );

  /**
   * @method handleKeyDown
   * @description Handles keyboard events on the menu item
   * @param {React.KeyboardEvent} e - The keyboard event
   * @summary Stops event propagation to prevent unwanted side effects
   * @returns {void}
   */
  const handleKeyDown = (e) => {
    e.stopPropagation();
  };
  const subMenuAnchor = isSubmenuOpen ? menuItemAnchorRef.current : null;

  return (
    <>
      <MenuItem
        className={"nested-menu__item"}
        {...(menuItemProps as MenuItemProps)}
        ref={menuItemAnchorRef}
        onClick={handleOnClick}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div
          className={clsx({
            "nested-menu__item-content-wrapper": true,
            "nested-menu__item-content-wrapper--focused": isFocused,
            "nested-menu__item-content-wrapper--selected": isSelected,
          })}
        >
          {/* Check if itemTemplate is provided */}
          {templates?.itemTemplate ? (
            templates.itemTemplate(templateContext)
          ) : (
            <div className="nested-menu__item-content">
              {templates?.leftIconTemplate
                ? templates.leftIconTemplate(templateContext)
                : menuItemData.leftIcon && (
                    <div className="nested-menu__item-content-left-icon">
                      <CSvgIcon
                        component={menuItemData.leftIcon}
                        color={
                          menuItemData.leftIconStyleProps?.color ?? "secondary"
                        }
                        size={18}
                      />
                    </div>
                  )}
              {templates?.labelTemplate ? (
                templates.labelTemplate(templateContext)
              ) : (
                <div
                  className={clsx({
                    "nested-menu__item-content-label": true,
                  })}
                  style={menuItemData.labelStyleProps}
                >
                  <Typography>{menuItemData.label}</Typography>
                  {menuItemData.filterPath && searchTerm && (
                    <div className="nested-menu__item-path">
                      {menuItemData.filterPath}
                    </div>
                  )}
                </div>
              )}
              {templates?.rightIconTemplate
                ? templates.rightIconTemplate(templateContext)
                : (isNested || hasCustomMenu) && (
                    <div className="nested-menu__item-chevron">
                      <CSvgIcon
                        component={ChevronRight}
                        color={
                          menuItemData.rightIconStyleProps?.color ?? "secondary"
                        }
                        size={18}
                      />
                    </div>
                  )}
            </div>
          )}
        </div>

        {/* Recursive submenus */}
        {isNested && isSubmenuOpen && (
          <CNestedMenu
            anchorEl={subMenuAnchor}
            onClose={handleOnClose}
            menuItems={menuItemData.subMenu.items}
            level={level + 1}
            showSearch={false}
            keepMounted={keepMounted}
            selectedItems={selectedItems}
            parentItem={menuItemData}
            menuWidth={menuItemData.subMenu.width}
            onClick={(...args) => {
              onClick?.(...args);
              if (menuItemData.subMenu.onClick) {
                menuItemData.subMenu.onClick(...args); // callback provided in subMenu data eg: {menuItems: [], onClick: () => {}
              }
            }}
          />
        )}

        {hasCustomMenu && isSubmenuOpen && (
          <CPopper
            anchorEl={menuItemAnchorRef.current}
            open={isSubmenuOpen}
            onClose={handleOnClose}
          >
            {menuItemData.customSubMenu}
          </CPopper>
        )}
      </MenuItem>
    </>
  );
};
export default CNestedMenuItem;
