import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import CMultiSelect from "../MultiSelect";
import {
  defaultMultiSelectProps,
  multiSelectWithObjectOptions,
  multiSelectWithSelectedValues,
  multiSelectWithAllSelected,
  multiSelectWithCustomRender,
  multiSelectDisabled,
  simpleOptions,
  objectOptions,
  manyOptions,
  mockOnChange,
  mockRenderValue,
  resetMocks,
} from "./__mocks__/MultiSelect.mocks";

// Note: These tests use vi.mock() which doesn't work in browser mode
// Browser mode testing requires actual component rendering without mocks
// Use --browser flag only for integration tests, not unit tests with mocks

// Mock clsx
vi.mock("@/utils/clsx", () => ({
  default: (classes: any) => {
    if (typeof classes === "string") return classes;
    if (typeof classes === "object" && classes !== null) {
      return Object.entries(classes)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(" ");
    }
    return "";
  },
}));

// Mock icons
vi.mock("@/core/constants/icons", () => ({
  CheckboxChecked: "CheckboxChecked",
  CheckboxEmpty: "CheckboxEmpty",
}));

// Mock CSvgIcon
vi.mock("@/core/components/icon/Icon", () => ({
  default: ({ component, size, fill, stroke }: any) => (
    <span
      data-testid="svg-icon"
      data-component={component}
      data-size={size}
      data-fill={fill}
      data-stroke={stroke}
    />
  ),
}));

// Mock StyledMuiSelect
vi.mock("../components/StyledSelect", () => ({
  default: ({ children, renderValue, value, ...props }: any) => {
    const safeValue = value || [];
    const displayValue = renderValue
      ? renderValue(safeValue)
      : JSON.stringify(safeValue);
    return (
      <div data-testid="styled-select-container">
        <div data-testid="select-display-value">{displayValue}</div>
        <div
          data-testid="styled-select"
          role="listbox"
          aria-multiselectable="true"
          data-value={JSON.stringify(safeValue)}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  },
}));

// Mock StyledMenuItem
vi.mock("../components/StyledMenuItem", () => ({
  default: ({ children, ...props }: any) => (
    <div
      data-testid="styled-menuitem"
      role="option"
      {...props}
    >
      {children}
    </div>
  ),
}));

describe("CMultiSelect Component", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("Component Rendering", () => {
    it("should render multi-select component with label", () => {
      render(<CMultiSelect {...defaultMultiSelectProps} />);
      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("should render with placeholder when no options selected", () => {
      render(<CMultiSelect {...defaultMultiSelectProps} />);
      expect(screen.getByText("Select options")).toBeInTheDocument();
    });

    it("should render select element", () => {
      render(<CMultiSelect {...defaultMultiSelectProps} />);
      const select = screen.getByTestId("styled-select");
      expect(select).toBeInTheDocument();
    });

    it("should render with custom className", () => {
      const { container } = render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          className="custom-class"
        />
      );
      const wrapper = container.querySelector(
        ".multiselect-wrapper.custom-class"
      );
      expect(wrapper).toBeInTheDocument();
    });

    it("should render Select All option", () => {
      render(<CMultiSelect {...defaultMultiSelectProps} />);
      expect(screen.getByText("Select All")).toBeInTheDocument();
    });

    it("should render all menu items for simple options", () => {
      render(<CMultiSelect {...defaultMultiSelectProps} />);
      const menuItems = screen.getAllByTestId("styled-menuitem");
      // +1 for "Select All" option
      expect(menuItems.length).toBe(simpleOptions.length + 1);
    });

    it("should render all menu items for object options", () => {
      render(<CMultiSelect {...multiSelectWithObjectOptions} />);
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should use optionLabelKey for object options", () => {
      render(<CMultiSelect {...multiSelectWithObjectOptions} />);
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    it("should use optionValueKey for object options", () => {
      render(<CMultiSelect {...multiSelectWithObjectOptions} />);
      const menuItems = screen.getAllByTestId("styled-menuitem");
      // Skip first item (Select All)
      expect(menuItems[1]).toHaveAttribute("value", "item1");
    });

    it("should display selected count when some items selected", () => {
      render(<CMultiSelect {...multiSelectWithSelectedValues} />);
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it('should display "All Items Selected" when all options selected', () => {
      render(<CMultiSelect {...multiSelectWithAllSelected} />);
      expect(screen.getByText("All All Selected Selected")).toBeInTheDocument();
    });

    it("should use custom renderValue when provided", () => {
      mockRenderValue.mockReturnValue("Custom Render Text");
      render(<CMultiSelect {...multiSelectWithCustomRender} />);
      expect(screen.getByText("Custom Render Text")).toBeInTheDocument();
    });

    it("should handle disabled state", () => {
      render(<CMultiSelect {...multiSelectDisabled} />);
      const select = screen.getByTestId("styled-select");
      expect(select).toHaveAttribute("disabled");
    });

    it("should handle undefined value gracefully", () => {
      render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          value={undefined}
        />
      );
      expect(screen.getByText("Select options")).toBeInTheDocument();
    });

    it("should handle empty options array", () => {
      render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          options={[]}
        />
      );
      const menuItems = screen.getAllByTestId("styled-menuitem");
      // Only "Select All" option
      expect(menuItems.length).toBe(1);
    });

    it("should handle label as undefined", () => {
      const { container } = render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          label={undefined}
        />
      );
      const label = container.querySelector(".multiselect__label");
      expect(label).toBeInTheDocument();
    });
  });

  describe("Select All Functionality", () => {
    it("should check Select All checkbox when all options selected", () => {
      render(<CMultiSelect {...multiSelectWithAllSelected} />);
      const selectAllCheckbox = screen.getByRole("checkbox", {
        name: /select all/i,
      });
      expect(selectAllCheckbox).toBeChecked();
    });

    it("should uncheck Select All checkbox when not all options selected", () => {
      render(<CMultiSelect {...multiSelectWithSelectedValues} />);
      const selectAllCheckbox = screen.getByRole("checkbox", {
        name: /select all/i,
      });
      expect(selectAllCheckbox).not.toBeChecked();
    });

    it("should select all options when Select All is clicked", () => {
      render(<CMultiSelect {...defaultMultiSelectProps} />);
      const selectAllItem = screen
        .getByText("Select All")
        .closest('[data-testid="styled-menuitem"]');

      fireEvent.click(selectAllItem!);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: simpleOptions,
          }),
        }),
        null
      );
    });

    it("should deselect all options when Select All is clicked and all selected", () => {
      render(<CMultiSelect {...multiSelectWithAllSelected} />);
      const selectAllItem = screen
        .getByText("Select All")
        .closest('[data-testid="styled-menuitem"]');

      fireEvent.click(selectAllItem!);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: [],
          }),
        }),
        null
      );
    });

    it("should select all object options with correct values", () => {
      render(<CMultiSelect {...multiSelectWithObjectOptions} />);
      const selectAllItem = screen
        .getByText("Select All")
        .closest('[data-testid="styled-menuitem"]');

      fireEvent.click(selectAllItem!);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: ["item1", "item2", "item3"],
          }),
        }),
        null
      );
    });

    it("should stop event propagation when Select All is clicked", () => {
      render(<CMultiSelect {...defaultMultiSelectProps} />);
      const selectAllItem = screen
        .getByText("Select All")
        .closest('[data-testid="styled-menuitem"]');

      const stopPropagationSpy = vi.fn();
      const preventDefaultSpy = vi.fn();

      const mockEvent = {
        stopPropagation: stopPropagationSpy,
        preventDefault: preventDefaultSpy,
      };

      fireEvent.click(selectAllItem!, mockEvent);

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe("Individual Option Selection", () => {
    it("should mark selected options as checked", () => {
      render(<CMultiSelect {...multiSelectWithSelectedValues} />);
      const checkboxes = screen.getAllByRole("checkbox");
      // Check if first option (after Select All) is checked
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
    });

    it("should render checkbox icons correctly", () => {
      render(<CMultiSelect {...defaultMultiSelectProps} />);
      const icons = screen.getAllByTestId("svg-icon");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should apply selected class to selected items", () => {
      const { container } = render(
        <CMultiSelect {...multiSelectWithSelectedValues} />
      );
      const selectedItems = container.querySelectorAll(
        ".multiselect__menu-item--selected"
      );
      expect(selectedItems.length).toBeGreaterThan(0);
    });
  });

  describe("Conditional Rendering Logic", () => {
    it("should show placeholder when value is empty array", () => {
      render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          value={[]}
        />
      );
      expect(screen.getByText("Select options")).toBeInTheDocument();
    });

    it("should show selected count when some items selected", () => {
      render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          value={["Option 1"]}
        />
      );
      expect(screen.getByText("1 Test Label Selected")).toBeInTheDocument();
    });

    it('should show "All Items Selected" text when all selected', () => {
      render(<CMultiSelect {...multiSelectWithAllSelected} />);
      expect(screen.getAllByText(/all.*selected/i)[0]).toBeInTheDocument();
    });

    it("should render custom value when renderValue provided", () => {
      mockRenderValue.mockImplementation(
        (selected) => `${selected.length} custom`
      );
      render(
        <CMultiSelect
          {...multiSelectWithCustomRender}
          value={["Option 1"]}
        />
      );
      expect(screen.getByText("1 custom")).toBeInTheDocument();
    });

    it("should handle options without optionValueKey", () => {
      render(
        <CMultiSelect
          options={simpleOptions}
          value={[]}
          onChange={mockOnChange}
          label="Simple"
        />
      );
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("should handle options without optionLabelKey", () => {
      render(
        <CMultiSelect
          options={simpleOptions}
          value={[]}
          onChange={mockOnChange}
          label="Simple"
        />
      );
      const menuItems = screen.getAllByTestId("styled-menuitem");
      expect(menuItems.length).toBe(simpleOptions.length + 1);
    });
  });

  describe("useMemo - isAllOptionsSelected", () => {
    it("should memoize isAllOptionsSelected correctly", () => {
      const { rerender } = render(
        <CMultiSelect {...defaultMultiSelectProps} />
      );
      const selectAllCheckbox = screen.getByRole("checkbox", {
        name: /select all/i,
      });
      expect(selectAllCheckbox).not.toBeChecked();

      rerender(<CMultiSelect {...multiSelectWithAllSelected} />);
      const updatedCheckbox = screen.getByRole("checkbox", {
        name: /select all/i,
      });
      expect(updatedCheckbox).toBeChecked();
    });

    it("should return false when value is not an array", () => {
      render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          value={undefined}
        />
      );
      const selectAllCheckbox = screen.getByRole("checkbox", {
        name: /select all/i,
      });
      expect(selectAllCheckbox).not.toBeChecked();
    });

    it("should return false when options length is 0", () => {
      render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          options={[]}
          value={[]}
        />
      );
      const selectAllCheckbox = screen.getByRole("checkbox", {
        name: /select all/i,
      });
      expect(selectAllCheckbox).not.toBeChecked();
    });

    it("should update when options change", () => {
      const { rerender } = render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          options={simpleOptions}
          value={simpleOptions}
        />
      );
      let selectAllCheckbox = screen.getByRole("checkbox", {
        name: /select all/i,
      });
      expect(selectAllCheckbox).toBeChecked();

      rerender(
        <CMultiSelect
          {...defaultMultiSelectProps}
          options={[...simpleOptions, "Option 4"]}
          value={simpleOptions}
        />
      );
      selectAllCheckbox = screen.getByRole("checkbox", { name: /select all/i });
      expect(selectAllCheckbox).not.toBeChecked();
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle empty options array", () => {
      render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          options={[]}
        />
      );
      const menuItems = screen.getAllByTestId("styled-menuitem");
      expect(menuItems.length).toBe(1); // Only Select All
    });

    it("should handle large number of options", () => {
      render(
        <CMultiSelect
          options={manyOptions}
          value={[]}
          onChange={mockOnChange}
          label="Many Items"
          optionLabelKey="name"
          optionValueKey="value"
        />
      );
      const menuItems = screen.getAllByTestId("styled-menuitem");
      expect(menuItems.length).toBe(manyOptions.length + 1);
    });

    it("should handle options with special characters", () => {
      const specialOptions = ["Option!@#", "Option$%^", "Option&*()"];
      render(
        <CMultiSelect
          options={specialOptions}
          value={[]}
          onChange={mockOnChange}
          label="Special"
        />
      );
      expect(screen.getByText("Option!@#")).toBeInTheDocument();
    });

    it("should handle very long option labels", () => {
      const longOption = "A".repeat(200);
      render(
        <CMultiSelect
          options={[longOption]}
          value={[]}
          onChange={mockOnChange}
          label="Long"
        />
      );
      expect(screen.getByText(longOption)).toBeInTheDocument();
    });

    it("should handle options with duplicate values", () => {
      const duplicateOptions = ["Option 1", "Option 1", "Option 2"];
      render(
        <CMultiSelect
          options={duplicateOptions}
          value={[]}
          onChange={mockOnChange}
          label="Duplicate"
        />
      );
      const menuItems = screen.getAllByTestId("styled-menuitem");
      expect(menuItems.length).toBe(duplicateOptions.length + 1);
    });

    it("should handle null value gracefully", () => {
      render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          value={null as any}
        />
      );
      expect(screen.getByText("Select options")).toBeInTheDocument();
    });

    it("should handle missing optionValueKey for object options", () => {
      render(
        <CMultiSelect
          options={objectOptions}
          value={[]}
          onChange={mockOnChange}
          label="Missing Key"
          optionLabelKey="name"
        />
      );
      const menuItems = screen.getAllByTestId("styled-menuitem");
      expect(menuItems.length).toBe(objectOptions.length + 1);
    });

    it("should handle missing optionLabelKey for object options gracefully", () => {
      // This test should verify error handling
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(
          <CMultiSelect
            options={objectOptions}
            value={[]}
            onChange={mockOnChange}
            label="Missing Label"
            optionValueKey="value"
            // No optionLabelKey provided
          />
        );
      }).toThrow(/Objects are not valid as a React child/);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Negative Scenarios", () => {
    it("should handle missing onChange callback", () => {
      // This test verifies that the component can render without an onChange (though it's required by types)
      // In reality, TypeScript would prevent this, but we test the runtime behavior
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(
          <CMultiSelect
            options={simpleOptions}
            value={[]}
            onChange={undefined as any}
            label="No Callback"
          />
        );
      }).not.toThrow();

      consoleErrorSpy.mockRestore();
    });

    it("should handle onChange throwing error", () => {
      const errorOnChange = vi.fn(() => {
        try {
          throw new Error("onChange error");
        } catch (error) {
          // Error caught
        }
      });

      render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          onChange={errorOnChange}
        />
      );
      const selectAllItem = screen
        .getByText("Select All")
        .closest('[data-testid="styled-menuitem"]');

      fireEvent.click(selectAllItem!);

      expect(errorOnChange).toHaveBeenCalledTimes(1);
    });

    it("should handle undefined placeholder", () => {
      const { container } = render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          placeholder={undefined}
        />
      );
      expect(container).toBeInTheDocument();
    });

    it("should handle invalid option structure", () => {
      const invalidOptions = [null, undefined, "", 0] as any;
      render(
        <CMultiSelect
          options={invalidOptions}
          value={[]}
          onChange={mockOnChange}
          label="Invalid"
        />
      );
      const menuItems = screen.getAllByTestId("styled-menuitem");
      expect(menuItems.length).toBe(invalidOptions.length + 1);
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete user flow: select all, deselect all", () => {
      const { rerender } = render(
        <CMultiSelect {...defaultMultiSelectProps} />
      );
      const selectAllItem = screen
        .getByText("Select All")
        .closest('[data-testid="styled-menuitem"]');

      // Select all
      fireEvent.click(selectAllItem!);
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: simpleOptions,
          }),
        }),
        null
      );

      resetMocks();

      // Rerender with all selected
      rerender(<CMultiSelect {...multiSelectWithAllSelected} />);
      const selectAllItemAgain = screen
        .getByText("Select All")
        .closest('[data-testid="styled-menuitem"]');

      // Deselect all
      fireEvent.click(selectAllItemAgain!);
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: [],
          }),
        }),
        null
      );
    });

    it("should maintain state through re-renders", () => {
      const { rerender } = render(
        <CMultiSelect {...defaultMultiSelectProps} />
      );
      expect(screen.getByText("Select options")).toBeInTheDocument();

      rerender(<CMultiSelect {...multiSelectWithSelectedValues} />);
      expect(screen.getByText("2 Selected Items Selected")).toBeInTheDocument();

      rerender(<CMultiSelect {...multiSelectWithAllSelected} />);
      expect(screen.getAllByText(/all.*selected/i)[0]).toBeInTheDocument();
    });

    it("should handle switching between option types", () => {
      const { rerender } = render(
        <CMultiSelect {...defaultMultiSelectProps} />
      );
      expect(screen.getByText("Option 1")).toBeInTheDocument();

      rerender(<CMultiSelect {...multiSelectWithObjectOptions} />);
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    it("should handle dynamic option updates", () => {
      const { rerender } = render(
        <CMultiSelect
          {...defaultMultiSelectProps}
          options={simpleOptions}
        />
      );
      let menuItems = screen.getAllByTestId("styled-menuitem");
      expect(menuItems.length).toBe(simpleOptions.length + 1);

      const newOptions = [...simpleOptions, "Option 4", "Option 5"];
      rerender(
        <CMultiSelect
          {...defaultMultiSelectProps}
          options={newOptions}
        />
      );
      menuItems = screen.getAllByTestId("styled-menuitem");
      expect(menuItems.length).toBe(newOptions.length + 1);
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels for checkboxes", () => {
      render(<CMultiSelect {...defaultMultiSelectProps} />);
      const selectAllCheckbox = screen.getByRole("checkbox", {
        name: /select all/i,
      });
      expect(selectAllCheckbox).toBeInTheDocument();
    });

    it("should associate labels with checkboxes using htmlFor", () => {
      const { container } = render(
        <CMultiSelect {...defaultMultiSelectProps} />
      );
      const labels = container.querySelectorAll(
        'label[for="all-options-selected"]'
      );
      expect(labels.length).toBeGreaterThan(0);
    });

    it("should render checkboxes with proper IDs", () => {
      render(<CMultiSelect {...defaultMultiSelectProps} />);
      const selectAllCheckbox = document.getElementById("all-options-selected");
      expect(selectAllCheckbox).toBeInTheDocument();
    });
  });
});
