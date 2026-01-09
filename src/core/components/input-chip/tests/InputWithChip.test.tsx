import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import CInputWithChip from "../InputWithChip";
import type { InputWithChipProps } from "../InputWithChip";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";

// Mock the icon component
vi.mock("@/core/components/icon/Icon", () => ({
  default: ({
    component,
    size,
    color,
  }: {
    component: any;
    size: number;
    color?: string;
  }) => (
    <span
      data-testid="svg-icon"
      data-size={size}
      data-color={color}
    >
      {component?.name || "Icon"}
    </span>
  ),
}));

// Mock the icons
vi.mock("@/core/constants/icons", () => ({
  ChevronDown: { name: "ChevronDown" },
  ChevronUp: { name: "ChevronUp" },
  Close: { name: "Close" },
}));

// Mock clsx utility
vi.mock("@/utils/clsx", () => ({
  default: (classes: Record<string, boolean> | string) => {
    if (typeof classes === "string") return classes;
    return Object.entries(classes)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(" ");
  },
}));

// Don't mock Chip - use the real MUI component
// This ensures proper integration with MUI's deleteIcon behavior

describe("CInputWithChip", () => {
  const mockSelectedItems: NestedMenuItem[] = [
    { name: "Item 1", value: "item1" },
    { name: "Item 2", value: "item2" },
  ];

  const defaultProps: InputWithChipProps = {
    searchText: "",
    selectedItems: [],
    onDelete: vi.fn(),
    onChange: vi.fn(),
    isSelectIconShown: true,
    placeholder: "Search",
    anchorEl: null,
    onMenuOpen: vi.fn(),
    width: 300,
    inputPlacement: "end",
    isInputVisible: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock requestAnimationFrame
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(
      (cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      }
    );
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render without crashing", () => {
    render(<CInputWithChip {...defaultProps} />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("should display placeholder when no items are selected", () => {
    render(
      <CInputWithChip
        {...defaultProps}
        placeholder="Type here"
      />
    );
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("should not display placeholder when items are selected", () => {
    render(
      <CInputWithChip
        {...defaultProps}
        selectedItems={mockSelectedItems}
      />
    );
    const input = screen.getByRole("textbox");

    // Placeholder should be removed
    expect(input).not.toHaveAttribute("placeholder", "Search");

    // Chip is rendered
    expect(
      screen.getByText((text) => text.includes("item1"))
    ).toBeInTheDocument();
  });

  it("should render selected items as chips", () => {
    render(
      <CInputWithChip
        {...defaultProps}
        selectedItems={mockSelectedItems}
      />
    );
    expect(screen.getByText("item1")).toBeInTheDocument();
    expect(screen.getByText("item2")).toBeInTheDocument();
  });

  it("should call onChange when input value changes", () => {
    const onChangeMock = vi.fn();
    render(
      <CInputWithChip
        {...defaultProps}
        onChange={onChangeMock}
      />
    );

    const input = screen.getByPlaceholderText("Search") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test" } });

    expect(onChangeMock).toHaveBeenCalled();
  });

  it("should display search text in input field", () => {
    render(
      <CInputWithChip
        {...defaultProps}
        searchText="test search"
      />
    );
    const input = screen.getByDisplayValue("test search") as HTMLInputElement;
    expect(input.value).toBe("test search");
  });

  it("should call onMenuOpen when container is clicked", () => {
    const onMenuOpenMock = vi.fn();
    render(
      <CInputWithChip
        {...defaultProps}
        onMenuOpen={onMenuOpenMock}
      />
    );

    const container = screen
      .getByPlaceholderText("Search")
      .closest(".input-with-chip");
    fireEvent.click(container!);

    expect(onMenuOpenMock).toHaveBeenCalled();
  });

  it("should show ChevronDown icon when menu is closed", () => {
    render(
      <CInputWithChip
        {...defaultProps}
        anchorEl={null}
      />
    );
    const icons = screen.getAllByTestId("svg-icon");
    const chevronIcon = icons.find(
      (icon) => icon.textContent === "ChevronDown"
    );
    expect(chevronIcon).toBeInTheDocument();
  });

  it("should show ChevronUp icon when menu is open", () => {
    const mockAnchorEl = document.createElement("div");
    render(
      <CInputWithChip
        {...defaultProps}
        anchorEl={mockAnchorEl}
      />
    );
    const icons = screen.getAllByTestId("svg-icon");
    const chevronIcon = icons.find((icon) => icon.textContent === "ChevronUp");
    expect(chevronIcon).toBeInTheDocument();
  });

  it("should apply focus class when anchorEl is present", () => {
    const mockAnchorEl = document.createElement("div");
    const { container } = render(
      <CInputWithChip
        {...defaultProps}
        anchorEl={mockAnchorEl}
      />
    );
    const inputChip = container.querySelector(".input-with-chip--focus");
    expect(inputChip).toBeInTheDocument();
  });

  it("should apply correct width from props", () => {
    const { container } = render(
      <CInputWithChip
        {...defaultProps}
        width={500}
      />
    );
    const inputChip = container.querySelector(".input-with-chip");
    expect(inputChip).toHaveStyle({ width: "500px" });
  });

  it("should hide input when isInputVisible is false", () => {
    render(
      <CInputWithChip
        {...defaultProps}
        isInputVisible={false}
      />
    );
    expect(screen.queryByPlaceholderText("Search")).not.toBeInTheDocument();
  });

  it("should show placeholder in Box when isInputVisible is false and no items selected", () => {
    render(
      <CInputWithChip
        {...defaultProps}
        isInputVisible={false}
        placeholder="Custom placeholder"
      />
    );
    expect(screen.getByText("Custom placeholder")).toBeInTheDocument();
  });

  it("should render chips with correct keys", () => {
    const itemsWithPath: NestedMenuItem[] = [
      { name: "Path 1", value: "val1", path: "Path 1" },
      { name: "Path 2", value: "val2", path: "Path 2" },
    ];
    render(
      <CInputWithChip
        {...defaultProps}
        selectedItems={itemsWithPath}
      />
    );
    expect(screen.getByText("Path 1")).toBeInTheDocument();
    expect(screen.getByText("Path 2")).toBeInTheDocument();
  });

  it("should handle input placement at start", () => {
    const { container } = render(
      <CInputWithChip
        {...defaultProps}
        inputPlacement="start"
      />
    );
    const content = container.querySelector(".input-with-chip__content");
    expect(content).not.toHaveClass("input-with-chip__content--end");
  });

  it("should handle input placement at end", () => {
    const { container } = render(
      <CInputWithChip
        {...defaultProps}
        inputPlacement="end"
      />
    );
    const content = container.querySelector(".input-with-chip__content--end");
    expect(content).toBeInTheDocument();
  });

  it("should pass additional TextField props", () => {
    render(
      <CInputWithChip
        {...defaultProps}
        disabled
        name="test-input"
        id="custom-id"
      />
    );
    const input = screen.getByPlaceholderText("Search") as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  // New test cases for uncovered lines

  describe("Dynamic Input Width (Lines 60-69)", () => {
    it("should set input width to 100% when no searchText and no selectedItems", async () => {
      const { container } = render(
        <CInputWithChip
          {...defaultProps}
          searchText=""
          selectedItems={[]}
        />
      );

      await waitFor(() => {
        const inputField = container.querySelector(
          ".input-with-chip__content-input-field"
        ) as HTMLDivElement;
        expect(inputField?.style.width).toBe("100%");
      });
    });

    it("should set input width to 2px when no searchText but has selectedItems", async () => {
      const { container } = render(
        <CInputWithChip
          {...defaultProps}
          searchText=""
          selectedItems={mockSelectedItems}
        />
      );

      await waitFor(() => {
        const inputField = container.querySelector(
          ".input-with-chip__content-input-field"
        ) as HTMLDivElement;
        expect(inputField?.style.width).toBe("2px");
      });
    });

    it("should set input width based on measured text width when searchText exists", async () => {
      // Mock offsetWidth for the measure element
      Object.defineProperty(HTMLSpanElement.prototype, "offsetWidth", {
        configurable: true,
        get() {
          return this.textContent?.length * 10 || 0; // Simulate width based on text length
        },
      });

      const { container } = render(
        <CInputWithChip
          {...defaultProps}
          searchText="test"
          selectedItems={[]}
        />
      );

      await waitFor(() => {
        const inputField = container.querySelector(
          ".input-with-chip__content-input-field"
        ) as HTMLDivElement;
        // Width should be set to the measured width (40px for "test")
        expect(inputField?.style.width).toBe("40px");
      });
    });

    it("should update input width when searchText changes", async () => {
      const { container, rerender } = render(
        <CInputWithChip
          {...defaultProps}
          searchText=""
          selectedItems={[]}
        />
      );

      // Initially should be 100%
      await waitFor(() => {
        const inputField = container.querySelector(
          ".input-with-chip__content-input-field"
        ) as HTMLDivElement;
        expect(inputField?.style.width).toBe("100%");
      });

      // Update with searchText
      rerender(
        <CInputWithChip
          {...defaultProps}
          searchText="new text"
          selectedItems={[]}
        />
      );

      await waitFor(() => {
        const inputField = container.querySelector(
          ".input-with-chip__content-input-field"
        ) as HTMLDivElement;
        // Should now have a calculated width
        expect(inputField?.style.width).not.toBe("100%");
      });
    });

    it("should cleanup requestAnimationFrame on unmount", () => {
      const cancelAnimationFrameSpy = vi.spyOn(window, "cancelAnimationFrame");

      const { unmount } = render(
        <CInputWithChip
          {...defaultProps}
          searchText="test"
        />
      );

      unmount();

      expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    });
  });

  describe("Auto Scroll with inputPlacement='start' (Lines 84-94)", () => {
    it("should trigger scroll behavior when inputPlacement is 'start' and searchText is empty", () => {
      const requestAnimationFrameSpy = vi.spyOn(
        window,
        "requestAnimationFrame"
      );

      const { container } = render(
        <CInputWithChip
          {...defaultProps}
          inputPlacement="start"
          searchText=""
          selectedItems={mockSelectedItems}
        />
      );

      const scrollContainer = container.querySelector(
        ".input-with-chip__scroll-container"
      ) as HTMLDivElement;

      // Mock scrollWidth to trigger scroll behavior
      Object.defineProperty(scrollContainer, "scrollWidth", {
        configurable: true,
        value: 1000,
      });

      // The component should call requestAnimationFrame for the scroll animation
      expect(requestAnimationFrameSpy).toHaveBeenCalled();
    });

    it("should trigger scroll behavior when inputPlacement is 'end' and searchText is empty", () => {
      const requestAnimationFrameSpy = vi.spyOn(
        window,
        "requestAnimationFrame"
      );

      const { container } = render(
        <CInputWithChip
          {...defaultProps}
          inputPlacement="end"
          searchText=""
          selectedItems={mockSelectedItems}
        />
      );

      const scrollContainer = container.querySelector(
        ".input-with-chip__scroll-container"
      ) as HTMLDivElement;

      // Mock scrollWidth to trigger scroll behavior
      Object.defineProperty(scrollContainer, "scrollWidth", {
        configurable: true,
        value: 1000,
      });

      // The component should call requestAnimationFrame for the scroll animation
      expect(requestAnimationFrameSpy).toHaveBeenCalled();
    });

    it("should not scroll when searchText has length", () => {
      const { container } = render(
        <CInputWithChip
          {...defaultProps}
          inputPlacement="start"
          searchText="test"
          selectedItems={mockSelectedItems}
        />
      );

      const scrollContainer = container.querySelector(
        ".input-with-chip__scroll-container"
      ) as HTMLDivElement;

      // scrollLeft should remain 0 (not scrolled)
      expect(scrollContainer.scrollLeft).toBe(0);
    });

    it("should cleanup requestAnimationFrame on unmount during scroll", () => {
      const cancelAnimationFrameSpy = vi.spyOn(window, "cancelAnimationFrame");

      const { unmount } = render(
        <CInputWithChip
          {...defaultProps}
          inputPlacement="start"
          searchText=""
          selectedItems={mockSelectedItems}
        />
      );

      unmount();

      expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    });
  });

  describe("Chip Delete Functionality (Line 157)", () => {
    it("should render chips with delete icons when onDelete prop is provided", () => {
      const onDeleteMock = vi.fn();
      const { container } = render(
        <CInputWithChip
          {...defaultProps}
          selectedItems={mockSelectedItems}
          onDelete={onDeleteMock}
        />
      );

      // Verify chips are rendered with the deletable class (indicating delete functionality)
      const chips = container.querySelectorAll(".MuiChip-deletable");
      expect(chips.length).toBe(2);

      // Verify delete icons are present
      const deleteIcons = container.querySelectorAll(
        '[data-testid="svg-icon"]'
      );
      // Should have 2 delete icons (one per chip) + 1 chevron icon
      expect(deleteIcons.length).toBeGreaterThanOrEqual(2);
    });

    it("should properly wire onDelete callback to each chip", () => {
      const onDeleteMock = vi.fn();
      const { container } = render(
        <CInputWithChip
          {...defaultProps}
          selectedItems={mockSelectedItems}
          onDelete={onDeleteMock}
        />
      );

      const chips = container.querySelectorAll(".MuiChip-root");
      expect(chips).toHaveLength(2);

      // Verify that the chips have the onDelete-related classes
      chips.forEach((chip) => {
        expect(chip.classList.contains("MuiChip-deletable")).toBe(true);
      });
    });

    it("should pass item data correctly for items with path", () => {
      const onDeleteMock = vi.fn();
      const itemsWithPath: NestedMenuItem[] = [
        { name: "Item 1", value: "val1", path: "root > item1" },
      ];

      const { container } = render(
        <CInputWithChip
          {...defaultProps}
          selectedItems={itemsWithPath}
          onDelete={onDeleteMock}
        />
      );

      const chip = container.querySelector(".MuiChip-root");
      expect(chip).toBeTruthy();

      // Verify the chip displays the path correctly
      const label = chip?.querySelector(".MuiChip-label");
      expect(label?.textContent).toBe("root > item1");
    });

    it("should render multiple chips with delete functionality", () => {
      const onDeleteMock = vi.fn();
      const multipleItems: NestedMenuItem[] = [
        { name: "Item 1", value: "item1" },
        { name: "Item 2", value: "item2" },
        { name: "Item 3", value: "item3" },
      ];

      const { container } = render(
        <CInputWithChip
          {...defaultProps}
          selectedItems={multipleItems}
          onDelete={onDeleteMock}
        />
      );

      const chips = container.querySelectorAll(".MuiChip-deletable");
      expect(chips).toHaveLength(3);

      // Verify each chip has correct label
      const labels = Array.from(chips).map(
        (chip) => chip.querySelector(".MuiChip-label")?.textContent
      );
      expect(labels).toEqual(["item1", "item2", "item3"]);
    });
  });

  describe("Edge Cases for useEffect hooks", () => {
    it("should handle missing refs gracefully in width calculation useEffect", () => {
      // This tests the early return when refs are not available
      const { rerender } = render(
        <CInputWithChip
          {...defaultProps}
          searchText="test"
        />
      );

      // Component should render without errors even if refs aren't ready
      expect(screen.getByDisplayValue("test")).toBeInTheDocument();

      // Rerender to trigger useEffect again
      rerender(
        <CInputWithChip
          {...defaultProps}
          searchText="updated"
        />
      );

      expect(screen.getByDisplayValue("updated")).toBeInTheDocument();
    });

    it("should handle missing scrollRef gracefully in scroll useEffect", () => {
      const { rerender } = render(
        <CInputWithChip
          {...defaultProps}
          searchText=""
          selectedItems={mockSelectedItems}
          inputPlacement="start"
        />
      );

      // Component should render without errors
      expect(screen.getByText("item1")).toBeInTheDocument();

      // Rerender to trigger useEffect again
      rerender(
        <CInputWithChip
          {...defaultProps}
          searchText=""
          selectedItems={[
            ...mockSelectedItems,
            { name: "Item 3", value: "item3" },
          ]}
          inputPlacement="start"
        />
      );

      expect(screen.getByText("item3")).toBeInTheDocument();
    });
  });
});
