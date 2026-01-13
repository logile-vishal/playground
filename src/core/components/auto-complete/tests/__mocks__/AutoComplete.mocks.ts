import type {
  AutoCompleteOptionProps,
  AutocompleteProps,
} from "@/core/types/autocomplete.type";
import { vi } from "vitest";

export const mockFlatOptions: AutoCompleteOptionProps[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

export const mockGroupedOptions: AutoCompleteOptionProps[] = [
  {
    label: "Group A",
    options: [
      { label: "Option A1", value: "optionA1" },
      { label: "Option A2", value: "optionA2" },
    ],
    value: "groupA",
  },
  {
    label: "Group B",
    options: [
      { label: "Option B1", value: "optionB1" },
      { label: "Option B2", value: "optionB2" },
    ],
    value: "groupB",
  },
];

export const mockMixedOptions: AutoCompleteOptionProps[] = [
  { label: "Ungrouped Option", value: "ungrouped" },
  {
    label: "Group C",
    options: [
      { label: "Option C1", value: "optionC1" },
      { label: "Option C2", value: "optionC2" },
    ],
    value: "groupC",
  },
];

export const mockDefaultValue: AutoCompleteOptionProps[] = [
  { label: "Option 1", value: "option1" },
];

export const mockHandleChange = vi.fn();

export const mockAutoCompleteProps: AutocompleteProps = {
  label: "Test Label",
  options: mockFlatOptions,
  defaultValue: [],
  placeholder: "Select options",
  handleChange: mockHandleChange,
  value: [],
};

export const mockAutoCompletePropsWithGrouped: AutocompleteProps = {
  label: "Grouped Test",
  options: mockGroupedOptions,
  defaultValue: [],
  placeholder: "Select grouped options",
  handleChange: mockHandleChange,
  value: [],
};

export const mockAutoCompletePropsWithValue: AutocompleteProps = {
  label: "Test with Value",
  options: mockFlatOptions,
  value: mockDefaultValue,
  placeholder: "Select options",
  handleChange: mockHandleChange,
};
