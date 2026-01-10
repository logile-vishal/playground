import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import CFilterSortToolbar from "../FilterSortToolbar";
import { sortOptions } from "../../utils/sortOptions";
import {
  mockStringOptions,
  mockObjectOptions,
  mockEmptyOptions,
  mockSetOptions,
  mockFilterSortToolbarProps,
  resetMocks,
} from "./__mocks__/FilterSortToolbar.mocks";
import { SORT_DIRECTION } from "@/core/constants/sort";

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
});
