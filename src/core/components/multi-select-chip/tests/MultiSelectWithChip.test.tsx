import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import CMultiSelectWithChip from "../MultiSelectWithChip";
import {
  defaultMultiSelectWithChipProps,
  multiSelectWithAnchorEl,
  multiSelectWithSelectedItems,
  multiSelectWithSearchText,
  multiSelectEndPlacement,
  multiSelectWithEmptyMenuItems,
  mockMenuItems,
  mockSelectedItems,
  mockOnMenuOpen,
  mockOnMenuClose,
  mockOnDelete,
  mockOnChange,
  mockOnMenuItemSelect,
  resetMocks,
} from "./__mocks__/MultiSelectWithChip.mocks";

// Mock CInputWithChip component
vi.mock("@/core/components/input-chip/InputWithChip", () => ({
  default: ({
    searchText,
    selectedItems,
    onDelete,
    onChange,
    onMenuOpen,
    placeholder,
    width,
    inputPlacement,
  }: any) => (
    <div data-testid="input-with-chip">
      <input
        data-testid="chip-input"
        value={searchText}
        onChange={onChange}
        placeholder={placeholder}
        onClick={onMenuOpen}
      />
      <div data-testid="selected-items">
        {selectedItems?.map((item: any, index: number) => (
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
    onMenuItemSelect,
    selectedItems,
    showSearch,
  }: any) =>
    anchorEl ? (
      <div data-testid="nested-menu">
        <button
          data-testid="close-menu"
          onClick={onClose}
        >
          Close
        </button>
        <div data-testid="menu-items">
          {menuItems?.map((item: any, index: number) => (
            <button
              key={index}
              data-testid={`menu-item-${index}`}
              onClick={() => onMenuItemSelect(item, item.path)}
            >
              {item.label}
            </button>
          ))}
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

    it("should not render nested menu when anchorEl is null", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      expect(screen.queryByTestId("nested-menu")).not.toBeInTheDocument();
    });

    it("should render nested menu when anchorEl is provided", () => {
      render(<CMultiSelectWithChip {...multiSelectWithAnchorEl} />);
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
    it("should pass anchorEl prop to nested menu", () => {
      render(<CMultiSelectWithChip {...multiSelectWithAnchorEl} />);
      expect(screen.getByTestId("nested-menu")).toBeInTheDocument();
    });

    it("should pass menuItems prop correctly", () => {
      render(<CMultiSelectWithChip {...multiSelectWithAnchorEl} />);
      const menuItems = screen.getByTestId("menu-items");
      expect(menuItems.children.length).toBe(mockMenuItems.length);
    });

    it("should pass searchText prop to input", () => {
      render(<CMultiSelectWithChip {...multiSelectWithSearchText} />);
      const input = screen.getByTestId("chip-input") as HTMLInputElement;
      expect(input.value).toBe("search query");
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

    it("should pass width prop", () => {
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
      render(<CMultiSelectWithChip {...multiSelectWithAnchorEl} />);
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

    it("should handle undefined width", () => {
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          width={undefined}
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
    it("should call onMenuOpen when input is clicked", () => {
      render(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      const input = screen.getByTestId("chip-input");

      fireEvent.click(input);

      expect(mockOnMenuOpen).toHaveBeenCalledTimes(1);
    });

    it("should call onMenuClose when close button is clicked", () => {
      render(<CMultiSelectWithChip {...multiSelectWithAnchorEl} />);
      const closeButton = screen.getByTestId("close-menu");

      fireEvent.click(closeButton);

      expect(mockOnMenuClose).toHaveBeenCalledTimes(1);
    });

    it("should call onMenuItemSelect when menu item is clicked", () => {
      render(<CMultiSelectWithChip {...multiSelectWithAnchorEl} />);
      const menuItem = screen.getByTestId("menu-item-0");

      fireEvent.click(menuItem);

      expect(mockOnMenuItemSelect).toHaveBeenCalledTimes(1);
      expect(mockOnMenuItemSelect).toHaveBeenCalledWith(
        mockMenuItems[0],
        mockMenuItems[0].path
      );
    });

    it("should handle multiple menu item selections", () => {
      render(<CMultiSelectWithChip {...multiSelectWithAnchorEl} />);

      fireEvent.click(screen.getByTestId("menu-item-0"));
      fireEvent.click(screen.getByTestId("menu-item-1"));
      fireEvent.click(screen.getByTestId("menu-item-2"));

      expect(mockOnMenuItemSelect).toHaveBeenCalledTimes(3);
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

      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should handle multiple chip deletions", () => {
      const multipleItems = {
        ...defaultMultiSelectWithChipProps,
        selectedItems: [
          mockSelectedItems[0],
          { name: "Item 2", value: "item2", path: "Item 2" },
        ],
      };

      render(<CMultiSelectWithChip {...multipleItems} />);

      fireEvent.click(screen.getByTestId("delete-chip-0"));
      fireEvent.click(screen.getByTestId("delete-chip-1"));

      expect(mockOnDelete).toHaveBeenCalledTimes(2);
    });
  });

  describe("Conditional Rendering Logic", () => {
    it("should render menu only when anchorEl is not null", () => {
      const { rerender } = render(
        <CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />
      );
      expect(screen.queryByTestId("nested-menu")).not.toBeInTheDocument();

      rerender(<CMultiSelectWithChip {...multiSelectWithAnchorEl} />);
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

    it("should render menu items only when menuItems exist", () => {
      render(<CMultiSelectWithChip {...multiSelectWithAnchorEl} />);
      expect(screen.getByTestId("menu-item-0")).toBeInTheDocument();
    });

    it("should not render menu items when empty", () => {
      const emptyMenuWithAnchor = {
        ...multiSelectWithEmptyMenuItems,
        anchorEl: document.createElement("div"),
      };

      render(<CMultiSelectWithChip {...emptyMenuWithAnchor} />);
      expect(screen.queryByTestId("menu-item-0")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle null anchorEl gracefully", () => {
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          anchorEl={null}
        />
      );
      expect(screen.queryByTestId("nested-menu")).not.toBeInTheDocument();
    });

    it("should handle empty selectedItems array", () => {
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          selectedItems={[]}
        />
      );
      expect(screen.queryByTestId("chip-0")).not.toBeInTheDocument();
    });

    it("should handle empty searchText", () => {
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          searchText=""
        />
      );
      const input = screen.getByTestId("chip-input") as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("should handle very long searchText", () => {
      const longText = "A".repeat(1000);
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          searchText={longText}
        />
      );
      const input = screen.getByTestId("chip-input") as HTMLInputElement;
      expect(input.value).toBe(longText);
    });

    it("should handle large number of selected items", () => {
      const manyItems = Array.from({ length: 50 }, (_, i) => ({
        name: `Item ${i}`,
        value: `item${i}`,
        path: `Item ${i}`,
      }));

      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          selectedItems={manyItems}
        />
      );
      expect(screen.getByTestId("chip-0")).toBeInTheDocument();
      expect(screen.getByTestId("chip-49")).toBeInTheDocument();
    });

    it("should handle large number of menu items", () => {
      const manyMenuItems = Array.from({ length: 100 }, (_, i) => ({
        name: `Menu Item ${i}`,
        value: `menuitem${i}`,
        path: `Menu Item ${i}`,
      }));

      const propsWithManyItems = {
        ...multiSelectWithAnchorEl,
        menuItems: manyMenuItems,
      };

      render(<CMultiSelectWithChip {...propsWithManyItems} />);
      expect(screen.getByTestId("menu-item-0")).toBeInTheDocument();
      expect(screen.getByTestId("menu-item-99")).toBeInTheDocument();
    });

    it("should handle special characters in searchText", () => {
      const specialText = "!@#$%^&*()_+{}[]|:;<>?,./";
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          searchText={specialText}
        />
      );
      const input = screen.getByTestId("chip-input") as HTMLInputElement;
      expect(input.value).toBe(specialText);
    });

    it("should handle width of 0", () => {
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          width={0}
        />
      );
      const widthDisplay = screen.getByTestId("input-width");
      expect(widthDisplay.textContent).toBe("0");
    });

    it("should handle very large width", () => {
      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          width={10000}
        />
      );
      const widthDisplay = screen.getByTestId("input-width");
      expect(widthDisplay.textContent).toBe("10000");
    });

    it("should handle items with missing properties", () => {
      const incompleteItems = [{ label: "Item", value: "item" } as any];

      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          selectedItems={incompleteItems}
        />
      );
      expect(screen.getByTestId("chip-0")).toBeInTheDocument();
    });
  });

  describe("Negative Scenarios", () => {
    it("should handle onMenuOpen throwing error", () => {
      const errorOnMenuOpen = vi.fn(() => {
        try {
          throw new Error("Menu open error");
        } catch (error) {
          // Error caught
        }
      });

      render(
        <CMultiSelectWithChip
          {...defaultMultiSelectWithChipProps}
          onMenuOpen={errorOnMenuOpen}
        />
      );
      const input = screen.getByTestId("chip-input");

      fireEvent.click(input);

      expect(errorOnMenuOpen).toHaveBeenCalledTimes(1);
    });

    it("should handle onMenuClose throwing error", () => {
      const errorOnMenuClose = vi.fn(() => {
        try {
          throw new Error("Menu close error");
        } catch (error) {
          // Error caught
        }
      });

      render(
        <CMultiSelectWithChip
          {...multiSelectWithAnchorEl}
          onMenuClose={errorOnMenuClose}
        />
      );
      const closeButton = screen.getByTestId("close-menu");

      fireEvent.click(closeButton);

      expect(errorOnMenuClose).toHaveBeenCalledTimes(1);
    });

    it("should handle onDelete throwing error", () => {
      const errorOnDelete = vi.fn(() => {
        try {
          throw new Error("Delete error");
        } catch (error) {
          // Error caught
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

    it("should handle onMenuItemSelect throwing error", () => {
      const errorOnMenuItemSelect = vi.fn(() => {
        try {
          throw new Error("Select error");
        } catch (error) {
          // Error caught
        }
      });

      render(
        <CMultiSelectWithChip
          {...multiSelectWithAnchorEl}
          onMenuItemSelect={errorOnMenuItemSelect}
        />
      );
      const menuItem = screen.getByTestId("menu-item-0");

      fireEvent.click(menuItem);

      expect(errorOnMenuItemSelect).toHaveBeenCalledTimes(1);
    });

    it("should handle null menuItems gracefully", () => {
      expect(() =>
        render(
          <CMultiSelectWithChip
            {...defaultMultiSelectWithChipProps}
            menuItems={null as any}
          />
        )
      ).not.toThrow();
    });

    it("should handle undefined menuItems gracefully", () => {
      expect(() =>
        render(
          <CMultiSelectWithChip
            {...defaultMultiSelectWithChipProps}
            menuItems={undefined as any}
          />
        )
      ).not.toThrow();
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete selection flow", () => {
      const { rerender } = render(
        <CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />
      );

      // Open menu
      fireEvent.click(screen.getByTestId("chip-input"));
      expect(mockOnMenuOpen).toHaveBeenCalled();

      // Render with anchor
      rerender(<CMultiSelectWithChip {...multiSelectWithAnchorEl} />);

      // Select item
      fireEvent.click(screen.getByTestId("menu-item-0"));
      expect(mockOnMenuItemSelect).toHaveBeenCalled();

      // Close menu
      fireEvent.click(screen.getByTestId("close-menu"));
      expect(mockOnMenuClose).toHaveBeenCalled();
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
      const { rerender } = render(
        <CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />
      );

      for (let i = 0; i < 5; i++) {
        fireEvent.click(screen.getByTestId("chip-input"));
        rerender(<CMultiSelectWithChip {...multiSelectWithAnchorEl} />);
        fireEvent.click(screen.getByTestId("close-menu"));
        rerender(<CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />);
      }

      expect(mockOnMenuOpen).toHaveBeenCalledTimes(5);
      expect(mockOnMenuClose).toHaveBeenCalledTimes(5);
    });

    it("should handle search and selection together", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <CMultiSelectWithChip {...defaultMultiSelectWithChipProps} />
      );

      // Type in search
      const input = screen.getByTestId("chip-input");
      await user.type(input, "search");
      expect(mockOnChange).toHaveBeenCalled();

      // Open menu with search text
      rerender(
        <CMultiSelectWithChip
          {...multiSelectWithSearchText}
          anchorEl={document.createElement("div")}
        />
      );

      // Select item
      fireEvent.click(screen.getByTestId("menu-item-0"));
      expect(mockOnMenuItemSelect).toHaveBeenCalled();
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
      render(<CMultiSelectWithChip {...multiSelectWithAnchorEl} />);

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
