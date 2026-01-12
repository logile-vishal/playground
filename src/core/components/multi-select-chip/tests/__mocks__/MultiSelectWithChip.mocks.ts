import { vi } from "vitest";
import type { NestedMenuItem } from "@/core/components/nested-menu/types/index";
import type { MultiSelectWithChipProps } from "../../MultiSelectWithChip";

export const mockOnMenuOpen = vi.fn();
export const mockOnMenuClose = vi.fn();
export const mockOnDelete = vi.fn();
export const mockOnChange = vi.fn();

export const mockMenuItems: NestedMenuItem[] = [
  {
    label: "Item 1",
    value: "item1",
    filterPath: "Item 1",
    path: "Item 1",
  },
  {
    label: "Item 2",
    value: "item2",
    filterPath: "Item 2",
    subMenu: {
      items: [
        {
          label: "Sub Item 2.1",
          value: "item2.1",
          filterPath: "Item 2 > Sub Item 2.1",
        },
      ],
    },
  },
  {
    label: "Item 3",
    value: "item3",
    filterPath: "Item 3",
    path: "Item 3",
  },
];

export const mockSelectedItems: NestedMenuItem[] = [
  {
    label: "Item 1",
    value: "item1",
    filterPath: "Item 1",
    path: "Item 1",
  },
];

export const defaultMultiSelectWithChipProps: MultiSelectWithChipProps = {
  options: mockMenuItems,
  onChange: mockOnChange,
  onDelete: mockOnDelete,
  placeholder: "Select items",
  inputPlacement: "start",
  isInputVisible: true,
  inputWidth: 300,
};

// For testing purposes - anchorEl isn't actually a prop but we simulate the state
export const multiSelectWithAnchorEl: MultiSelectWithChipProps = {
  ...defaultMultiSelectWithChipProps,
};

export const multiSelectWithSelectedItems: MultiSelectWithChipProps = {
  ...defaultMultiSelectWithChipProps,
  value: mockSelectedItems,
};

// For testing purposes - searchText isn't actually a prop but managed internally
export const multiSelectWithSearchText: MultiSelectWithChipProps = {
  ...defaultMultiSelectWithChipProps,
};

export const multiSelectEndPlacement: MultiSelectWithChipProps = {
  ...defaultMultiSelectWithChipProps,
  inputPlacement: "end",
};

export const multiSelectWithEmptyMenuItems: MultiSelectWithChipProps = {
  ...defaultMultiSelectWithChipProps,
  options: [],
};

export const resetMocks = () => {
  mockOnMenuOpen.mockReset();
  mockOnMenuClose.mockReset();
  mockOnDelete.mockReset();
  mockOnChange.mockReset();
};
