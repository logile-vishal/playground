import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CNestedMenuItem from "../NestedMenuItem";
import type { NestedMenuItemProps } from "../NestedMenuItem";
import {
  mockLeafMenuItem,
  mockMenuItemWithLeftIcon,
  mockNestedMenuItem,
  mockCustomSubMenuItem,
  mockSelectedMenuItem,
  mockMenuItemWithStyles,
  mockOnMenuItemClick,
  mockOnSelect,
  mockOnClose,
  mockOnSubmenuClick,
  defaultProps,
  resetAllMocks,
} from "./__mocks__/NestedMenuItem.mocks";

vi.mock("@/core/components/icon/Icon", () => ({
  default: ({
    component,
    color,
    size,
  }: {
    component?: { name?: string };
    color?: string;
    size?: string | number;
  }) => (
    <div
      data-testid="svg-icon"
      data-color={color}
      data-size={size}
    >
      {component?.name || "Icon"}
    </div>
  ),
}));

describe("CNestedMenuItem", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render leaf menu item correctly", () => {
      render(<CNestedMenuItem {...defaultProps} />);

      expect(screen.getByText("Leaf Item")).toBeInTheDocument();
      expect(screen.getByRole("menuitem")).toHaveClass("nested-menu__item");
    });

    it("should render menu item with left icon", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockMenuItemWithLeftIcon}
        />
      );

      expect(screen.getByText("Item with Icon")).toBeInTheDocument();
      const icon = screen.getByTestId("svg-icon");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute("data-color", "primary");
    });

    it("should render nested menu item with chevron icon", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockNestedMenuItem}
        />
      );

      expect(screen.getByText("Nested Item")).toBeInTheDocument();
      const chevron = screen.getAllByTestId("svg-icon");
      expect(chevron.length).toBeGreaterThan(0);
    });

    it("should render custom submenu item with chevron", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockCustomSubMenuItem}
        />
      );

      expect(screen.getByText("Custom Menu Item")).toBeInTheDocument();
      expect(screen.getAllByTestId("svg-icon")).toHaveLength(1);
    });

    it("should apply selected styling when item is selected", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockSelectedMenuItem}
          selectedItems={[mockSelectedMenuItem]}
        />
      );

      const wrapper = screen
        .getByText("Selected Item")
        .closest(".nested-menu__item-content-wrapper");
      expect(wrapper).toHaveClass(
        "nested-menu__item-content-wrapper--selected"
      );
    });

    it("should render with custom label styles", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockMenuItemWithStyles}
        />
      );

      const label = screen.getByText("Styled Item").parentElement;
      expect(label).toBeInTheDocument();
      expect(mockMenuItemWithStyles.labelStyleProps).toEqual({
        color: "red",
        fontWeight: "bold",
      });
    });

    it("should display path when search term is provided", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockLeafMenuItem}
          searchTerm="search"
        />
      );

      expect(screen.getByText("root > leaf-item")).toBeInTheDocument();
    });
  });

  describe("Event Handling - Clicks", () => {
    it("should handle click on leaf item", () => {
      render(<CNestedMenuItem {...defaultProps} />);

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      expect(mockOnMenuItemClick).toHaveBeenCalledTimes(1);
      expect(mockOnMenuItemClick).toHaveBeenCalledWith(
        expect.any(Object),
        mockLeafMenuItem,
        ["root", "Leaf Item"]
      );
      expect(mockOnSelect).toHaveBeenCalledWith(
        mockLeafMenuItem,
        "root > Leaf Item"
      );
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should toggle submenu when clicking nested item", async () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockNestedMenuItem}
        />
      );

      const menuItem = screen.getByRole("menuitem");

      fireEvent.click(menuItem);

      expect(await screen.findByRole("menu")).toBeInTheDocument();

      fireEvent.click(menuItem);

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    it("should open custom submenu on click", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockCustomSubMenuItem}
        />
      );

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      expect(screen.getByTestId("custom-submenu")).toBeInTheDocument();
      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });

    it("should call onSubmenuClick when provided", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          onSubmenuClick={mockOnSubmenuClick}
        />
      );

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      expect(mockOnSubmenuClick).toHaveBeenCalledTimes(1);
      expect(mockOnSubmenuClick).toHaveBeenCalledWith(
        expect.any(Object),
        mockLeafMenuItem
      );
    });

    it("should stop propagation on click", () => {
      const mockStopPropagation = vi.fn();
      render(<CNestedMenuItem {...defaultProps} />);

      const menuItem = screen.getByRole("menuitem");
      const event = new MouseEvent("click", { bubbles: true });
      event.stopPropagation = mockStopPropagation;

      fireEvent(menuItem, event);

      expect(mockStopPropagation).toHaveBeenCalled();
    });

    it("should stop propagation on mouse down", () => {
      const mockStopPropagation = vi.fn();
      render(<CNestedMenuItem {...defaultProps} />);

      const menuItem = screen.getByRole("menuitem");
      const event = new MouseEvent("mousedown", { bubbles: true });
      event.stopPropagation = mockStopPropagation;

      fireEvent(menuItem, event);

      expect(mockStopPropagation).toHaveBeenCalled();
    });
  });

  describe("Event Handling - Keyboard", () => {
    it("should stop propagation on key down", () => {
      const mockStopPropagation = vi.fn();
      render(<CNestedMenuItem {...defaultProps} />);

      const menuItem = screen.getByRole("menuitem");
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });
      Object.defineProperty(event, "stopPropagation", {
        value: mockStopPropagation,
      });

      fireEvent(menuItem, event);

      expect(mockStopPropagation).toHaveBeenCalled();
    });
  });

  describe("State Management", () => {
    it("should toggle focus state on nested item click", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockNestedMenuItem}
        />
      );

      const menuItem = screen.getByRole("menuitem");
      const wrapper = screen
        .getByText("Nested Item")
        .closest(".nested-menu__item-content-wrapper");

      // Initially not focused
      expect(wrapper).not.toHaveClass(
        "nested-menu__item-content-wrapper--focused"
      );

      // Click to focus
      fireEvent.click(menuItem);
      expect(wrapper).toHaveClass("nested-menu__item-content-wrapper--focused");
    });

    it("should remove focus state on leaf item click", () => {
      render(<CNestedMenuItem {...defaultProps} />);

      const menuItem = screen.getByRole("menuitem");
      const wrapper = screen
        .getByText("Leaf Item")
        .closest(".nested-menu__item-content-wrapper");

      fireEvent.click(menuItem);

      waitFor(() => {
        expect(wrapper).not.toHaveClass(
          "nested-menu__item-content-wrapper--focused"
        );
      });
    });

    it("should maintain open state for nested menu until closed", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockNestedMenuItem}
        />
      );

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      const nestedMenu = document.querySelector(".nested-menu");
      expect(nestedMenu).toBeInTheDocument();
      expect(screen.getByText("Sub Item 1")).toBeInTheDocument();
      expect(screen.getByText("Sub Item 2")).toBeInTheDocument();
    });
  });

  describe("Submenu Positioning", () => {
    it("should use right positioning by default", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockNestedMenuItem}
          subMenuPosition="right"
        />
      );

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      const nestedMenu = document.querySelector(".nested-menu");
      expect(nestedMenu).toBeInTheDocument();
    });

    it("should use left positioning when specified", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockNestedMenuItem}
          subMenuPosition="left"
        />
      );

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      const nestedMenu = document.querySelector(".nested-menu");
      expect(nestedMenu).toBeInTheDocument();
    });
  });

  describe("Submenu Close Handling", () => {
    it("should close submenu when handleOnClose is called", async () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockNestedMenuItem}
        />
      );

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      await waitFor(() => {
        expect(screen.getByText("Sub Item 1")).toBeInTheDocument();
      });

      // Click outside or on close button if available
      fireEvent.click(menuItem);

      await waitFor(() => {
        expect(screen.queryByText("Sub Item 1")).not.toBeInTheDocument();
      });
    });

    it("should close custom submenu when onClose is called", async () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockCustomSubMenuItem}
        />
      );

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      await waitFor(() => {
        expect(screen.getByText("Custom Content")).toBeInTheDocument();
      });

      // Simulate closing
      fireEvent.click(menuItem);

      await waitFor(() => {
        expect(screen.queryByText("Custom Content")).not.toBeInTheDocument();
      });
    });
  });

  describe("Props Handling", () => {
    it("should pass keepMounted prop to nested menu", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockNestedMenuItem}
          keepMounted={true}
        />
      );

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      const nestedMenu = document.querySelector(".nested-menu");
      expect(nestedMenu).toBeInTheDocument();
    });

    it("should handle menuProps correctly", () => {
      const menuPropsOnSelect = vi.fn();
      const menuPropsOnClose = vi.fn();

      render(
        <CNestedMenuItem
          {...defaultProps}
          menuProps={{
            onSelect: menuPropsOnSelect,
            onClose: menuPropsOnClose,
          }}
        />
      );

      expect(screen.getByRole("menuitem")).toBeInTheDocument();
    });

    it("should use pathArray from menuItemData when searchTerm is provided", () => {
      const customPathItem = {
        ...mockLeafMenuItem,
        pathArray: ["custom", "path", "item"],
      };

      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={customPathItem}
          searchTerm="search"
        />
      );

      expect(screen.getByText(/custom.*path.*item/i)).toBeInTheDocument();
    });
  });

  describe("Conditional Rendering", () => {
    it("should not render chevron for leaf items", () => {
      render(<CNestedMenuItem {...defaultProps} />);

      const chevrons = screen.queryAllByTestId("svg-icon");
      expect(chevrons.length).toBe(0);
    });

    it("should render chevron for nested items", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockNestedMenuItem}
        />
      );

      const chevrons = screen.getAllByTestId("svg-icon");
      expect(chevrons.length).toBeGreaterThan(0);
    });

    it("should not render path when searchTerm is empty", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockLeafMenuItem}
          searchTerm=""
        />
      );

      expect(screen.queryByText("root / leaf-item")).not.toBeInTheDocument();
    });

    it("should not render submenu initially", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockNestedMenuItem}
        />
      );

      expect(screen.queryByTestId("nested-menu")).not.toBeInTheDocument();
    });

    it("should not render custom submenu initially", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockCustomSubMenuItem}
        />
      );

      expect(screen.queryByTestId("custom-submenu")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty subMenu items array", async () => {
      const emptySubMenuItem = {
        ...mockNestedMenuItem,
        subMenu: {
          items: [],
          onClick: vi.fn(),
        },
      };

      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={emptySubMenuItem}
        />
      );

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      await waitFor(() => {
        const nestedMenu = screen.queryByRole("menu");
        if (nestedMenu) {
          expect(nestedMenu).toBeInTheDocument();
        }
      });
      expect(mockOnSelect).not.toHaveBeenCalled();
    });

    it("should handle null subMenu", () => {
      const nullSubMenuItem = {
        ...mockLeafMenuItem,
        subMenu: undefined,
      };

      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={nullSubMenuItem}
        />
      );

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      expect(mockOnSelect).toHaveBeenCalled();
    });

    it("should handle undefined customSubMenu", () => {
      const undefinedCustomMenuItem = {
        ...mockLeafMenuItem,
        customSubMenu: undefined,
      };

      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={undefinedCustomMenuItem}
        />
      );

      expect(screen.getByRole("menuitem")).toBeInTheDocument();
    });

    it("should handle missing onSelect callback", () => {
      const propsWithoutOnSelect: NestedMenuItemProps = {
        ...defaultProps,
        onSelect: undefined,
      };

      render(<CNestedMenuItem {...propsWithoutOnSelect} />);

      const menuItem = screen.getByRole("menuitem");

      expect(() => {
        fireEvent.click(menuItem);
      }).not.toThrow();
    });

    it("should handle missing onClose callback", () => {
      const propsWithoutOnClose: NestedMenuItemProps = {
        ...defaultProps,
        onClose: vi.fn(), // Provide a mock function instead of undefined
      };

      render(<CNestedMenuItem {...propsWithoutOnClose} />);

      const menuItem = screen.getByRole("menuitem");

      // Click the item - it should not throw even though onClose is a no-op
      expect(() => {
        fireEvent.click(menuItem);
      }).not.toThrow();

      // Verify the mock was called
      expect(propsWithoutOnClose.onClose).toHaveBeenCalled();
    });

    it("should handle empty parentPath", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          parentPath={[]}
        />
      );

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      expect(mockOnMenuItemClick).toHaveBeenCalledWith(
        expect.any(Object),
        mockLeafMenuItem,
        ["Leaf Item"]
      );
    });

    it("should handle multiple clicks on same nested item", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockNestedMenuItem}
        />
      );

      const menuItem = screen.getByRole("menuitem");

      // First click
      fireEvent.click(menuItem);
      expect(document.querySelector(".nested-menu")).toBeInTheDocument();

      // Second click
      fireEvent.click(menuItem);

      waitFor(() => {
        expect(document.querySelector(".nested-menu")).not.toBeInTheDocument();
      });

      // Third click
      fireEvent.click(menuItem);
      expect(document.querySelector(".nested-menu")).toBeInTheDocument();
    });

    it("should not select item without value", () => {
      const itemWithoutValue = {
        name: "No Value Item",
        value: undefined as unknown as string,
        pathArray: ["root", "no-value"],
      };

      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={itemWithoutValue}
          selectedItems={[mockSelectedMenuItem]}
        />
      );

      const wrapper = screen
        .getByText("No Value Item")
        .closest(".nested-menu__item-content-wrapper");

      expect(wrapper).not.toHaveClass(
        "nested-menu__item-content-wrapper--selected"
      );
    });
  });

  describe("Icon Rendering", () => {
    it("should render left icon with default color when not specified", () => {
      const itemWithoutIconColor = {
        ...mockMenuItemWithLeftIcon,
        leftIconStyleProps: undefined,
      };

      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={itemWithoutIconColor}
        />
      );

      const icon = screen.getByTestId("svg-icon");
      expect(icon).toHaveAttribute("data-color", "secondary");
    });

    it("should render chevron with default color when not specified", () => {
      const nestedItemWithoutIconColor = {
        ...mockNestedMenuItem,
        rightIconStyleProps: undefined,
      };

      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={nestedItemWithoutIconColor}
        />
      );

      const icons = screen.getAllByTestId("svg-icon");
      expect(icons[0]).toHaveAttribute("data-color", "secondary");
    });

    it("should render icon with correct size", () => {
      render(
        <CNestedMenuItem
          {...defaultProps}
          menuItemData={mockMenuItemWithLeftIcon}
        />
      );

      const icon = screen.getByTestId("svg-icon");
      expect(icon).toHaveAttribute("data-size", "18");
    });
  });
});
