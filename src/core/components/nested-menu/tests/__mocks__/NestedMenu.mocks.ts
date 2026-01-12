import { vi } from "vitest";
import type { NestedMenuItem } from "../../types";
import type { NestedMenuProps } from "../../NestedMenu";

export const mockMenuItem: NestedMenuItem = {
  label: "Item 1",
  value: "item-1",
};

export const mockMenuItemWithSubMenu: NestedMenuItem = {
  label: "Parent Item",
  value: "parent-item",
  subMenu: {
    items: [
      {
        label: "Child Item 1",
        value: "child-item-1",
      },
      {
        label: "Child Item 2",
        value: "child-item-2",
      },
    ],
  },
};

export const mockNestedMenuItems: NestedMenuItem[] = [
  {
    label: "Menu Item 1",
    value: "menu-1",
  },
  {
    label: "Menu Item 2",
    value: "menu-2",
    subMenu: {
      items: [
        {
          label: "Sub Item 1",
          value: "sub-1",
        },
        {
          label: "Sub Item 2",
          value: "sub-2",
          subMenu: {
            items: [
              {
                label: "Nested Sub Item 1",
                value: "nested-sub-1",
              },
            ],
          },
        },
      ],
    },
  },
  {
    label: "Menu Item 3",
    value: "menu-3",
  },
];

export const mockMenuItemWithCustomSubMenu: NestedMenuItem = {
  label: "Custom Parent",
  value: "custom-parent",
  customSubMenu: "Custom Sub Menu Content",
};

export const mockMenuItemWithParentAsItem: NestedMenuItem = {
  label: "Parent As Item",
  value: "parent-as-item",
  parentAsItem: true,
  subMenu: {
    items: [
      {
        label: "Child With Parent Header",
        value: "child-with-parent",
      },
    ],
  },
};

export const mockSelectedItems: NestedMenuItem[] = [
  {
    label: "Menu Item 1",
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
  menuWidth: 200,
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
