import { vi } from "vitest";
import type { OptionType } from "../../../types";

export const mockSetOptions = vi.fn();

export type FilterSortToolbarProps = {
  allowFilter?: boolean;
  allowSort?: boolean;
  setOptions?: React.Dispatch<React.SetStateAction<OptionType[]>>;
  options: OptionType[];
  optionFilterLabelKey: string | null;
};

export const stringOptions: OptionType[] = ["Option A", "Option C", "Option B"];

export const objectOptions: OptionType[] = [
  { id: 1, label: "Apple", value: "apple" },
  { id: 2, label: "Banana", value: "banana" },
  { id: 3, label: "Cherry", value: "cherry" },
];

export const mixedOptions: OptionType[] = [
  "String Option",
  { id: 1, label: "Object Option", value: "obj" },
];

export const defaultFilterSortToolbarProps: FilterSortToolbarProps = {
  allowFilter: true,
  allowSort: true,
  setOptions: mockSetOptions,
  options: stringOptions,
  optionFilterLabelKey: "label",
};

export const filterOnlyProps: FilterSortToolbarProps = {
  allowFilter: true,
  allowSort: false,
  setOptions: mockSetOptions,
  options: stringOptions,
  optionFilterLabelKey: "label",
};

export const sortOnlyProps: FilterSortToolbarProps = {
  allowFilter: false,
  allowSort: true,
  setOptions: mockSetOptions,
  options: stringOptions,
  optionFilterLabelKey: "label",
};

export const noFeaturesProps: FilterSortToolbarProps = {
  allowFilter: false,
  allowSort: false,
  setOptions: mockSetOptions,
  options: stringOptions,
  optionFilterLabelKey: "label",
};

export const objectOptionsProps: FilterSortToolbarProps = {
  allowFilter: true,
  allowSort: true,
  setOptions: mockSetOptions,
  options: objectOptions,
  optionFilterLabelKey: "label",
};

export const emptyOptionsProps: FilterSortToolbarProps = {
  allowFilter: true,
  allowSort: true,
  setOptions: mockSetOptions,
  options: [],
  optionFilterLabelKey: "label",
};

export const nullLabelKeyProps: FilterSortToolbarProps = {
  allowFilter: true,
  allowSort: true,
  setOptions: mockSetOptions,
  options: objectOptions,
  optionFilterLabelKey: null,
};

export const resetMocks = () => {
  mockSetOptions.mockReset();
};
