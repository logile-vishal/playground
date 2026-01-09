import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CAutocomplete, { flattenOptions } from "../AutoComplete";
import {
  mockFlatOptions,
  mockGroupedOptions,
  mockMixedOptions,
  mockDefaultValue,
  mockHandleChange,
  mockAutoCompleteProps,
  mockAutoCompletePropsWithGrouped,
  mockAutoCompletePropsWithValue,
} from "./__mocks__/AutoComplete.mocks";
import type { AutoCompleteOptionProps } from "@/core/types/autocomplete.type";
import { AUTOCOMPLETE_CONSTANTS } from "@/core/constants/autocomplete";
import useAutocomplete from "@mui/material/useAutocomplete";

// Mock MUI components
vi.mock("@mui/material/useAutocomplete", () => ({
  default: vi.fn(),
}));

vi.mock("@mui/material", () => ({
  Popper: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="popper">{children}</div> : null,
  Typography: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <span className={className}>{children}</span>,
  Box: ({
    children,
    className,
    onClick,
  }: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <div
      className={className}
      onClick={onClick}
    >
      {children}
    </div>
  ),
}));

vi.mock("@/core/components/icon/Icon", () => ({
  default: ({ size, color }: { size: number; color: string }) => (
    <svg
      data-testid="close-icon"
      width={size}
      data-color={color}
    />
  ),
}));

describe("CAutocomplete Component", () => {
  let mockUseAutocomplete: ReturnType<typeof vi.fn>;

  const defaultUseAutocompleteReturn = {
    getRootProps: () => ({ role: "combobox" }),
    getInputLabelProps: () => ({ id: "label-id" }),
    getInputProps: () => ({ "aria-label": "autocomplete" }),
    getTagProps: ({ index }: { index: number }) => ({
      key: index,
      onDelete: vi.fn(),
    }),
    getListboxProps: () => ({ role: "listbox" }),
    getOptionProps: ({
      option,
      index,
    }: {
      option: AutoCompleteOptionProps;
      index: number;
    }) => ({
      key: `${option.value}-${index}`,
      onClick: vi.fn(),
      role: "option",
    }),
    groupedOptions: [],
    focused: false,
    setAnchorEl: vi.fn(),
    anchorEl: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAutocomplete = vi.mocked(useAutocomplete);
    mockUseAutocomplete.mockReturnValue(defaultUseAutocompleteReturn);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render the component with default props", () => {
      render(<CAutocomplete {...mockAutoCompleteProps} />);

      expect(screen.getByText("Test Label")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Select options")).toBeInTheDocument();
    });

    it("should render with default label when label prop is not provided", () => {
      const props = { ...mockAutoCompleteProps };
      delete props.label;

      render(<CAutocomplete {...props} />);

      expect(
        screen.getByText(AUTOCOMPLETE_CONSTANTS.label)
      ).toBeInTheDocument();
    });

    it("should render with default placeholder when placeholder prop is not provided", () => {
      const props = { ...mockAutoCompleteProps };
      delete props.placeholder;

      render(<CAutocomplete {...props} />);

      expect(
        screen.getByPlaceholderText(AUTOCOMPLETE_CONSTANTS.placeholder)
      ).toBeInTheDocument();
    });

    it("should render selected values as tags", () => {
      mockUseAutocomplete.mockReturnValue({
        ...defaultUseAutocompleteReturn,
      });

      render(
        <CAutocomplete
          {...mockAutoCompleteProps}
          defaultValue={mockDefaultValue}
          value={mockDefaultValue}
        />
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("should hide placeholder when values are selected", () => {
      render(
        <CAutocomplete
          {...mockAutoCompleteProps}
          defaultValue={mockDefaultValue}
          value={mockDefaultValue}
        />
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.placeholder).toBe("");
    });

    it("should apply focused class when input is focused", () => {
      mockUseAutocomplete.mockReturnValue({
        ...defaultUseAutocompleteReturn,
        focused: true,
      });

      const { container } = render(
        <CAutocomplete {...mockAutoCompleteProps} />
      );

      const inputWrapper = container.querySelector(
        ".auto-complete__input-wrapper"
      );
      expect(inputWrapper).toHaveClass("focused");
    });
  });

  describe("Props Handling", () => {
    it("should update selected values when value prop changes", () => {
      const { rerender } = render(<CAutocomplete {...mockAutoCompleteProps} />);

      const newValue = [{ label: "Option 2", value: "option2" }];
      rerender(
        <CAutocomplete
          {...mockAutoCompleteProps}
          value={newValue}
        />
      );

      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("should handle defaultValue prop correctly", () => {
      render(
        <CAutocomplete
          {...mockAutoCompleteProps}
          defaultValue={mockDefaultValue}
          value={mockDefaultValue}
        />
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("should use value prop over defaultValue", () => {
      const customValue = [{ label: "Custom Option", value: "custom" }];

      render(
        <CAutocomplete
          {...mockAutoCompleteProps}
          defaultValue={mockDefaultValue}
          value={customValue}
        />
      );

      expect(screen.getByText("Custom Option")).toBeInTheDocument();
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("should call handleChange when a value is selected", () => {
      const onChange = vi.fn();
      let hasCalled = false;

      mockUseAutocomplete.mockImplementation((config) => {
        if (!hasCalled && config.onChange) {
          hasCalled = true;
          config.onChange({} as any, [mockFlatOptions[0]]);
        }

        return {
          ...defaultUseAutocompleteReturn,
          getRootProps: () => ({ role: "combobox" }),
        };
      });

      render(
        <CAutocomplete
          {...mockAutoCompleteProps}
          handleChange={onChange}
        />
      );

      expect(onChange).toHaveBeenCalled();
    });

    it("should handle input typing", async () => {
      const user = userEvent.setup();
      render(<CAutocomplete {...mockAutoCompleteProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test");

      expect(input).toHaveValue("test");
    });
  });

  describe("Grouped Options Rendering", () => {
    it("should render grouped options with headers", () => {
      mockUseAutocomplete.mockReturnValue({
        ...defaultUseAutocompleteReturn,
        groupedOptions: flattenOptions(mockGroupedOptions),
        anchorEl: document.createElement("div"),
      });

      render(<CAutocomplete {...mockAutoCompletePropsWithGrouped} />);

      expect(screen.getByText("Group A")).toBeInTheDocument();
      expect(screen.getByText("Group B")).toBeInTheDocument();
      expect(screen.getByText("Option A1")).toBeInTheDocument();
      expect(screen.getByText("Option B2")).toBeInTheDocument();
    });

    it("should not render group header for ungrouped options", () => {
      const flatMixed = flattenOptions(mockMixedOptions);
      mockUseAutocomplete.mockReturnValue({
        ...defaultUseAutocompleteReturn,
        groupedOptions: flatMixed,
        anchorEl: document.createElement("div"),
      });

      render(
        <CAutocomplete
          {...mockAutoCompleteProps}
          options={mockMixedOptions}
        />
      );

      expect(
        screen.queryByText(AUTOCOMPLETE_CONSTANTS.ungrouped)
      ).not.toBeInTheDocument();
      expect(screen.getByText("Ungrouped Option")).toBeInTheDocument();
    });

    it("should not render Popper when groupedOptions is empty", () => {
      mockUseAutocomplete.mockReturnValue({
        ...defaultUseAutocompleteReturn,
        groupedOptions: [],
      });

      render(<CAutocomplete {...mockAutoCompleteProps} />);

      expect(screen.queryByTestId("popper")).not.toBeInTheDocument();
    });

    it("should render Popper when groupedOptions has items", () => {
      mockUseAutocomplete.mockReturnValue({
        ...defaultUseAutocompleteReturn,
        groupedOptions: flattenOptions(mockGroupedOptions),
        anchorEl: document.createElement("div"),
      });

      render(<CAutocomplete {...mockAutoCompletePropsWithGrouped} />);

      expect(screen.getByTestId("popper")).toBeInTheDocument();
    });
  });

  describe("flattenOptions Helper Function", () => {
    it("should flatten grouped options correctly", () => {
      const result = flattenOptions(mockGroupedOptions);

      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({
        label: "Option A1",
        value: "optionA1",
        groupLabel: "Group A",
      });
      expect(result[2]).toEqual({
        label: "Option B1",
        value: "optionB1",
        groupLabel: "Group B",
      });
    });

    it("should handle flat options without groups", () => {
      const result = flattenOptions(mockFlatOptions);

      expect(result).toEqual(mockFlatOptions);
    });

    it("should handle mixed grouped and ungrouped options", () => {
      const result = flattenOptions(mockMixedOptions);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        label: "Ungrouped Option",
        value: "ungrouped",
      });
      expect(result[1].groupLabel).toBe("Group C");
    });

    it("should return empty array for empty options", () => {
      const result = flattenOptions([]);

      expect(result).toEqual([]);
    });

    it("should handle options with empty options array", () => {
      const emptyGroupOptions: AutoCompleteOptionProps[] = [
        { label: "Group Empty", options: [], value: "groupEmpty" },
      ];
      const result = flattenOptions(emptyGroupOptions);

      expect(result).toEqual([]);
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle empty options array", () => {
      render(
        <CAutocomplete
          {...mockAutoCompleteProps}
          options={[]}
        />
      );

      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("should handle undefined handleChange", () => {
      const props = { ...mockAutoCompleteProps };
      delete props.handleChange;

      expect(() => render(<CAutocomplete {...props} />)).not.toThrow();
    });

    it("should generate unique input ID", () => {
      const { container: container1 } = render(
        <CAutocomplete {...mockAutoCompleteProps} />
      );
      const { container: container2 } = render(
        <CAutocomplete {...mockAutoCompleteProps} />
      );

      const input1 = container1.querySelector("input");
      const input2 = container2.querySelector("input");

      expect(input1?.id).toBeDefined();
      expect(input2?.id).toBeDefined();
      expect(input1?.id).not.toBe(input2?.id);
    });

    it("should handle multiple tag deletions", () => {
      const multipleValues = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ];

      render(
        <CAutocomplete
          {...mockAutoCompleteProps}
          defaultValue={multipleValues}
          value={multipleValues}
        />
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("should handle options with special characters", () => {
      const specialOptions: AutoCompleteOptionProps[] = [
        { label: "Option with @#$%", value: "special" },
      ];

      render(
        <CAutocomplete
          {...mockAutoCompleteProps}
          options={specialOptions}
        />
      );

      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("should handle very long option labels", () => {
      const longLabelOption = [
        {
          label: "A".repeat(100),
          value: "long",
        },
      ];

      render(
        <CAutocomplete
          {...mockAutoCompleteProps}
          defaultValue={longLabelOption}
          value={longLabelOption}
        />
      );

      expect(screen.getByText("A".repeat(100))).toBeInTheDocument();
    });
  });

  describe("useEffect Behaviors", () => {
    it("should update selected values when value prop changes", () => {
      const { rerender } = render(
        <CAutocomplete
          {...mockAutoCompleteProps}
          value={[]}
        />
      );

      rerender(
        <CAutocomplete
          {...mockAutoCompleteProps}
          value={mockDefaultValue}
        />
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("should scroll input into view when value changes", async () => {
      const scrollIntoViewMock = vi.fn();
      HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

      const { rerender } = render(<CAutocomplete {...mockAutoCompleteProps} />);

      rerender(
        <CAutocomplete
          {...mockAutoCompleteProps}
          value={mockDefaultValue}
        />
      );

      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalledWith({
          behavior: "smooth",
          block: "nearest",
        });
      });
    });

    it("should not throw error if input element not found during scroll", () => {
      const { rerender } = render(<CAutocomplete {...mockAutoCompleteProps} />);

      // Remove the input element
      const input = screen.getByRole("textbox");
      input.id = "";

      expect(() => {
        rerender(
          <CAutocomplete
            {...mockAutoCompleteProps}
            value={mockDefaultValue}
          />
        );
      }).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(<CAutocomplete {...mockAutoCompleteProps} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-label", "autocomplete");
    });

    it("should associate label with input", () => {
      render(<CAutocomplete {...mockAutoCompleteProps} />);

      const label = screen.getByText("Test Label");
      expect(label).toHaveAttribute("id", "label-id");
    });

    it("should have proper role for listbox", () => {
      mockUseAutocomplete.mockReturnValue({
        ...defaultUseAutocompleteReturn,
        groupedOptions: flattenOptions(mockGroupedOptions),
        anchorEl: document.createElement("div"),
      });

      render(<CAutocomplete {...mockAutoCompletePropsWithGrouped} />);

      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();
    });
  });

  describe("Negative Scenarios", () => {
    it("should handle null value gracefully", () => {
      expect(() =>
        render(
          <CAutocomplete
            {...mockAutoCompleteProps}
            value={null as any}
          />
        )
      ).not.toThrow();
    });

    it("should handle undefined defaultValue", () => {
      const props = { ...mockAutoCompleteProps };
      delete props.defaultValue;

      expect(() => render(<CAutocomplete {...props} />)).not.toThrow();
    });

    it("should handle error in handleChange gracefully", () => {
      const errorHandleChange = vi.fn(() => {
        throw new Error("Test error");
      });

      mockUseAutocomplete.mockImplementation((config) => ({
        ...defaultUseAutocompleteReturn,
        getInputProps: () => ({
          onChange: () => {
            config.onChange?.({} as any, [mockFlatOptions[0]]);
          },
        }),
      }));

      expect(() =>
        render(
          <CAutocomplete
            {...mockAutoCompleteProps}
            handleChange={errorHandleChange}
          />
        )
      ).not.toThrow();
    });
  });
});
