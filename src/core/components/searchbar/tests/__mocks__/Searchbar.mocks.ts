import { vi } from "vitest";
import type { SearchbarProps } from "../../Searchbar";

export const mockOnSearch = vi.fn();

export const defaultSearchbarProps: SearchbarProps = {
  placeholder: "Search...",
  iconPosition: "start",
  onSearch: mockOnSearch,
};

export const searchbarWithEndIcon: SearchbarProps = {
  placeholder: "Search items",
  iconPosition: "end",
  onSearch: mockOnSearch,
};

export const searchbarWithCustomPlaceholder: SearchbarProps = {
  placeholder: "Type to search",
  iconPosition: "start",
  onSearch: mockOnSearch,
};

export const searchbarWithEmptyPlaceholder: SearchbarProps = {
  placeholder: "",
  iconPosition: "start",
  onSearch: mockOnSearch,
};

export const resetMocks = () => {
  mockOnSearch.mockReset();
};
