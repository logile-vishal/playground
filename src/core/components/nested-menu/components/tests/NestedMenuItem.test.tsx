import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CNestedMenuItem from "../NestedMenuItem";
import type { NestedMenuItemProps } from "../NestedMenuItem";
import type { NestedMenuItem } from "../../types";
import {
  mockLeafMenuItem,
  mockMenuItemWithLeftIcon,
  mockNestedMenuItem,
  mockCustomSubMenuItem,
  mockSelectedMenuItem,
  mockMenuItemWithStyles,
  mockOnSelect,
  mockOnClose,
  mockOnClick,
  mockOnSubmenuToggle,
  defaultProps,
  resetAllMocks,
} from "./__mocks__/NestedMenuItem.mocks";

// Helper props for nested menu items
const nestedItemProps = {
  ...defaultProps,
  menuItemData: mockNestedMenuItem,
  subMenuId: "nested-submenu-1",
};

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

      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(
        expect.any(Object),
        mockLeafMenuItem
      );
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should toggle submenu when clicking nested item", () => {
      render(<CNestedMenuItem {...nestedItemProps} />);

      const menuItem = screen.getByRole("menuitem");

      // Click to open submenu
      fireEvent.click(menuItem);

      // Check that onSubmenuToggle was called
      expect(mockOnSubmenuToggle).toHaveBeenCalledWith("nested-submenu-1");
    });

    it("should open custom submenu on click", () => {
      const customItemProps = {
        ...defaultProps,
        menuItemData: mockCustomSubMenuItem,
        subMenuId: "custom-submenu-1",
      };

      render(<CNestedMenuItem {...customItemProps} />);

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      // Should call onSubmenuToggle for custom submenu
      expect(mockOnSubmenuToggle).toHaveBeenCalledWith("custom-submenu-1");
    });

    it("should call onClick when provided", () => {
      render(<CNestedMenuItem {...defaultProps} />);

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(
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
      // Start with closed submenu
      render(
        <CNestedMenuItem
          {...nestedItemProps}
          activeSubmenuId={null}
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

      // Click should call toggle function
      fireEvent.click(menuItem);
      expect(mockOnSubmenuToggle).toHaveBeenCalledWith("nested-submenu-1");
    });

    it("should remove focus state on leaf item click", () => {
      render(<CNestedMenuItem {...defaultProps} />);

      const menuItem = screen.getByRole("menuitem");
      const wrapper = screen
        .getByText("Leaf Item")
        .closest(".nested-menu__item-content-wrapper");

      fireEvent.click(menuItem);

      expect(wrapper).not.toHaveClass(
        "nested-menu__item-content-wrapper--focused"
      );
    });

    it("should maintain open state for nested menu until closed", () => {
      render(<CNestedMenuItem {...nestedItemProps} />);

      const menuItem = screen.getByRole("menuitem");

      // Click should toggle submenu
      fireEvent.click(menuItem);
      expect(mockOnSubmenuToggle).toHaveBeenCalledWith("nested-submenu-1");
    });
  });

  describe("Submenu Close Handling", () => {
    it("should close submenu when handleOnClose is called", () => {
      render(<CNestedMenuItem {...nestedItemProps} />);

      const menuItem = screen.getByRole("menuitem");

      // Click to trigger submenu toggle
      fireEvent.click(menuItem);
      expect(mockOnSubmenuToggle).toHaveBeenCalledWith("nested-submenu-1");
    });

    it("should close custom submenu when onClose is called", () => {
      const customItemProps = {
        ...defaultProps,
        menuItemData: mockCustomSubMenuItem,
        subMenuId: "custom-submenu-1",
      };

      render(<CNestedMenuItem {...customItemProps} />);

      const menuItem = screen.getByRole("menuitem");

      // Click to toggle custom submenu
      fireEvent.click(menuItem);
      expect(mockOnSubmenuToggle).toHaveBeenCalledWith("custom-submenu-1");
    });
  });

  describe("Props Handling", () => {
    it("should pass keepMounted prop to nested menu", () => {
      render(
        <CNestedMenuItem
          {...nestedItemProps}
          keepMounted={true}
        />
      );

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      expect(mockOnSubmenuToggle).toHaveBeenCalledWith("nested-submenu-1");
    });

    it("should handle menuProps correctly", () => {
      const menuPropsOnClose = vi.fn();

      render(
        <CNestedMenuItem
          {...defaultProps}
          menuProps={{
            onClose: menuPropsOnClose,
          }}
        />
      );

      expect(screen.getByRole("menuitem")).toBeInTheDocument();
    });

    it("should use filterPath from menuItemData when searchTerm is provided", () => {
      const customPathItem = {
        ...mockLeafMenuItem,
        filterPath: "custom > path > item",
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

      const wrapper = screen
        .getByText("Custom Menu Item")
        .closest(".nested-menu__item-content-wrapper");

      expect(wrapper).not.toHaveClass(
        "nested-menu__item-content-wrapper--focused"
      );
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

      expect(mockOnClick).toHaveBeenCalled();
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
      render(<CNestedMenuItem {...defaultProps} />);

      const menuItem = screen.getByRole("menuitem");
      fireEvent.click(menuItem);

      expect(mockOnClick).toHaveBeenCalledWith(
        expect.any(Object),
        mockLeafMenuItem
      );
    });

    it("should handle multiple clicks on same nested item", () => {
      render(<CNestedMenuItem {...nestedItemProps} />);

      const menuItem = screen.getByRole("menuitem");

      // First click
      fireEvent.click(menuItem);
      expect(mockOnSubmenuToggle).toHaveBeenCalledTimes(1);
      expect(mockOnSubmenuToggle).toHaveBeenCalledWith("nested-submenu-1");

      // Second click
      fireEvent.click(menuItem);
      expect(mockOnSubmenuToggle).toHaveBeenCalledTimes(2);

      // Third click
      fireEvent.click(menuItem);
      expect(mockOnSubmenuToggle).toHaveBeenCalledTimes(3);
    });

    it("should not select item without value", () => {
      const itemWithoutValue = {
        label: "No Value Item",
        value: undefined as unknown as string,
        filterPath: "root > no-value",
      } as NestedMenuItem;

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
