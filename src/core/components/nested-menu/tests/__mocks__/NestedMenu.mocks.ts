import { vi } from "vitest";
import type { NestedMenuItem } from "../../types";
import type { NestedMenuProps } from "../../NestedMenu";

export const mockMenuItem: NestedMenuItem = {
  name: "Item 1",
  value: "item-1",
};

export const mockMenuItemWithSubMenu: NestedMenuItem = {
  name: "Parent Item",
  value: "parent-item",
  subMenu: {
    items: [
      {
        name: "Child Item 1",
        value: "child-item-1",
      },
      {
        name: "Child Item 2",
        value: "child-item-2",
      },
    ],
  },
};

export const mockNestedMenuItems: NestedMenuItem[] = [
  {
    name: "Menu Item 1",
    value: "menu-1",
  },
  {
    name: "Menu Item 2",
    value: "menu-2",
    subMenu: {
      items: [
        {
          name: "Sub Item 1",
          value: "sub-1",
        },
        {
          name: "Sub Item 2",
          value: "sub-2",
          subMenu: {
            items: [
              {
                name: "Nested Sub Item 1",
                value: "nested-sub-1",
              },
            ],
          },
        },
      ],
    },
  },
  {
    name: "Menu Item 3",
    value: "menu-3",
  },
];

export const mockMenuItemWithCustomSubMenu: NestedMenuItem = {
  name: "Custom Parent",
  value: "custom-parent",
  customSubMenu: "Custom Sub Menu Content",
};

export const mockMenuItemWithParentAsItem: NestedMenuItem = {
  name: "Parent As Item",
  value: "parent-as-item",
  parentAsItem: true,
  subMenu: {
    items: [
      {
        name: "Child With Parent Header",
        value: "child-with-parent",
      },
    ],
  },
};

export const mockSelectedItems: NestedMenuItem[] = [
  {
    name: "Menu Item 1",
    value: "menu-1",
  },
];

export const mockAnchorEl = document.createElement("div");

export const mockOnClose = vi.fn();
export const mockOnMenuItemSelect = vi.fn();
export const mockOnClick = vi.fn();
export const mockOnSubmenuClick = vi.fn();

export const mockNestedMenuPropsBase: Omit<NestedMenuProps, "anchorEl"> = {
  onClose: mockOnClose,
  menuItems: mockNestedMenuItems,
  level: 0,
  showSearch: false,
  selectedItems: [],
  onMenuItemSelect: mockOnMenuItemSelect,
  keepMounted: true,
  minMenuWidth: 200,
  subMenuPosition: "right",
  parentPath: [],
};

export const mockNestedMenuProps: NestedMenuProps = {
  anchorEl: mockAnchorEl,
  ...mockNestedMenuPropsBase,
};

export const mockNestedMenuPropsWithSearch: NestedMenuProps = {
  ...mockNestedMenuProps,
  showSearch: true,
};

export const mockNestedMenuPropsLevel1: NestedMenuProps = {
  ...mockNestedMenuProps,
  level: 1,
  parentPath: ["Parent Item"],
  parentItem: mockMenuItemWithParentAsItem,
};

export const mockTextFieldProps = {
  "data-testid": "search-field",
};

export const mockSlotProps = {
  textField: mockTextFieldProps,
};

export const resetAllMocks = () => {
  mockOnClose.mockReset();
  mockOnMenuItemSelect.mockReset();
  mockOnClick.mockReset();
  mockOnSubmenuClick.mockReset();
};
