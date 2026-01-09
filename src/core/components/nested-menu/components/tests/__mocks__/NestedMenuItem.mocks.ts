import { vi } from "vitest";
import type { NestedMenuItem } from "../../../types";
import React from "react";

export const mockLeafMenuItem: NestedMenuItem = {
  name: "Leaf Item",
  value: "leaf-item",
  pathArray: ["root", "leaf-item"],
};

export const mockMenuItemWithLeftIcon: NestedMenuItem = {
  name: "Item with Icon",
  value: "item-icon",
  pathArray: ["root", "item-icon"],
  leftIcon: vi.fn(() => null) as any,
  leftIconStyleProps: {
    color: "primary",
  },
};

export const mockNestedMenuItem: NestedMenuItem = {
  name: "Nested Item",
  value: "nested-item",
  pathArray: ["root", "nested-item"],
  subMenu: {
    items: [
      {
        name: "Sub Item 1",
        value: "sub-item-1",
        pathArray: ["root", "nested-item", "sub-item-1"],
      },
      {
        name: "Sub Item 2",
        value: "sub-item-2",
        pathArray: ["root", "nested-item", "sub-item-2"],
      },
    ],
    onClick: vi.fn(),
  },
  rightIconStyleProps: {
    color: "secondary",
  },
};

export const mockCustomSubMenuItem: NestedMenuItem = {
  name: "Custom Menu Item",
  value: "custom-menu",
  pathArray: ["root", "custom-menu"],
  customSubMenu: React.createElement(
    "div",
    { "data-testid": "custom-submenu" },
    "Custom Content"
  ),
};

export const mockSelectedMenuItem: NestedMenuItem = {
  name: "Selected Item",
  value: "selected-item",
  pathArray: ["root", "selected-item"],
};

export const mockMenuItemWithStyles: NestedMenuItem = {
  name: "Styled Item",
  value: "styled-item",
  pathArray: ["root", "styled-item"],
  labelStyleProps: {
    color: "red",
    fontWeight: "bold",
  },
};

export const mockOnMenuItemClick = vi.fn();
export const mockOnSelect = vi.fn();
export const mockOnClose = vi.fn();
export const mockOnSubmenuClick = vi.fn();

export const defaultProps = {
  menuItemData: mockLeafMenuItem,
  level: 1,
  parentPath: ["root"],
  searchTerm: "",
  selectedItems: [],
  onMenuItemClick: mockOnMenuItemClick,
  keepMounted: false,
  subMenuPosition: "right" as const,
  onSelect: mockOnSelect,
  onClose: mockOnClose,
};

export const resetAllMocks = () => {
  mockOnMenuItemClick.mockReset();
  mockOnSelect.mockReset();
  mockOnClose.mockReset();
  mockOnSubmenuClick.mockReset();
  if (mockNestedMenuItem.subMenu?.onClick) {
    (mockNestedMenuItem.subMenu.onClick as any).mockReset();
  }
};
