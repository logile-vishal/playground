import React from "react";
import { vi } from "vitest";
import type { OptionType } from "../../types";

// Mock options data
export const mockStringOptions: OptionType[] = [
  "Option 1",
  "Option 2",
  "Option 3",
];

export const mockObjectOptions: OptionType[] = [
  { id: 1, label: "First Option", value: "first" },
  { id: 2, label: "Second Option", value: "second" },
  { id: 3, label: "Third Option", value: "third" },
];

export const mockEmptyOptions: OptionType[] = [];

export const mockLargeOptions: OptionType[] = Array.from(
  { length: 50 },
  (_, i) => ({
    id: i + 1,
    label: `Option ${i + 1}`,
    value: `option-${i + 1}`,
  })
);

export const mockOptionsWithMissingKeys = [
  { id: 1, label: "Complete Option" },
  { id: 2 }, // Missing label
  { label: "No ID Option" },
];

// Mock function handlers
export const mockOnChange = vi.fn();
export const mockOnClose = vi.fn();
export const mockOnOpen = vi.fn();
export const mockRenderOption = vi.fn((option: OptionType) => {
  return typeof option === "object" ? (option as any).label : option;
});
export const mockRenderValue = vi.fn((selected: unknown) => {
  if (Array.isArray(selected)) {
    return `${selected.length} items selected`;
  }
  return `Custom: ${selected}`;
});
export const mockRenderOptionValue = vi.fn((option: OptionType) => {
  return typeof option === "object" ? (option as any).value : option;
});

// Mock icon component
export const MockIconComponent = vi.fn((props: any) =>
  React.createElement("span", props, "MockIcon")
);

// Reset all mocks
export const resetAllMocks = () => {
  mockOnChange.mockClear();
  mockOnClose.mockClear();
  mockOnOpen.mockClear();
  mockRenderOption.mockClear();
  mockRenderValue.mockClear();
  mockRenderOptionValue.mockClear();
  MockIconComponent.mockClear();
};
