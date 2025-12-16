import { useMemo, useRef, useState } from "react";
import {
  MenuItem,
  type MenuItemProps,
  Popover,
  Typography,
} from "@mui/material";

import { ChevronRight } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import { NESTED_MENU_PATH_DELIMITER } from "@/core/constants/nested-menu";
import { isNonEmptyValue } from "@/utils";
import clsx from "@/utils/clsx";

import type { NestedMenuItem, PopupPosition } from "../types";
import CNestedMenu from "../NestedMenu";

type NestedMenuItemProps = {
  menuItemData: NestedMenuItem;
  level?: number;
  parentPath: string[];
  searchTerm: string;
  selectedItems: NestedMenuItem[];
  onMenuItemClick?: (
    e: React.MouseEvent<HTMLElement>,
    item: NestedMenuItem,
    pathArray: string[]
  ) => void;
  keepMounted?: boolean;
  subMenuPosition: "left" | "right";
  onSelect?: (item: NestedMenuItem, fullPath: string) => void;
  onClose: (event?: React.MouseEvent<HTMLElement>) => void;
  menuProps?: {
    onSelect?: (item: NestedMenuItem, fullPath: string) => void;
    onClose?: (event?: React.MouseEvent<HTMLElement>) => void;
  };
  closeAll?: () => void;
};

const CNestedMenuItem = ({
  menuItemData,
  subMenuPosition,
  onMenuItemClick,
  selectedItems,
  parentPath,
  searchTerm,
  keepMounted,
  level,
  onSelect,
  onClose,
}: NestedMenuItemProps) => {
  const [openSubMenu, setOpenSubMenu] = useState<boolean>(false);
  const menuItemAnchorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const hasCustomMenu = isNonEmptyValue(menuItemData.customSubMenu);
  const isNested =
    Array.isArray(menuItemData.subMenu) && menuItemData.subMenu.length > 0;

  const menuItemProps: Partial<MenuItemProps> =
    isNested || hasCustomMenu
      ? { component: "li", disableRipple: true }
      : { component: "li" };
  const currentPath = searchTerm
    ? menuItemData.pathArray
    : [...parentPath, menuItemData.name];

  const subMenuAnchorOrigin: PopupPosition["anchorOrigin"] = {
    vertical: "top" as const,
    horizontal: subMenuPosition,
  };

  const subMenuTransformOrigin: PopupPosition["transformOrigin"] = {
    vertical: "top" as const,
    horizontal: subMenuPosition == "left" ? "right" : "left",
  };

  /**
   * @method handleOnClick
   * @description Handles click event on menu item
   * @param e React.MouseEvent<HTMLElement>
   * @summary
   * - Toggles submenu for nested items or custom menus
   * - gets the current path of the menu item
   * - invokes onMenuItemClick callback which handles the click event on parent component
   * - Invokes onSelect callback for leaf items
   * - Sets focus state for nested items or custom menus
   */
  const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsFocused((prev) => !prev);

    const currentPath = [...parentPath, menuItemData.name];
    if (!menuItemData.subMenu && !menuItemData.customSubMenu) {
      setOpenSubMenu(false);
      setIsFocused(false);
      onSelect?.(menuItemData, currentPath.join(NESTED_MENU_PATH_DELIMITER));
    }
    onMenuItemClick(e, menuItemData, currentPath);
    if (hasCustomMenu || isNested) {
      setIsFocused(true);
      setOpenSubMenu((prev) => !prev);
    } else {
      onClose();
    }
  };

  const handleOnClose = (e) => {
    e?.stopPropagation();
    onClose?.();
    setOpenSubMenu(false);
    setIsFocused(false);
  };

  const isSelected = useMemo(
    () => selectedItems.some((s) => s.value === menuItemData.value),
    [selectedItems, menuItemData]
  );
  const handleKeyDown = (e) => {
    e.stopPropagation();
  };

  return (
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
        <div className="nested-menu__item-content">
          {menuItemData.leftIcon && (
            <div className="nested-menu__item-content-left-icon">
              <CSvgIcon
                component={menuItemData.leftIcon}
                color={menuItemData.leftIconStyleProps?.color ?? "secondary"}
                size={18}
              />
            </div>
          )}
          <div
            className={clsx({
              "nested-menu__item-content-label": true,
            })}
            style={menuItemData.labelStyleProps}
          >
            <Typography>{menuItemData.name}</Typography>
            {searchTerm && (
              <div className="nested-menu__item-path">
                {currentPath.join(NESTED_MENU_PATH_DELIMITER)}
              </div>
            )}
          </div>
          {(isNested || hasCustomMenu) && (
            <div className="nested-menu__item-chevron">
              <CSvgIcon
                component={ChevronRight}
                color={menuItemData.rightIconStyleProps?.color ?? "secondary"}
                size={18}
              />
            </div>
          )}
        </div>
      </div>

      {/* Recursive submenus */}
      {isNested && openSubMenu && (
        <CNestedMenu
          anchorEl={menuItemAnchorRef.current}
          onClose={handleOnClose}
          menuItems={menuItemData.subMenu!}
          level={level + 1}
          anchorOrigin={subMenuAnchorOrigin}
          transformOrigin={subMenuTransformOrigin}
          showSearch={false}
          keepMounted={keepMounted}
          selectedItems={selectedItems}
          parentPath={currentPath}
          parentItem={menuItemData}
          subMenuPosition={subMenuPosition}
          onMenuItemSelect={onSelect}
          onClick={handleOnClick}
        />
      )}

      {hasCustomMenu && openSubMenu && (
        <Popover
          open
          elevation={0}
          className="nested-menu__custom-popover"
          anchorEl={menuItemAnchorRef.current}
          onClose={handleOnClose}
          anchorOrigin={subMenuAnchorOrigin}
          transformOrigin={subMenuTransformOrigin}
          keepMounted={keepMounted}
          onClick={(e) => e.stopPropagation()}
        >
          {menuItemData.customSubMenu}
        </Popover>
      )}
    </MenuItem>
  );
};
export default CNestedMenuItem;
