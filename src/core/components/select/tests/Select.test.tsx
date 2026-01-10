import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import CSelect from "../Select";
import {
  mockStringOptions,
  mockObjectOptions,
  mockEmptyOptions,
  mockLargeOptions,
  mockOptionsWithMissingKeys,
  mockOnChange,
  MockIconComponent,
  resetAllMocks,
} from "./__mocks__/Select.mocks";
import React from "react";

// Mock external dependencies
vi.mock("@/core/components/icon/Icon", () => ({
  default: ({
    size,
    color,
    ...props
  }: {
    size?: string | number;
    color?: string;
    [key: string]: unknown;
  }) => (
    <span
      data-testid="svg-icon"
      data-size={size}
      data-color={color}
      {...props}
    >
      Icon
    </span>
  ),
}));

vi.mock("@/core/constants/icons", () => ({
  ChevronDown: "ChevronDownIcon",
  ArrowDown: "ArrowDownIcon",
  ArrowUp: "ArrowUpIcon",
}));

vi.mock("@/utils", () => ({
  isNonEmptyValue: (value: unknown) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  },
}));

vi.mock("../components/FilterSortToolbar", () => ({
  default: ({
    allowFilter,
    allowSort,
    setOptions,
    options,
    optionFilterLabelKey,
  }: {
    [key: string]: unknown;
  }) => (
    <div data-testid="filter-sort-toolbar">
      {allowFilter && (
        <input
          data-testid="filter-input"
          onChange={(e) => {
            const filterValue = e.target.value.toLowerCase();
            const filtered = (options as unknown[]).filter((opt: unknown) => {
              if (typeof opt === "string") {
                return opt.toLowerCase().includes(filterValue);
              }
              if (
                typeof opt === "object" &&
                optionFilterLabelKey &&
                opt !== null
              ) {
                return (opt as { [key: string]: unknown })[
                  optionFilterLabelKey as string
                ]
                  ?.toString()
                  .toLowerCase()
                  .includes(filterValue);
              }
              return JSON.stringify(opt).toLowerCase().includes(filterValue);
            });
            (setOptions as (val: unknown) => void)(filtered);
          }}
        />
      )}
      {allowSort && (
        <button
          data-testid="sort-button"
          onClick={() => {
            const sorted = [...(options as unknown[])].sort(
              (a: unknown, b: unknown) => {
                let aVal = a;
                let bVal = b;
                if (
                  typeof a === "object" &&
                  optionFilterLabelKey &&
                  a !== null
                ) {
                  aVal = (a as { [key: string]: unknown })[
                    optionFilterLabelKey as string
                  ];
                }
                if (
                  typeof b === "object" &&
                  optionFilterLabelKey &&
                  b !== null
                ) {
                  bVal = (b as { [key: string]: unknown })[
                    optionFilterLabelKey as string
                  ];
                }
                return String(aVal).localeCompare(String(bVal));
              }
            );
            (setOptions as (val: unknown) => void)(sorted);
          }}
        >
          Sort
        </button>
      )}
    </div>
  ),
}));

vi.mock("../components/StyledSelect", () => ({
  default: ({
    children,
    renderValue,
    onKeyDown,
    IconComponent,
    MenuProps,
    ...props
  }: {
    [key: string]: unknown;
  }) => (
    <div data-testid="styled-select-wrapper">
      <select
        data-testid="styled-select"
        {...props}
        onChange={(e) =>
          (props.onChange as (e: React.ChangeEvent) => void)?.(e)
        }
        onBlur={(e) => (props.onBlur as (e: React.FocusEvent) => void)?.(e)}
        onClick={(e) => (props.onClick as (e: React.MouseEvent) => void)?.(e)}
        onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLSelectElement>}
      >
        <option
          value=""
          data-testid="render-value-placeholder"
        >
          {renderValue && (renderValue as (val: string) => React.ReactNode)("")}
        </option>
        {children as React.ReactNode}
      </select>
      {IconComponent &&
        React.createElement(
          IconComponent as React.ComponentType,
          {
            "data-testid": "icon-component",
          } as React.Attributes
        )}
      {MenuProps && (
        <div
          data-testid="menu-props"
          className={
            (MenuProps as { PaperProps?: { className?: string } }).PaperProps
              ?.className
          }
        />
      )}
    </div>
  ),
}));

vi.mock("../components/StyledMenuItem", () => ({
  default: ({ children, value, ...props }: { [key: string]: unknown }) => (
    <option
      data-testid="styled-menu-item"
      value={
        (value as { toString: () => string } | undefined)?.toString() || ""
      }
      {...props}
    >
      {children as React.ReactNode}
    </option>
  ),
}));

describe("CSelect Component", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render select component with basic string options", () => {
      render(
        <CSelect
          options={mockStringOptions}
          placeholder="Select an option"
          label="Test Label"
        />
      );

      expect(screen.getByTestId("styled-select")).toBeInTheDocument();
      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("should render with placeholder when no value is selected", () => {
      render(
        <CSelect
          options={mockStringOptions}
          placeholder="Choose option"
          label="Test"
        />
      );

      expect(screen.getByText("Choose option")).toBeInTheDocument();
    });

    it("should render with custom className", () => {
      const { container } = render(
        <CSelect
          options={mockStringOptions}
          className="custom-select-class"
          label="Test"
        />
      );

      expect(
        container.querySelector(".custom-select-class")
      ).toBeInTheDocument();
    });

    it("should render without custom className", () => {
      const { container } = render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      expect(container.querySelector(".select-wrapper")).toBeInTheDocument();
    });

    it("should render all string options", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      const options = screen.getAllByTestId("styled-menu-item");
      expect(options).toHaveLength(mockStringOptions.length);
    });

    it("should render all object options with optionLabelKey", () => {
      render(
        <CSelect
          options={mockObjectOptions}
          optionLabelKey="label"
          optionValueKey="value"
          label="Test"
        />
      );

      expect(screen.getByText("First Option")).toBeInTheDocument();
      expect(screen.getByText("Second Option")).toBeInTheDocument();
      expect(screen.getByText("Third Option")).toBeInTheDocument();
    });

    it("should render empty select when options is empty array", () => {
      render(
        <CSelect
          options={mockEmptyOptions}
          label="Test"
        />
      );

      const options = screen.queryAllByTestId("styled-menu-item");
      expect(options).toHaveLength(0);
    });

    it("should render label when provided", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Custom Label"
        />
      );

      expect(screen.getByText("Custom Label")).toBeInTheDocument();
    });

    it("should render empty label when not provided", () => {
      const { container } = render(<CSelect options={mockStringOptions} />);
      const label = container.querySelector("label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent("");
    });

    it("should render with default ChevronDown icon", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      expect(screen.getByTestId("icon-component")).toBeInTheDocument();
      expect(screen.getByTestId("icon-component")).toHaveAttribute(
        "data-size",
        "18"
      );
      expect(screen.getByTestId("icon-component")).toHaveAttribute(
        "data-color",
        "secondary"
      );
    });

    it("should render with custom IconComponent", () => {
      render(
        <CSelect
          options={mockStringOptions}
          IconComponent={MockIconComponent}
          label="Test"
        />
      );

      expect(screen.getByTestId("icon-component")).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should handle optionLabelKey correctly for object options", () => {
      render(
        <CSelect
          options={mockObjectOptions}
          optionLabelKey="label"
          optionValueKey="value"
          label="Test"
        />
      );

      expect(screen.getByText("First Option")).toBeInTheDocument();
      expect(screen.getByText("Second Option")).toBeInTheDocument();
    });

    it("should handle optionValueKey correctly for object options", () => {
      render(
        <CSelect
          options={mockObjectOptions}
          optionLabelKey="label"
          optionValueKey="value"
          label="Test"
        />
      );

      const options = screen.getAllByTestId("styled-menu-item");

      // Verify that each option has a value attribute set
      expect(options[0]).toHaveAttribute("value");
      expect(options[1]).toHaveAttribute("value");
      expect(options[2]).toHaveAttribute("value");

      // Verify all three options are rendered with correct labels
      expect(screen.getByText("First Option")).toBeInTheDocument();
      expect(screen.getByText("Second Option")).toBeInTheDocument();
      expect(screen.getByText("Third Option")).toBeInTheDocument();
    });

    it("should handle string value as option when no keys provided", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      const options = screen.getAllByTestId("styled-menu-item");
      expect(options[0]).toHaveAttribute("value", "Option 1");
    });

    it("should handle selected string value prop", () => {
      render(
        <CSelect
          options={mockStringOptions}
          value="Option 1"
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      expect(select).toHaveValue("Option 1");
    });

    it("should handle array value prop for multiple select", () => {
      render(
        <CSelect
          options={mockStringOptions}
          value={["Option 1", "Option 2"]}
          multiple
          label="Test"
        />
      );

      expect(screen.getByTestId("styled-select")).toBeInTheDocument();
    });

    it("should handle null value prop", () => {
      render(
        <CSelect
          options={mockStringOptions}
          value={null}
          label="Test"
        />
      );

      expect(screen.getByTestId("styled-select")).toHaveValue("");
    });

    it("should handle undefined value prop", () => {
      render(
        <CSelect
          options={mockStringOptions}
          value={undefined}
          label="Test"
        />
      );

      expect(screen.getByTestId("styled-select")).toHaveValue("");
    });

    it("should handle disabled prop", () => {
      render(
        <CSelect
          options={mockStringOptions}
          disabled
          label="Test"
        />
      );

      expect(screen.getByTestId("styled-select")).toBeDisabled();
    });

    it("should handle required prop", () => {
      render(
        <CSelect
          options={mockStringOptions}
          required
          label="Test"
        />
      );

      expect(screen.getByTestId("styled-select")).toBeRequired();
    });

    it("should handle multiple prop", () => {
      render(
        <CSelect
          options={mockStringOptions}
          multiple
          label="Test"
        />
      );

      expect(screen.getByTestId("styled-select")).toHaveAttribute("multiple");
    });

    it("should handle displayEmpty prop", () => {
      render(
        <CSelect
          options={mockStringOptions}
          displayEmpty
          label="Test"
        />
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("Custom Render Functions", () => {
    it("should call custom renderValue when value is selected", () => {
      const mockRenderCustomValue = vi.fn((value) => `${value}`);
      render(
        <CSelect
          options={mockStringOptions}
          value="Option 1"
          renderValue={mockRenderCustomValue}
          displayEmpty
          label="Test"
        />
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("should display placeholder when value is null", () => {
      render(
        <CSelect
          options={mockStringOptions}
          value={null}
          placeholder="Select option"
          label="Test"
        />
      );

      expect(screen.getByText("Select option")).toBeInTheDocument();
    });

    it("should display placeholder when value is undefined", () => {
      render(
        <CSelect
          options={mockStringOptions}
          value={undefined}
          placeholder="Choose"
          label="Test"
        />
      );

      expect(screen.getByText("Choose")).toBeInTheDocument();
    });

    it("should display placeholder when value is empty string", () => {
      render(
        <CSelect
          options={mockStringOptions}
          value=""
          placeholder="Empty"
          label="Test"
        />
      );

      expect(screen.getByText("Empty")).toBeInTheDocument();
    });

    it("should use default render when renderValue not provided and value exists", () => {
      render(
        <CSelect
          options={mockStringOptions}
          value="Option 1"
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      expect(select).toHaveValue("Option 1");
    });
  });

  describe("Event Handling", () => {
    it("should call onChange when selection changes", () => {
      render(
        <CSelect
          options={mockStringOptions}
          onChange={mockOnChange}
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      fireEvent.change(select, { target: { value: "Option 1" } });

      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should call onClick when select is clicked", () => {
      const mockOnClick = vi.fn();
      render(
        <CSelect
          options={mockStringOptions}
          onClick={mockOnClick}
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      fireEvent.click(select);

      expect(mockOnClick).toHaveBeenCalled();
    });

    it("should call onBlur when select loses focus", () => {
      const mockOnBlur = vi.fn();
      render(
        <CSelect
          options={mockStringOptions}
          onBlur={mockOnBlur}
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      fireEvent.blur(select);

      expect(mockOnBlur).toHaveBeenCalled();
    });

    it("should prevent default on keydown event", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      const keyDownEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(keyDownEvent, "preventDefault");

      fireEvent(select, keyDownEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should stop propagation on keydown event", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      const keyDownEvent = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        bubbles: true,
      });
      const stopPropagationSpy = vi.spyOn(keyDownEvent, "stopPropagation");

      fireEvent(select, keyDownEvent);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it("should handle multiple key presses", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      fireEvent.keyDown(select, { key: "ArrowDown" });
      fireEvent.keyDown(select, { key: "ArrowUp" });
      fireEvent.keyDown(select, { key: "Enter" });

      expect(select).toBeInTheDocument();
    });
  });

  describe("Filter and Sort Functionality", () => {
    it("should render filter toolbar when allowFilter is true", () => {
      render(
        <CSelect
          options={mockObjectOptions}
          optionLabelKey="label"
          optionValueKey="value"
          allowFilter
          label="Test"
        />
      );

      expect(screen.getByTestId("filter-sort-toolbar")).toBeInTheDocument();
      expect(screen.getByTestId("filter-input")).toBeInTheDocument();
    });

    it("should render sort toolbar when allowSort is true", () => {
      render(
        <CSelect
          options={mockObjectOptions}
          optionLabelKey="label"
          optionValueKey="value"
          allowSort
          label="Test"
        />
      );

      expect(screen.getByTestId("filter-sort-toolbar")).toBeInTheDocument();
      expect(screen.getByTestId("sort-button")).toBeInTheDocument();
    });

    it("should render both filter and sort when both are true", () => {
      render(
        <CSelect
          options={mockObjectOptions}
          optionLabelKey="label"
          optionValueKey="value"
          allowFilter
          allowSort
          label="Test"
        />
      );

      expect(screen.getByTestId("filter-input")).toBeInTheDocument();
      expect(screen.getByTestId("sort-button")).toBeInTheDocument();
    });

    it("should not render toolbar when allowFilter and allowSort are false", () => {
      render(
        <CSelect
          options={mockObjectOptions}
          optionLabelKey="label"
          optionValueKey="value"
          allowFilter={false}
          allowSort={false}
          label="Test"
        />
      );

      expect(
        screen.queryByTestId("filter-sort-toolbar")
      ).not.toBeInTheDocument();
    });

    it("should not render toolbar when allowFilter and allowSort are undefined", () => {
      render(
        <CSelect
          options={mockObjectOptions}
          optionLabelKey="label"
          optionValueKey="value"
          label="Test"
        />
      );

      expect(
        screen.queryByTestId("filter-sort-toolbar")
      ).not.toBeInTheDocument();
    });

    it("should filter string options when filter input changes", async () => {
      render(
        <CSelect
          options={mockStringOptions}
          allowFilter
          label="Test"
        />
      );

      const filterInput = screen.getByTestId("filter-input");
      fireEvent.change(filterInput, { target: { value: "Option 1" } });

      await waitFor(() => {
        const options = screen.getAllByTestId("styled-menu-item");
        expect(options).toHaveLength(1);
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });

    it("should filter object options with optionFilterLabelKey", async () => {
      render(
        <CSelect
          options={mockObjectOptions}
          optionLabelKey="label"
          optionValueKey="value"
          allowFilter
          label="Test"
        />
      );

      const filterInput = screen.getByTestId("filter-input");
      fireEvent.change(filterInput, { target: { value: "First" } });

      await waitFor(() => {
        const options = screen.getAllByTestId("styled-menu-item");
        expect(options).toHaveLength(1);
        expect(screen.getByText("First Option")).toBeInTheDocument();
      });
    });

    it("should show no options when filter matches nothing", async () => {
      render(
        <CSelect
          options={mockStringOptions}
          allowFilter
          label="Test"
        />
      );

      const filterInput = screen.getByTestId("filter-input");
      fireEvent.change(filterInput, { target: { value: "NonExistent" } });

      await waitFor(() => {
        const options = screen.queryAllByTestId("styled-menu-item");
        expect(options).toHaveLength(0);
      });
    });

    it("should sort options when sort button is clicked", async () => {
      render(
        <CSelect
          options={[...mockObjectOptions].reverse()}
          optionLabelKey="label"
          optionValueKey="value"
          allowSort
          label="Test"
        />
      );

      const sortButton = screen.getByTestId("sort-button");
      fireEvent.click(sortButton);

      await waitFor(() => {
        const options = screen.getAllByTestId("styled-menu-item");
        expect(options[0]).toHaveTextContent("First Option");
      });
    });
  });

  describe("UseEffect Behavior - Options Update", () => {
    it("should update filtered options when options prop changes", async () => {
      const { rerender } = render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      expect(screen.getAllByTestId("styled-menu-item")).toHaveLength(3);

      rerender(
        <CSelect
          options={mockObjectOptions}
          optionLabelKey="label"
          optionValueKey="value"
          label="Test"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByTestId("styled-menu-item")).toHaveLength(3);
        expect(screen.getByText("First Option")).toBeInTheDocument();
      });
    });

    it("should initialize with empty array when options is null", () => {
      render(
        <CSelect
          options={[]}
          label="Test"
        />
      );

      const options = screen.queryAllByTestId("styled-menu-item");
      expect(options).toHaveLength(0);
    });

    it("should update options when changing from empty to populated", async () => {
      const { rerender } = render(
        <CSelect
          options={mockEmptyOptions}
          label="Test"
        />
      );

      expect(screen.queryAllByTestId("styled-menu-item")).toHaveLength(0);

      rerender(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByTestId("styled-menu-item")).toHaveLength(3);
      });
    });

    it("should update options when changing from populated to empty", async () => {
      const { rerender } = render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      expect(screen.getAllByTestId("styled-menu-item")).toHaveLength(3);

      rerender(
        <CSelect
          options={mockEmptyOptions}
          label="Test"
        />
      );

      await waitFor(() => {
        expect(screen.queryAllByTestId("styled-menu-item")).toHaveLength(0);
      });
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle large number of options", () => {
      render(
        <CSelect
          options={mockLargeOptions}
          optionLabelKey="label"
          label="Test"
        />
      );

      const options = screen.getAllByTestId("styled-menu-item");
      expect(options).toHaveLength(50);
    });

    it("should handle options with missing optionLabelKey", () => {
      render(
        <CSelect
          options={mockOptionsWithMissingKeys}
          optionLabelKey="label"
          optionValueKey="id"
          label="Test"
        />
      );

      expect(screen.getByText("Complete Option")).toBeInTheDocument();
    });

    it("should handle object options without optionValueKey provided", () => {
      render(
        <CSelect
          options={mockObjectOptions}
          optionLabelKey="label"
          label="Test"
        />
      );

      const options = screen.getAllByTestId("styled-menu-item");
      expect(options[0]).toHaveAttribute("value", "[object Object]");
    });

    it("should handle empty string placeholder", () => {
      render(
        <CSelect
          options={mockStringOptions}
          placeholder=""
          label="Test"
        />
      );

      expect(screen.getByTestId("styled-select")).toBeInTheDocument();
    });

    it("should handle undefined placeholder", () => {
      render(
        <CSelect
          options={mockStringOptions}
          placeholder={undefined}
          label="Test"
        />
      );

      expect(screen.getByTestId("styled-select")).toBeInTheDocument();
    });

    it("should handle options with special characters in labels", () => {
      const specialOptions = [
        "Option <script>",
        "Option & Co",
        "Option's value",
      ];
      render(
        <CSelect
          options={specialOptions}
          label="Test"
        />
      );

      expect(screen.getByText("Option <script>")).toBeInTheDocument();
      expect(screen.getByText("Option & Co")).toBeInTheDocument();
    });
  });

  describe("MenuProps Configuration", () => {
    it("should apply MenuProps with PaperProps className", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      expect(screen.getByTestId("menu-props")).toHaveClass("select__menu");
    });

    it("should render with MenuProps configuration", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      const menuProps = screen.getByTestId("menu-props");
      expect(menuProps).toBeInTheDocument();
    });
  });

  describe("Negative Scenarios", () => {
    it("should handle onChange with invalid event", () => {
      render(
        <CSelect
          options={mockStringOptions}
          onChange={mockOnChange}
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      fireEvent.change(select, { target: { value: null } });

      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should handle disabled state correctly", () => {
      render(
        <CSelect
          options={mockStringOptions}
          disabled
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      fireEvent.click(select);

      expect(select).toBeDisabled();
    });

    it("should handle filter with empty options array", async () => {
      render(
        <CSelect
          options={mockEmptyOptions}
          allowFilter
          label="Test"
        />
      );

      const filterInput = screen.getByTestId("filter-input");
      fireEvent.change(filterInput, { target: { value: "test" } });

      await waitFor(() => {
        const options = screen.queryAllByTestId("styled-menu-item");
        expect(options).toHaveLength(0);
      });
    });

    it("should handle sort with empty options array", async () => {
      render(
        <CSelect
          options={mockEmptyOptions}
          allowSort
          label="Test"
        />
      );

      const sortButton = screen.getByTestId("sort-button");
      fireEvent.click(sortButton);

      await waitFor(() => {
        const options = screen.queryAllByTestId("styled-menu-item");
        expect(options).toHaveLength(0);
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("should handle Enter key press", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      fireEvent.keyDown(select, { key: "Enter" });

      expect(select).toBeInTheDocument();
    });

    it("should handle Space key press", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      fireEvent.keyDown(select, { key: " " });

      expect(select).toBeInTheDocument();
    });

    it("should handle Escape key press", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      fireEvent.keyDown(select, { key: "Escape" });

      expect(select).toBeInTheDocument();
    });

    it("should handle Tab key press", () => {
      render(
        <CSelect
          options={mockStringOptions}
          label="Test"
        />
      );

      const select = screen.getByTestId("styled-select");
      fireEvent.keyDown(select, { key: "Tab" });

      expect(select).toBeInTheDocument();
    });
  });

  describe("Integration with Filter and Options", () => {
    it("should maintain filtered state after re-render", async () => {
      const { rerender } = render(
        <CSelect
          options={mockStringOptions}
          allowFilter
          label="Test"
        />
      );

      const filterInput = screen.getByTestId("filter-input");
      fireEvent.change(filterInput, { target: { value: "Option 1" } });

      await waitFor(() => {
        expect(screen.getAllByTestId("styled-menu-item")).toHaveLength(1);
      });

      rerender(
        <CSelect
          options={mockStringOptions}
          allowFilter
          label="Test Updated"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByTestId("styled-menu-item")).toHaveLength(1);
      });
    });
  });
});
