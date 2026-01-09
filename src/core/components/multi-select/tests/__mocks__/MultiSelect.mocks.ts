import { vi } from "vitest";
import type { MultiSelectProps } from "../../MultiSelect";
import type { OptionType } from "../../types";

export const mockOnChange = vi.fn();
export const mockOnOpen = vi.fn();
export const mockOnClose = vi.fn();
export const mockRenderValue = vi.fn();
export const mockRenderOption = vi.fn();

export const simpleOptions: OptionType[] = ["Option 1", "Option 2", "Option 3"];

export const objectOptions: OptionType[] = [
  { id: 1, name: "Item 1", value: "item1" },
  { id: 2, name: "Item 2", value: "item2" },
  { id: 3, name: "Item 3", value: "item3" },
];

export const manyOptions: OptionType[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  value: `item${i + 1}`,
}));

export const defaultMultiSelectProps: MultiSelectProps = {
  options: simpleOptions,
  value: [],
  onChange: mockOnChange,
  label: "Test Label",
  placeholder: "Select options",
};

export const multiSelectWithObjectOptions: MultiSelectProps = {
  options: objectOptions,
  value: [],
  onChange: mockOnChange,
  label: "Object Options",
  placeholder: "Select items",
  optionLabelKey: "name",
  optionValueKey: "value",
};

export const multiSelectWithSelectedValues: MultiSelectProps = {
  options: simpleOptions,
  value: ["Option 1", "Option 2"],
  onChange: mockOnChange,
  label: "Selected Items",
  placeholder: "Select options",
};

export const multiSelectWithAllSelected: MultiSelectProps = {
  options: simpleOptions,
  value: simpleOptions,
  onChange: mockOnChange,
  label: "All Selected",
  placeholder: "Select options",
};

export const multiSelectWithCustomRender: MultiSelectProps = {
  options: simpleOptions,
  value: [],
  onChange: mockOnChange,
  label: "Custom Render",
  placeholder: "Select options",
  renderValue: mockRenderValue,
  renderOption: mockRenderOption,
};

export const multiSelectDisabled: MultiSelectProps = {
  options: simpleOptions,
  value: [],
  onChange: mockOnChange,
  label: "Disabled",
  placeholder: "Select options",
  disabled: true,
};

export const resetMocks = () => {
  mockOnChange.mockReset();
  mockOnOpen.mockReset();
  mockOnClose.mockReset();
  mockRenderValue.mockReset();
  mockRenderOption.mockReset();
};
