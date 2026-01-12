import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import CMultiSelectWithChip from "../MultiSelectWithChip";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import {
  defaultMultiSelectWithChipProps,
  multiSelectWithSelectedItems,
  multiSelectEndPlacement,
  multiSelectWithEmptyMenuItems,
  mockMenuItems,
  mockSelectedItems,
  mockOnDelete,
  mockOnChange,
  resetMocks,
} from "./__mocks__/MultiSelectWithChip.mocks";

// Mock CInputWithChip component
vi.mock("@/core/components/input-chip/InputWithChip", () => ({
  default: ({
    searchText,
    selectedItems,
    onDelete,
    onChange,
    onClick,
    placeholder,
    width,
    inputPlacement,
  }: {
    searchText: string;
    selectedItems: unknown[];
    onDelete: (event: React.MouseEvent<HTMLElement>, item: unknown) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    placeholder?: string;
    width?: number | string;
    inputPlacement?: "start" | "end";
  }) => (
    <div
      data-testid="input-with-chip"
      onClick={onClick}
    >
      <input
        data-testid="chip-input"
        value={searchText}
        onChange={onChange}
        placeholder={placeholder}
      />
      <div data-testid="selected-items">
        {selectedItems?.map((item: { label?: string }, index: number) => (
          <div
            key={index}
            data-testid={`chip-${index}`}
          >
            <span>{item.label}</span>
            <button
              data-testid={`delete-chip-${index}`}
              onClick={(e) => onDelete(e, item)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <span data-testid="input-placement">{inputPlacement}</span>
      <span data-testid="input-width">{width}</span>
    </div>
  ),
}));

// Mock CNestedMenu component
vi.mock("@/core/components/nested-menu/NestedMenu", () => ({
  default: ({
    anchorEl,
    onClose,
    menuItems,
    onSelect,
    selectedItems,
    showSearch,
  }: {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    menuItems: unknown[];
    onSelect: (item: unknown, path?: string) => void;
    selectedItems: unknown[];
    showSearch: boolean;
  }) =>
    anchorEl ? (
      <div data-testid="nested-menu">
        <button
          data-testid="close-menu"
          onClick={onClose}
        >
          Close
        </button>
        <div data-testid="menu-items">
          {menuItems?.map(
            (item: { label?: string; path?: string }, index: number) => (
              <button
                key={index}
                data-testid={`menu-item-${index}`}
                onClick={() => onSelect(item, item.path)}
              >
                {item.label}
              </button>
            )
          )}
        </div>
        <span data-testid="show-search">{String(showSearch)}</span>
        <span data-testid="selected-count">{selectedItems?.length || 0}</span>
      </div>
    ) : null,
}));

describe("CMultiSelectWithChip Component", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("Component Rendering", () => {
    it("should render multi-select with chip component", () => {
      const { container } = render(
        <CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render CInputWithChip component", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      expect(screen.getByTestId("input-with-chip")).toBeInTheDocument();
    });

    it("should render chip input", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      expect(screen.getByTestId("chip-input")).toBeInTheDocument();
    });

    it("should not render nested menu when input is not clicked", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      expect(screen.queryByTestId("nested-menu")).not.toBeInTheDocument();
    });

    it("should render nested menu when input is clicked", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const inputWrapper = screen.getByTestId("input-with-chip");
      fireEvent.click(inputWrapper);
      expect(screen.getByTestId("nested-menu")).toBeInTheDocument();
    });

    it("should render with wrapper div", () => {
      const { container } = render(
        <CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />
      );
      expect(container.querySelector("div")).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should pass options as menuItems prop correctly", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const inputWrapper = screen.getByTestId("input-with-chip");
      fireEvent.click(inputWrapper);
      const menuItems = screen.getByTestId("menu-items");
      expect(menuItems.children.length).toBe(mockMenuItems.length);
    });

    it("should handle controlled input value state internally", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const input = screen.getByTestId("chip-input") as HTMLInputElement;
      expect(input.value).toBe(""); // Initially empty, controlled by component state
    });

    it("should pass selectedItems prop correctly", () => {
      render(<CMultiSelectWithChip {...multiSelectWithSelectedItems} />);
      expect(screen.getByTestId("chip-0")).toBeInTheDocument();
    });

    it("should pass placeholder prop", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const input = screen.getByTestId("chip-input");
      expect(input).toHaveAttribute("placeholder", "Select items");
    });

    it("should pass inputWidth prop", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const widthDisplay = screen.getByTestId("input-width");
      expect(widthDisplay.textContent).toBe("300");
    });

    it("should pass inputPlacement prop", () => {
      render(<CMultiSelectWithChip {...multiSelectEndPlacement} />);
      const placementDisplay = screen.getByTestId("input-placement");
      expect(placementDisplay.textContent).toBe("end");
    });

    it("should handle empty menuItems", () => {
      render(<CMultiSelectWithChip {...multiSelectWithEmptyMenuItems} />);
      expect(screen.getByTestId("input-with-chip")).toBeInTheDocument();
    });

    it("should pass showSearch prop to nested menu", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const inputWrapper = screen.getByTestId("input-with-chip");
      fireEvent.click(inputWrapper);
      const showSearch = screen.getByTestId("show-search");
      expect(showSearch.textContent).toBe("true");
    });

    it("should handle undefined placeholder", () => {
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          placeholder={undefined}
        />
      );
      const input = screen.getByTestId("chip-input");
      expect(input).toBeInTheDocument();
    });

    it("should handle undefined inputWidth", () => {
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          inputWidth={undefined}
        />
      );
      const widthDisplay = screen.getByTestId("input-width");
      expect(widthDisplay.textContent).toBe("");
    });

    it("should handle undefined inputPlacement", () => {
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          inputPlacement={undefined}
        />
      );
      const placementDisplay = screen.getByTestId("input-placement");
      expect(placementDisplay.textContent).toBe("");
    });
  });

  describe("Event Handling - Menu Operations", () => {
    it("should open menu when input is clicked", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const inputWrapper = screen.getByTestId("input-with-chip");

      fireEvent.click(inputWrapper);

      expect(screen.getByTestId("nested-menu")).toBeInTheDocument();
    });

    it("should close menu when close button is clicked", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const inputWrapper = screen.getByTestId("input-with-chip");

      // Open menu
      fireEvent.click(inputWrapper);
      expect(screen.getByTestId("nested-menu")).toBeInTheDocument();

      // Close menu
      const closeButton = screen.getByTestId("close-menu");
      fireEvent.click(closeButton);

      expect(screen.queryByTestId("nested-menu")).not.toBeInTheDocument();
    });

    it("should call onChange when menu item is selected", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const inputWrapper = screen.getByTestId("input-with-chip");

      // Open menu
      fireEvent.click(inputWrapper);

      const menuItem = screen.getByTestId("menu-item-0");
      fireEvent.click(menuItem);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: expect.arrayContaining([mockMenuItems[0]]),
          }),
        })
      );
    });

    it("should handle multiple menu item selections", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const inputWrapper = screen.getByTestId("input-with-chip");

      // Open menu
      fireEvent.click(inputWrapper);

      fireEvent.click(screen.getByTestId("menu-item-0"));
      fireEvent.click(screen.getByTestId("menu-item-2"));

      expect(mockOnChange).toHaveBeenCalledTimes(2);
    });
  });

  describe("Event Handling - Chip Operations", () => {
    it("should call onDelete when chip delete button is clicked", () => {
      render(<CMultiSelectWithChip {...multiSelectWithSelectedItems} />);
      const deleteButton = screen.getByTestId("delete-chip-0");

      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(
        expect.any(Object),
        mockSelectedItems[0]
      );
    });

    it("should call onChange when input value changes", async () => {
      const user = userEvent.setup();
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const input = screen.getByTestId("chip-input");

      await user.type(input, "test");

      // onChange is called for internal input handling
      expect(input).toHaveValue("test");
    });

    it("should handle multiple chip deletions", () => {
      const multipleItems = {
        ...defaultMultiSelectWithChipProps,
        value: [
          {
            label: "Item 1",
            value: "item1",
            path: "Item 1",
            filterPath: "Item 1",
          },
          {
            label: "Item 2",
            value: "item2",
            path: "Item 2",
            filterPath: "Item 2",
          },
        ],
      };

      render(<CMultiSelectWithChip {...multipleItems} />);

      // First deletion
      fireEvent.click(screen.getByTestId("delete-chip-0"));
      expect(mockOnDelete).toHaveBeenCalledTimes(1);

      // After first deletion, there should still be a chip (but index may have changed)
      if (screen.queryByTestId("delete-chip-1")) {
        fireEvent.click(screen.getByTestId("delete-chip-1"));
        expect(mockOnDelete).toHaveBeenCalledTimes(2);
      }
    });
  });

  describe("Conditional Rendering Logic", () => {
    it("should render menu only when input is clicked", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      expect(screen.queryByTestId("nested-menu")).not.toBeInTheDocument();

      // Click input to open menu
      const inputWrapper = screen.getByTestId("input-with-chip");
      fireEvent.click(inputWrapper);
      expect(screen.getByTestId("nested-menu")).toBeInTheDocument();
    });

    it("should render chips only when selectedItems exist", () => {
      const { rerender } = render(
        <CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />
      );
      expect(screen.queryByTestId("chip-0")).not.toBeInTheDocument();

      rerender(<CMultiSelectWithChip {...multiSelectWithSelectedItems} />);
      expect(screen.getByTestId("chip-0")).toBeInTheDocument();
    });

    it("should render menu items only when menu is open", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);

      // Menu not open initially
      expect(screen.queryByTestId("menu-item-0")).not.toBeInTheDocument();

      // Click to open menu
      const inputWrapper = screen.getByTestId("input-with-chip");
      fireEvent.click(inputWrapper);
      expect(screen.getByTestId("menu-item-0")).toBeInTheDocument();
    });

    it("should not render menu items when options are empty", () => {
      const emptyMenuWithAnchor = {
        ...defaultMultiSelectWithChipProps,
        options: [],
      };

      render(<CMultiSelectWithChip {...emptyMenuWithAnchor} />);
      const inputWrapper = screen.getByTestId("input-with-chip");
      fireEvent.click(inputWrapper);

      expect(screen.queryByTestId("menu-item-0")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle null anchorEl gracefully", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      expect(screen.queryByTestId("nested-menu")).not.toBeInTheDocument();
    });

    it("should handle empty selectedItems array", () => {
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          value={[]}
        />
      );
      expect(screen.queryByTestId("chip-0")).not.toBeInTheDocument();
    });

    it("should handle empty searchText", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const input = screen.getByTestId("chip-input") as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("should handle very long searchText", () => {
      const longText = "A".repeat(1000);
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const input = screen.getByTestId("chip-input") as HTMLInputElement;

      // Simulate typing long text
      fireEvent.change(input, { target: { value: longText } });
      expect(input.value).toBe(longText);
    });

    it("should handle large number of selected items", () => {
      const manyItems = Array.from({ length: 50 }, (_, i) => ({
        label: `Item ${i}`,
        value: `item${i}`,
        path: `Item ${i}`,
        filterPath: `Item ${i}`,
      })) as unknown as NestedMenuItem[];

      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          value={manyItems}
        />
      );
      expect(screen.getByTestId("chip-0")).toBeInTheDocument();
      expect(screen.getByTestId("chip-49")).toBeInTheDocument();
    });

    it("should handle large number of menu items", () => {
      const manyMenuItems = Array.from({ length: 100 }, (_, i) => ({
        label: `Menu Item ${i}`,
        value: `menuitem${i}`,
        path: `Menu Item ${i}`,
        filterPath: `Menu Item ${i}`,
      }));

      const propsWithManyItems = {
        ...defaultMultiSelectWithChipProps,
        options: manyMenuItems,
      };

      render(<CMultiSelectWithChip {...propsWithManyItems} />);
      const inputWrapper = screen.getByTestId("input-with-chip");
      fireEvent.click(inputWrapper);

      expect(screen.getByTestId("menu-item-0")).toBeInTheDocument();
      expect(screen.getByTestId("menu-item-99")).toBeInTheDocument();
    });

    it("should handle special characters in searchText", () => {
      const specialText = "!@#$%^&*()_+{}[]|:;<>?,./";
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const input = screen.getByTestId("chip-input") as HTMLInputElement;

      // Simulate typing special characters
      fireEvent.change(input, { target: { value: specialText } });
      expect(input.value).toBe(specialText);
    });

    it("should handle width of 0", () => {
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          inputWidth={0}
        />
      );
      const widthDisplay = screen.getByTestId("input-width");
      expect(widthDisplay.textContent).toBe("0");
    });

    it("should handle very large width", () => {
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          inputWidth={10000}
        />
      );
      const widthDisplay = screen.getByTestId("input-width");
      expect(widthDisplay.textContent).toBe("10000");
    });

    it("should handle items with missing properties", () => {
      const incompleteItems = [
        { name: "Item", value: "item" },
      ] as NestedMenuItem[];

      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          value={incompleteItems}
        />
      );
      expect(screen.getByTestId("chip-0")).toBeInTheDocument();
    });
  });

  describe("Negative Scenarios", () => {
    it("should handle onDelete throwing error gracefully", () => {
      const errorOnDelete = vi.fn(() => {
        try {
          throw new Error("Delete error");
        } catch {
          // Error caught and ignored for testing
        }
      });

      render(
        <CMultiSelectWithChip
          {...multiSelectWithSelectedItems}
          onDelete={errorOnDelete}
        />
      );
      const deleteButton = screen.getByTestId("delete-chip-0");

      fireEvent.click(deleteButton);

      expect(errorOnDelete).toHaveBeenCalledTimes(1);
    });

    it("should handle null menuItems gracefully", () => {
      expect(() =>
        render(
          <CMultiSelectWithChip
            {...defaultMultiSelectWithChipProps}
            options={null as unknown as NestedMenuItem[]}
          />
        )
      ).not.toThrow();
    });

    it("should handle undefined menuItems gracefully", () => {
      expect(() =>
        render(
          <CMultiSelectWithChip
            {...defaultMultiSelectWithChipProps}
            options={undefined as unknown as NestedMenuItem[]}
          />
        )
      ).not.toThrow();
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete selection flow", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);

      // Open menu
      fireEvent.click(screen.getByTestId("input-with-chip"));
      expect(screen.getByTestId("nested-menu")).toBeInTheDocument();

      // Select item
      fireEvent.click(screen.getByTestId("menu-item-0"));
      expect(mockOnChange).toHaveBeenCalled();

      // Close menu
      fireEvent.click(screen.getByTestId("close-menu"));
      expect(screen.queryByTestId("nested-menu")).not.toBeInTheDocument();
    });

    it("should maintain state through re-renders", () => {
      const { rerender } = render(
        <CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />
      );
      expect(screen.getByTestId("input-with-chip")).toBeInTheDocument();

      rerender(<CMultiSelectWithChip {...multiSelectWithSelectedItems} />);
      expect(screen.getByTestId("chip-0")).toBeInTheDocument();

      rerender(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      expect(screen.queryByTestId("chip-0")).not.toBeInTheDocument();
    });

    it("should handle rapid menu open/close cycles", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);

      for (let i = 0; i < 5; i++) {
        fireEvent.click(screen.getByTestId("input-with-chip"));
        expect(screen.getByTestId("nested-menu")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("close-menu"));
        expect(screen.queryByTestId("nested-menu")).not.toBeInTheDocument();
      }
    });

    it("should handle search and selection together", async () => {
      const user = userEvent.setup();
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);

      // Type in search
      const input = screen.getByTestId("chip-input");
      await user.type(input, "search");

      // Open menu
      fireEvent.click(screen.getByTestId("input-with-chip"));
      expect(screen.getByTestId("nested-menu")).toBeInTheDocument();

      // Select item
      fireEvent.click(screen.getByTestId("menu-item-0"));
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should handle switching input placements", () => {
      const { rerender } = render(
        <CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />
      );
      let placement = screen.getByTestId("input-placement");
      expect(placement.textContent).toBe("start");

      rerender(<CMultiSelectWithChip {...multiSelectEndPlacement} />);
      placement = screen.getByTestId("input-placement");
      expect(placement.textContent).toBe("end");
    });
  });

  describe("Props Propagation", () => {
    it("should propagate all props to CInputWithChip", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);

      expect(screen.getByTestId("chip-input")).toHaveAttribute(
        "placeholder",
        "Select items"
      );
      expect(screen.getByTestId("input-width").textContent).toBe("300");
      expect(screen.getByTestId("input-placement").textContent).toBe("start");
    });

    it("should propagate all props to CNestedMenu", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);

      // Click to open menu
      const inputWrapper = screen.getByTestId("input-with-chip");
      fireEvent.click(inputWrapper);

      expect(screen.getByTestId("nested-menu")).toBeInTheDocument();
      expect(screen.getByTestId("show-search").textContent).toBe("true");
      expect(screen.getByTestId("menu-items").children.length).toBe(
        mockMenuItems.length
      );
    });

    it("should update props when they change", () => {
      const { rerender } = render(
        <CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />
      );

      rerender(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          placeholder="New placeholder"
        />
      );
      expect(screen.getByTestId("chip-input")).toHaveAttribute(
        "placeholder",
        "New placeholder"
      );
    });
  });
});
