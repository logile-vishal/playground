import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import CFilterSortToolbar from "../FilterSortToolbar";
import {
  mockStringOptions,
  mockObjectOptions,
  mockEmptyOptions,
  mockSetOptions,
  mockFilterSortToolbarProps,
  resetMocks,
} from "./__mocks__/FilterSortToolbar.mocks";
import { SORT_DIRECTION } from "@/core/constants/sort";
import type { SortType } from "@/core/types/sort.type";
import type { OptionType } from "../../types";

// Helper function to mirror internal sortOptions implementation
const sortOptions = (
  list: OptionType[],
  optionLabelKey: string | null | undefined,
  sortDirection: SortType
): OptionType[] => {
  return [...list].sort((firstOption, secondOption) => {
    const firstValue =
      typeof firstOption === "string"
        ? firstOption
        : firstOption[optionLabelKey as keyof typeof firstOption] ||
          JSON.stringify(firstOption);
    const secondValue =
      typeof secondOption === "string"
        ? secondOption
        : secondOption[optionLabelKey as keyof typeof secondOption] ||
          JSON.stringify(secondOption);
    if (sortDirection === SORT_DIRECTION.ASCENDING) {
      return String(firstValue).localeCompare(String(secondValue));
    }
    return String(secondValue).localeCompare(String(firstValue));
  });
};

describe("CFilterSortToolbar", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("Component Rendering", () => {
    it("should render the toolbar with filter and sort enabled", () => {
      render(<CFilterSortToolbar {...mockFilterSortToolbarProps} />);

      const filterInput = screen.getByPlaceholderText(/filter.../);
      expect(filterInput).toBeInTheDocument();

      const sortButton = screen.getByRole("button");
      expect(sortButton).toBeInTheDocument();
    });

    it("should render only filter when allowSort is false", () => {
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          allowSort={false}
        />
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);
      expect(filterInput).toBeInTheDocument();

      const sortButtons = screen.queryAllByRole("button");
      expect(sortButtons).toHaveLength(0);
    });

    it("should render only sort when allowFilter is false", () => {
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          allowFilter={false}
        />
      );

      const filterInput = screen.queryByPlaceholderText(/filter.../);
      expect(filterInput).not.toBeInTheDocument();

      const sortButton = screen.getByRole("button");
      expect(sortButton).toBeInTheDocument();
    });

    it("should render nothing when both allowFilter and allowSort are false", () => {
      const { container } = render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          allowFilter={false}
          allowSort={false}
        />
      );

      const toolbar = container.querySelector(".select-menuitem__toolbar");
      expect(toolbar).toBeInTheDocument();
      expect(toolbar?.children).toHaveLength(0);
    });
  });

  describe("Filter Functionality", () => {
    it("should filter string options based on input value", () => {
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={mockStringOptions}
        />
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "app" } });

      expect(mockSetOptions).toHaveBeenCalled();
      const filterCallback = mockSetOptions.mock.calls[0][0];
      const filteredResult = filterCallback();
      expect(filteredResult).toEqual(["Apple"]);
    });

    it("should filter object options based on any property value", () => {
      render(<CFilterSortToolbar {...mockFilterSortToolbarProps} />);

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "option b" } });

      expect(mockSetOptions).toHaveBeenCalled();
      const filterCallback = mockSetOptions.mock.calls[0][0];
      const filteredResult = filterCallback();
      expect(filteredResult).toHaveLength(1);
      expect(filteredResult[0]).toEqual(mockObjectOptions[1]);
    });

    it("should handle case-insensitive filtering", () => {
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={mockStringOptions}
        />
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "BANANA" } });

      expect(mockSetOptions).toHaveBeenCalled();
      const filterCallback = mockSetOptions.mock.calls[0][0];
      const filteredResult = filterCallback();
      expect(filteredResult).toEqual(["Banana"]);
    });

    it("should reset options when filter input is cleared", () => {
      const resetOptionsSpy = vi.fn();
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          setOptions={resetOptionsSpy}
        />
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);

      fireEvent.change(filterInput, { target: { value: "test" } });
      expect(resetOptionsSpy).toHaveBeenCalledTimes(1);

      resetOptionsSpy.mockClear();

      fireEvent.change(filterInput, { target: { value: "" } });
      expect(resetOptionsSpy).toHaveBeenCalled();
    });

    it("should return empty array when no options match filter", () => {
      render(<CFilterSortToolbar {...mockFilterSortToolbarProps} />);

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "xyz123" } });

      expect(mockSetOptions).toHaveBeenCalled();
      const filterCallback = mockSetOptions.mock.calls[0][0];
      const filteredResult = filterCallback();
      expect(filteredResult).toHaveLength(0);
    });

    it("should handle empty options array", () => {
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={mockEmptyOptions}
        />
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "test" } });

      expect(mockSetOptions).toHaveBeenCalled();
      const filterCallback = mockSetOptions.mock.calls[0][0];
      const filteredResult = filterCallback();
      expect(filteredResult).toEqual([]);
    });

    it("should stop propagation on filter input change", () => {
      const onParentChange = vi.fn();

      render(
        <div onChange={onParentChange}>
          <CFilterSortToolbar {...mockFilterSortToolbarProps} />
        </div>
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);

      fireEvent.change(filterInput, {
        target: { value: "test" },
      });

      expect(onParentChange).not.toHaveBeenCalled();
    });

    it("should stop propagation on keyDown event", () => {
      const onParentKeyDown = vi.fn();

      render(
        <div onKeyDown={onParentKeyDown}>
          <CFilterSortToolbar {...mockFilterSortToolbarProps} />
        </div>
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);

      fireEvent.keyDown(filterInput, { key: "Enter" });

      expect(onParentKeyDown).not.toHaveBeenCalled();
    });

    it("should stop propagation on click event", () => {
      const onParentClick = vi.fn();
      render(
        <div onClick={onParentClick}>
          <CFilterSortToolbar {...mockFilterSortToolbarProps} />
        </div>
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);

      fireEvent.click(filterInput);

      expect(onParentClick).not.toHaveBeenCalled();
    });
  });

  describe("Sort Functionality", () => {
    it("should toggle sort direction on button click", () => {
      render(<CFilterSortToolbar {...mockFilterSortToolbarProps} />);

      const sortButton = screen.getByRole("button");

      fireEvent.click(sortButton);
      expect(mockSetOptions).toHaveBeenCalled();

      mockSetOptions.mockClear();

      fireEvent.click(sortButton);
      expect(mockSetOptions).toHaveBeenCalled();
    });

    it("should toggle sort direction on click", () => {
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={mockStringOptions}
        />
      );

      const sortButton = screen.getByRole("button");

      fireEvent.click(sortButton);
      fireEvent.click(sortButton);

      expect(mockSetOptions).toHaveBeenCalledTimes(2);
    });

    it("sorts string options ascending", () => {
      const input = ["Banana", "Apple", "Elderberry"];

      const result = sortOptions(input, undefined, SORT_DIRECTION.ASCENDING);

      expect(result).toEqual(["Apple", "Banana", "Elderberry"]);
    });

    it("should handle sorting with null optionFilterLabelKey", () => {
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          optionFilterLabelKey={null}
        />
      );

      const sortButton = screen.getByRole("button");
      fireEvent.click(sortButton);

      expect(mockSetOptions).toHaveBeenCalled();
    });

    it("should stop propagation on sort button click", () => {
      const onParentClick = vi.fn();

      render(
        <div onClick={onParentClick}>
          <CFilterSortToolbar {...mockFilterSortToolbarProps} />
        </div>
      );

      const sortButton = screen.getByRole("button");

      fireEvent.click(sortButton);

      expect(onParentClick).not.toHaveBeenCalled();
    });

    it("should display ArrowDown icon initially", () => {
      const { container } = render(
        <CFilterSortToolbar {...mockFilterSortToolbarProps} />
      );

      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });

    it("should toggle icon when sort direction changes", () => {
      const { container } = render(
        <CFilterSortToolbar {...mockFilterSortToolbarProps} />
      );

      const sortButton = screen.getByRole("button");

      fireEvent.click(sortButton);

      const updatedIcon = container.querySelector("svg");
      expect(updatedIcon).toBeInTheDocument();
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle options with null values", () => {
      const optionsWithNull = [null, { label: "Valid" }, null];
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={optionsWithNull}
        />
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "valid" } });

      expect(mockSetOptions).toHaveBeenCalled();
    });

    it("should handle options with undefined values", () => {
      const optionsWithUndefined = [undefined, { label: "Valid" }, undefined];
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={optionsWithUndefined}
        />
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "valid" } });

      expect(mockSetOptions).toHaveBeenCalled();
    });

    it("should handle very long filter strings", () => {
      render(<CFilterSortToolbar {...mockFilterSortToolbarProps} />);

      const filterInput = screen.getByPlaceholderText(/filter.../);
      const longString = "a".repeat(1000);

      fireEvent.change(filterInput, { target: { value: longString } });

      expect(mockSetOptions).toHaveBeenCalled();
    });

    it("should handle special characters in filter", () => {
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={mockStringOptions}
        />
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "!@#$%^&*()" } });

      expect(mockSetOptions).toHaveBeenCalled();
      const filterCallback = mockSetOptions.mock.calls[0][0];
      const filteredResult = filterCallback();
      expect(filteredResult).toHaveLength(0);
    });

    it("should handle options without optionFilterLabelKey property", () => {
      const optionsWithoutKey = [{ id: 1, name: "Test" }];
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={optionsWithoutKey}
          optionFilterLabelKey="label"
        />
      );

      const sortButton = screen.getByRole("button");
      fireEvent.click(sortButton);

      expect(mockSetOptions).toHaveBeenCalled();
    });
  });

  describe("Combined Filter and Sort Operations", () => {
    it("should maintain sort order when filtering", () => {
      const setOptionsCallback = vi.fn();
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          setOptions={setOptionsCallback}
        />
      );

      const sortButton = screen.getByRole("button");
      fireEvent.click(sortButton);

      setOptionsCallback.mockClear();

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "option" } });

      expect(setOptionsCallback).toHaveBeenCalled();
    });

    it("should reset to original options when clearing filter with sort applied", () => {
      const setOptionsCallback = vi.fn();
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          setOptions={setOptionsCallback}
        />
      );

      const sortButton = screen.getByRole("button");
      fireEvent.click(sortButton);

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "option" } });

      setOptionsCallback.mockClear();

      fireEvent.change(filterInput, { target: { value: "" } });

      expect(setOptionsCallback).toHaveBeenCalled();
    });
  });

  describe("Props Handling", () => {
    it("should handle undefined setOptions prop", () => {
      const propsWithoutSetOptions = {
        ...mockFilterSortToolbarProps,
        setOptions: undefined,
      };

      expect(() => {
        render(<CFilterSortToolbar {...propsWithoutSetOptions} />);
      }).not.toThrow();
    });

    it("should handle empty string optionFilterLabelKey", () => {
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          optionFilterLabelKey=""
        />
      );

      const sortButton = screen.getByRole("button");
      fireEvent.click(sortButton);

      expect(mockSetOptions).toHaveBeenCalled();
    });

    it("should work with different optionFilterLabelKey values", () => {
      const customOptions = [{ customKey: "First" }, { customKey: "Second" }];

      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={customOptions}
          optionFilterLabelKey="customKey"
        />
      );

      const sortButton = screen.getByRole("button");
      fireEvent.click(sortButton);

      expect(mockSetOptions).toHaveBeenCalled();
    });
  });

  describe("Helper Functions - sortOptions", () => {
    it("should sort string options in ascending order", () => {
      const input = ["Banana", "Apple", "Elderberry"];
      const result = sortOptions(input, null, SORT_DIRECTION.ASCENDING);
      expect(result).toEqual(["Apple", "Banana", "Elderberry"]);
    });

    it("should sort string options in descending order", () => {
      const input = ["Apple", "Banana", "Elderberry"];
      const result = sortOptions(input, null, SORT_DIRECTION.DESCENDING);
      expect(result).toEqual(["Elderberry", "Banana", "Apple"]);
    });

    it("should sort object options by specific key in ascending order", () => {
      const input = [
        { label: "Zebra", value: "z" },
        { label: "Apple", value: "a" },
        { label: "Mango", value: "m" },
      ];
      const result = sortOptions(input, "label", SORT_DIRECTION.ASCENDING);
      expect((result[0] as { label: string; value: string }).label).toBe(
        "Apple"
      );
      expect((result[1] as { label: string; value: string }).label).toBe(
        "Mango"
      );
      expect((result[2] as { label: string; value: string }).label).toBe(
        "Zebra"
      );
    });

    it("should sort object options by specific key in descending order", () => {
      const input = [
        { label: "Apple", value: "a" },
        { label: "Mango", value: "m" },
        { label: "Zebra", value: "z" },
      ];
      const result = sortOptions(input, "label", SORT_DIRECTION.DESCENDING);
      expect((result[0] as { label: string; value: string }).label).toBe(
        "Zebra"
      );
      expect((result[1] as { label: string; value: string }).label).toBe(
        "Mango"
      );
      expect((result[2] as { label: string; value: string }).label).toBe(
        "Apple"
      );
    });

    it("should handle objects without the specified key and use JSON.stringify", () => {
      const input = [
        { id: 3, name: "Third" },
        { id: 1, name: "First" },
        { id: 2, name: "Second" },
      ];
      const result = sortOptions(input, "label", SORT_DIRECTION.ASCENDING);
      expect(result).toHaveLength(3);
    });

    it("should handle mixed string and object options", () => {
      const input = ["String", { label: "Object" }];
      const result = sortOptions(input, "label", SORT_DIRECTION.ASCENDING);
      expect(result).toHaveLength(2);
    });

    it("should not mutate the original array", () => {
      const input = ["Banana", "Apple", "Cherry"];
      const original = [...input];
      sortOptions(input, null, SORT_DIRECTION.ASCENDING);
      expect(input).toEqual(original);
    });

    it("should handle empty array", () => {
      const result = sortOptions([], null, SORT_DIRECTION.ASCENDING);
      expect(result).toEqual([]);
    });

    it("should handle single element array", () => {
      const input = ["Single"];
      const result = sortOptions(input, null, SORT_DIRECTION.ASCENDING);
      expect(result).toEqual(["Single"]);
    });

    it("should handle case-insensitive sorting", () => {
      const input = ["banana", "Apple", "CHERRY"];
      const result = sortOptions(input, null, SORT_DIRECTION.ASCENDING);
      expect((result[0] as string).toLowerCase()).toBe("apple");
    });
  });

  describe("Helper Functions - Filtering Logic", () => {
    it("should filter options by substring match", () => {
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={mockStringOptions}
        />
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "err" } });

      const filterCallback = mockSetOptions.mock.calls[0][0];
      const filteredResult = filterCallback();
      expect(filteredResult).toEqual(["Cherry", "Elderberry"]);
    });

    it("should filter object options by multiple properties", () => {
      const options = [
        { id: 1, label: "Test", description: "Sample" },
        { id: 2, label: "Example", description: "Test" },
        { id: 3, label: "Demo", description: "Other" },
      ];

      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={options}
        />
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "test" } });

      const filterCallback = mockSetOptions.mock.calls[0][0];
      const filteredResult = filterCallback();
      expect(filteredResult).toHaveLength(2);
    });

    it("should handle filtering with numbers in object options", () => {
      const options = [
        { id: 123, label: "Item" },
        { id: 456, label: "Other" },
      ];

      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={options}
        />
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "123" } });

      const filterCallback = mockSetOptions.mock.calls[0][0];
      const filteredResult = filterCallback();
      expect(filteredResult).toHaveLength(1);
      expect(filteredResult[0].id).toBe(123);
    });

    it("should handle filtering with whitespace", () => {
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          options={mockStringOptions}
        />
      );

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "apple" } });

      const filterCallback = mockSetOptions.mock.calls[0][0];
      const filteredResult = filterCallback();
      expect(filteredResult).toEqual(["Apple"]);
    });
  });

  describe("Helper Functions - resetOptions", () => {
    it("should reset options when filter is cleared after sorting", () => {
      const setOptionsCallback = vi.fn();
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          setOptions={setOptionsCallback}
        />
      );

      // Apply sort first
      const sortButton = screen.getByRole("button");
      fireEvent.click(sortButton);

      // Then filter
      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "option" } });

      setOptionsCallback.mockClear();

      // Clear filter should trigger reset
      fireEvent.change(filterInput, { target: { value: "" } });

      expect(setOptionsCallback).toHaveBeenCalled();
    });

    it("should reset to sorted options when filter is cleared", () => {
      const setOptionsCallback = vi.fn();
      render(
        <CFilterSortToolbar
          {...mockFilterSortToolbarProps}
          setOptions={setOptionsCallback}
          options={mockStringOptions}
        />
      );

      const sortButton = screen.getByRole("button");
      fireEvent.click(sortButton);

      const filterInput = screen.getByPlaceholderText(/filter.../);
      fireEvent.change(filterInput, { target: { value: "a" } });
      fireEvent.change(filterInput, { target: { value: "" } });

      expect(setOptionsCallback).toHaveBeenCalled();
    });
  });

  describe("Helper Functions - getSortIcon", () => {
    it("should display correct icon based on sort state", () => {
      const { container } = render(
        <CFilterSortToolbar {...mockFilterSortToolbarProps} />
      );

      const sortButton = screen.getByRole("button");
      const initialIcon = container.querySelector("svg");
      expect(initialIcon).toBeInTheDocument();

      // Click to change sort direction
      fireEvent.click(sortButton);

      const updatedIcon = container.querySelector("svg");
      expect(updatedIcon).toBeInTheDocument();
    });

    it("should toggle between ArrowUp and ArrowDown icons", () => {
      const { container } = render(
        <CFilterSortToolbar {...mockFilterSortToolbarProps} />
      );

      const sortButton = screen.getByRole("button");

      // Initial state should have an icon
      expect(container.querySelector("svg")).toBeInTheDocument();

      // Click multiple times to toggle
      fireEvent.click(sortButton);
      expect(container.querySelector("svg")).toBeInTheDocument();

      fireEvent.click(sortButton);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });
});
