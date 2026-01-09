import { vi } from "vitest";
import type { NestedMenuItem } from "@/core/components/nested-menu/types/index";
import type { MultiSelectWithChipProps } from "../../MultiSelectWithChip";

export const mockOnMenuOpen = vi.fn();
export const mockOnMenuClose = vi.fn();
export const mockOnDelete = vi.fn();
export const mockOnChange = vi.fn();
export const mockOnMenuItemSelect = vi.fn();

export const mockMenuItems: NestedMenuItem[] = [
  {
    name: "Item 1",
    value: "item1",
    path: "Item 1",
  },
  {
    name: "Item 2",
    value: "item2",
    path: "Item 2",
    subMenu: {
      items: [
        {
          name: "Sub Item 2.1",
          value: "item2.1",
          path: "Item 2 > Sub Item 2.1",
        },
      ],
    },
  },
  {
    name: "Item 3",
    value: "item3",
    path: "Item 3",
  },
];

export const mockSelectedItems: NestedMenuItem[] = [
  {
    name: "Item 1",
    value: "item1",
    path: "Item 1",
  },
];

export const defaultMultiSelectWithChipProps: MultiSelectWithChipProps = {
  anchorEl: null,
  menuItems: mockMenuItems,
  onMenuOpen: mockOnMenuOpen,
  onMenuClose: mockOnMenuClose,
  searchText: "",
  selectedItems: [],
  onDelete: mockOnDelete,
  onChange: mockOnChange,
  onMenuItemSelect: mockOnMenuItemSelect,
  placeholder: "Select items",
  width: 300,
  inputPlacement: "start",
};

export const multiSelectWithAnchorEl: MultiSelectWithChipProps = {
  ...defaultMultiSelectWithChipProps,
  anchorEl: document.createElement("div"),
};

export const multiSelectWithSelectedItems: MultiSelectWithChipProps = {
  ...defaultMultiSelectWithChipProps,
  selectedItems: mockSelectedItems,
};

export const multiSelectWithSearchText: MultiSelectWithChipProps = {
  ...defaultMultiSelectWithChipProps,
  searchText: "search query",
};

export const multiSelectEndPlacement: MultiSelectWithChipProps = {
  ...defaultMultiSelectWithChipProps,
  inputPlacement: "end",
};

export const multiSelectWithEmptyMenuItems: MultiSelectWithChipProps = {
  ...defaultMultiSelectWithChipProps,
  menuItems: [],
};

export const resetMocks = () => {
  mockOnMenuOpen.mockReset();
  mockOnMenuClose.mockReset();
  mockOnDelete.mockReset();
  mockOnChange.mockReset();
  mockOnMenuItemSelect.mockReset();
};
