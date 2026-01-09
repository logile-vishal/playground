import { vi } from "vitest";
import type { OptionType } from "../../../types";

export const mockStringOptions: OptionType[] = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
];

export const mockObjectOptions: OptionType[] = [
  { id: 1, label: "Option A", value: "a" },
  { id: 2, label: "Option B", value: "b" },
  { id: 3, label: "Option C", value: "c" },
  { id: 4, label: "Option D", value: "d" },
];

export const mockMixedOptions: OptionType[] = [
  { id: 1, label: "Zebra", description: "Animal" },
  { id: 2, label: "Apple", description: "Fruit" },
  { id: 3, label: "Car", description: "Vehicle" },
];

export const mockEmptyOptions: OptionType[] = [];

export const mockSetOptions = vi.fn();

export const mockFilterSortToolbarProps = {
  allowFilter: true,
  allowSort: true,
  setOptions: mockSetOptions,
  options: mockObjectOptions,
  optionFilterLabelKey: "label",
};

export const resetMocks = () => {
  mockSetOptions.mockClear();
};
