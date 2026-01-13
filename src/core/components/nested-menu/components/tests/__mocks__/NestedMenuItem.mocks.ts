import { vi } from "vitest";
import type { NestedMenuItem } from "../../../types";
import React from "react";

export const mockLeafMenuItem: NestedMenuItem = {
  label: "Leaf Item",
  value: "leaf-item",
  filterPath: "root > leaf-item",
};

export const mockMenuItemWithLeftIcon: NestedMenuItem = {
  label: "Item with Icon",
  value: "item-icon",
  filterPath: "root > item-icon",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leftIcon: vi.fn(() => null) as any,
  leftIconStyleProps: {
    color: "primary",
  },
};

export const mockNestedMenuItem: NestedMenuItem = {
  label: "Nested Item",
  value: "nested-item",
  filterPath: "root > nested-item",
  subMenu: {
    items: [
      {
        label: "Sub Item 1",
        value: "sub-item-1",
        filterPath: "root > nested-item > sub-item-1",
      },
      {
        label: "Sub Item 2",
        value: "sub-item-2",
        filterPath: "root > nested-item > sub-item-2",
      },
    ],
    onClick: vi.fn(),
  },
  rightIconStyleProps: {
    color: "secondary",
  },
};

export const mockCustomSubMenuItem: NestedMenuItem = {
  label: "Custom Menu Item",
  value: "custom-menu",
  filterPath: "root > custom-menu",
  customSubMenu: React.createElement(
    "div",
    { "data-testid": "custom-submenu" },
    "Custom Content"
  ),
};

export const mockSelectedMenuItem: NestedMenuItem = {
  label: "Selected Item",
  value: "selected-item",
  filterPath: "root > selected-item",
};

export const mockMenuItemWithStyles: NestedMenuItem = {
  label: "Styled Item",
  value: "styled-item",
  filterPath: "root > styled-item",
  labelStyleProps: {
    color: "red",
    fontWeight: "bold",
  },
};

export const mockOnMenuItemClick = vi.fn();
export const mockOnSelect = vi.fn();
export const mockOnClose = vi.fn();
export const mockOnSubmenuClick = vi.fn();
export const mockOnClick = vi.fn();
export const mockOnSubmenuToggle = vi.fn();

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
  onClick: mockOnClick,
  onSubmenuToggle: mockOnSubmenuToggle,
  subMenuId: "submenu-1",
  activeSubmenuId: null as string | null,
};

export const resetAllMocks = () => {
  mockOnMenuItemClick.mockReset();
  mockOnSelect.mockReset();
  mockOnClose.mockReset();
  mockOnSubmenuClick.mockReset();
  mockOnClick.mockReset();
  mockOnSubmenuToggle.mockReset();
  if (mockNestedMenuItem.subMenu?.onClick) {
    (
      mockNestedMenuItem.subMenu.onClick as ReturnType<typeof vi.fn>
    ).mockReset();
  }
};
