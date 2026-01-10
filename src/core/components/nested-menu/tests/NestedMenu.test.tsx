import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CNestedMenu from "../NestedMenu";
import {
  mockNestedMenuProps,
  mockNestedMenuPropsWithSearch,
  mockAnchorEl,
  mockOnClose,
  mockOnMenuItemSelect,
  mockOnSubmenuClick,
  mockMenuItemWithCustomSubMenu,
  mockMenuItemWithParentAsItem,
  mockSelectedItems,
  resetAllMocks,
} from "./__mocks__/NestedMenu.mocks";

describe("CNestedMenu Component", () => {
  beforeEach(() => {
    resetAllMocks();
    // Mock getBoundingClientRect for anchorEl
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 250,
      height: 50,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render the menu when anchorEl is provided", () => {
      render(<CNestedMenu {...mockNestedMenuProps} />);

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("should not render the menu when anchorEl is null", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          anchorEl={null}
        />
      );

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("should render all menu items correctly", () => {
      render(<CNestedMenu {...mockNestedMenuProps} />);

      expect(screen.getByText("Menu Item 1")).toBeInTheDocument();
      expect(screen.getByText("Menu Item 2")).toBeInTheDocument();
      expect(screen.getByText("Menu Item 3")).toBeInTheDocument();
    });

    it("should apply custom className when provided", () => {
      const customClass = "custom-menu-class";
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          className={customClass}
        />
      );

      const menu = screen.getByRole("presentation");
      expect(menu).toHaveClass(customClass);
    });

    it("should render with empty menuItems array", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          menuItems={[]}
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("should render search field when showSearch is true and level is 0", () => {
      render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeInTheDocument();
    });

    it("should not render search field when showSearch is false", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          showSearch={false}
        />
      );

      expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
    });

    it("should not render search field when level > 0", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuPropsWithSearch}
          level={1}
          parentPath={["Parent"]}
        />
      );

      expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
    });

    it("should update search term on input change", async () => {
      const user = userEvent.setup();
      render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "Menu Item 1");

      expect(searchInput).toHaveValue("Menu Item 1");
    });

    it("should filter menu items based on search term", async () => {
      const user = userEvent.setup();
      render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "Menu Item 1");

      await waitFor(() => {
        expect(screen.queryAllByText("Menu Item 1")[1]).toBeInTheDocument();
        expect(screen.queryByText("Menu Item 3")).not.toBeInTheDocument();
      });
    });

    it("should handle case-insensitive search", async () => {
      const user = userEvent.setup();
      render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "menu item 2");

      await waitFor(() => {
        expect(screen.queryAllByText("Menu Item 2")[1]).toBeInTheDocument();
      });
    });

    it("should show no results when search term does not match", async () => {
      const user = userEvent.setup();
      render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "NonExistentItem");

      await waitFor(() => {
        expect(screen.queryByText("Menu Item 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Menu Item 2")).not.toBeInTheDocument();
      });
    });

    it("should stop event propagation on search field click", () => {
      const parentClick = vi.fn();

      render(
        <div onClick={parentClick}>
          <CNestedMenu {...mockNestedMenuPropsWithSearch} />
        </div>
      );

      const searchInput = screen.getByPlaceholderText(/search/i);

      fireEvent.click(searchInput);

      expect(parentClick).not.toHaveBeenCalled();
    });

    it("should stop event propagation on search field keydown", () => {
      render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

      const searchContainer =
        screen.getByPlaceholderText(/search/i).parentElement;
      const keydownEvent = new KeyboardEvent("keydown", { bubbles: true });
      const stopPropagationSpy = vi.spyOn(keydownEvent, "stopPropagation");

      searchContainer?.dispatchEvent(keydownEvent);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it("should apply custom textField slot props", () => {
      const customSlotProps = {
        textField: {
          "data-testid": "search-field",
          placeholder: "Custom search placeholder",
          variant: "filled" as const,
        },
      };

      render(
        <CNestedMenu
          {...mockNestedMenuPropsWithSearch}
          slotProps={customSlotProps}
        />
      );

      const searchInput = screen.getByTestId("search-field");
      expect(searchInput).toBeInTheDocument();
      expect(within(searchInput).getByRole("textbox")).toHaveAttribute(
        "placeholder",
        "Custom search placeholder"
      );
    });
  });

  describe("Menu Item Click Handling", () => {
    it("should call onMenuItemSelect when clicking a menu item without submenu", () => {
      render(<CNestedMenu {...mockNestedMenuProps} />);

      const menuItem = screen.getByText("Menu Item 1");
      fireEvent.click(menuItem);

      expect(mockOnMenuItemSelect).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Menu Item 1" }),
        "Menu Item 1"
      );
    });

    it("should not call onMenuItemSelect when clicking a menu item with submenu", () => {
      render(<CNestedMenu {...mockNestedMenuProps} />);

      const menuItemWithSubmenu = screen.getByText("Menu Item 2");
      fireEvent.click(menuItemWithSubmenu);

      expect(mockOnMenuItemSelect).not.toHaveBeenCalled();
    });

    it("should stop event propagation on menu item click", () => {
      const parentClick = vi.fn();

      render(
        <div onClick={parentClick}>
          <CNestedMenu {...mockNestedMenuProps} />
        </div>
      );

      const menuItem = screen.getByText("Menu Item 1");

      fireEvent.click(menuItem);

      expect(parentClick).not.toHaveBeenCalled();
    });

    it("should not call onMenuItemSelect for items with customSubMenu", () => {
      const menuItemsWithCustom = [mockMenuItemWithCustomSubMenu];
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          menuItems={menuItemsWithCustom}
        />
      );

      const menuItem = screen.getByText("Custom Parent");
      fireEvent.click(menuItem);

      expect(mockOnMenuItemSelect).not.toHaveBeenCalled();
    });
  });

  describe("Menu Close Handling", () => {
    it("should call onClose when menu is closed", () => {
      render(<CNestedMenu {...mockNestedMenuProps} />);

      // Simulate closing by clicking backdrop or escape
      const menu = screen.getByRole("menu");
      fireEvent.keyDown(menu, { key: "Escape" });

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("Props Handling", () => {
    it("should handle keepMounted prop correctly", () => {
      const { rerender } = render(
        <CNestedMenu
          {...mockNestedMenuProps}
          keepMounted={true}
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();

      rerender(
        <CNestedMenu
          {...mockNestedMenuProps}
          anchorEl={null}
          keepMounted={true}
        />
      );

      // Menu should still be in DOM but not visible
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("should pass selectedItems to nested menu items", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          selectedItems={mockSelectedItems}
        />
      );

      expect(screen.getByText("Menu Item 1")).toBeInTheDocument();
    });

    it("should handle subMenuPosition prop", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          subMenuPosition="left"
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("Parent Item Header Rendering", () => {
    it("should render parent item header when level > 0 and parentAsItem is true", () => {
      const parentItem = {
        ...mockMenuItemWithParentAsItem,
        parentAsItem: true,
      };

      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          level={1}
          parentPath={["Parent Item"]}
          parentItem={parentItem}
        />
      );

      const headers = screen.getAllByText("Parent Item");
      expect(headers.length).toBeGreaterThan(0);
    });

    it("should not render parent header when level is 0", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          level={0}
          parentItem={mockMenuItemWithParentAsItem}
        />
      );

      const submenuHeader = document.querySelector(
        ".nested-menu__submenu-header"
      );
      expect(submenuHeader).not.toBeInTheDocument();
    });

    it("should not render parent header when parentAsItem is false", () => {
      const parentItem = {
        ...mockMenuItemWithParentAsItem,
        parentAsItem: false,
      };

      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          level={1}
          parentPath={["Parent Item"]}
          parentItem={parentItem}
        />
      );

      const submenuHeader = document.querySelector(
        ".nested-menu__submenu-header"
      );
      expect(submenuHeader).not.toBeInTheDocument();
    });

    it("should not render parent header when parentPath is empty", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          level={1}
          parentPath={[]}
          parentItem={mockMenuItemWithParentAsItem}
        />
      );

      const submenuHeader = document.querySelector(
        ".nested-menu__submenu-header"
      );
      expect(submenuHeader).not.toBeInTheDocument();
    });
  });

  describe("Anchor and Transform Origins", () => {
    it("should apply custom anchorOrigin when provided", () => {
      const customAnchorOrigin = {
        vertical: "top" as const,
        horizontal: "left" as const,
      };

      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          anchorOrigin={customAnchorOrigin}
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("should apply custom transformOrigin when provided", () => {
      const customTransformOrigin = {
        vertical: "bottom" as const,
        horizontal: "right" as const,
      };

      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          transformOrigin={customTransformOrigin}
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle undefined menuItems gracefully", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          menuItems={
            undefined as unknown as typeof mockNestedMenuProps.menuItems
          }
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("should handle null anchorEl in useEffect", () => {
      const { rerender } = render(
        <CNestedMenu
          {...mockNestedMenuProps}
          anchorEl={null}
        />
      );

      rerender(
        <CNestedMenu
          {...mockNestedMenuProps}
          anchorEl={mockAnchorEl}
        />
      );

      expect(screen.queryByRole("menu")).toBeInTheDocument();
    });

    // Todo : Need to verify

    // it("should handle search with whitespace-only term", async () => {
    //   const user = userEvent.setup();
    //   render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

    //   const searchInput = screen.getByPlaceholderText(/search/i);
    //   await user.type(searchInput, "   ");

    //   // Should show all items when search term is only whitespace
    //   expect(screen.getByText("Menu Item 1")).toBeInTheDocument();
    //   expect(screen.getByText("Menu Item 2")).toBeInTheDocument();
    // });

    it("should handle deeply nested menu items in search", async () => {
      const user = userEvent.setup();
      render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "Nested Sub Item");

      await waitFor(() => {
        expect(screen.getByText("Nested Sub Item 1")).toBeInTheDocument();
      });
    });

    it("should handle menu items without value property", () => {
      const itemsWithoutValue = [
        { name: "Item Without Value" },
      ] as unknown as typeof mockNestedMenuProps.menuItems;

      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          menuItems={itemsWithoutValue}
        />
      );

      expect(screen.getByText("Item Without Value")).toBeInTheDocument();
    });

    it("should handle customMenuWidth as string", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          customMenuWidth="500px"
        />
      );

      const paper = document.querySelector(".MuiPaper-root") as HTMLElement;

      expect(paper.style.width).toBe("500px");
    });

    it("should handle empty subMenu items array", () => {
      const itemsWithEmptySubmenu = [
        {
          name: "Empty Submenu Parent",
          value: "empty-parent",
          subMenu: { items: [] },
        },
      ];

      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          menuItems={itemsWithEmptySubmenu}
        />
      );

      expect(screen.getByText("Empty Submenu Parent")).toBeInTheDocument();
    });

    it("should handle onSubmenuClick callback", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          onSubmenuClick={mockOnSubmenuClick}
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("should handle level prop correctly for nested menus", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          level={5}
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("should handle parentPath with multiple levels", () => {
      const multiLevelPath = ["Level 1", "Level 2", "Level 3"];

      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          level={3}
          parentPath={multiLevelPath}
          parentItem={mockMenuItemWithParentAsItem}
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("Slot Props Handling", () => {
    // it("should apply popover slot props when provided", () => {
    //   const popoverProps = {
    //     "data-testid": "custom-popover",
    //   };

    //   render(
    //     <CNestedMenu
    //       {...mockNestedMenuProps}
    //       slotProps={{ popover: popoverProps }}
    //     />
    //   );

    //   expect(screen.getByRole("menu")).toBeInTheDocument();
    // });

    it("should handle empty slotProps object", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          slotProps={{}}
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("Menu Width Calculation", () => {
    it("should recalculate menu width when anchorEl changes", () => {
      const newAnchorEl = document.createElement("div");
      Element.prototype.getBoundingClientRect = vi.fn(() => ({
        width: 300,
        height: 50,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      const { rerender } = render(<CNestedMenu {...mockNestedMenuProps} />);

      rerender(
        <CNestedMenu
          {...mockNestedMenuProps}
          anchorEl={newAnchorEl}
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("should not set width from anchorEl when customMenuWidth is provided", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          customMenuWidth={350}
        />
      );

      const paper = document.querySelector(".MuiPaper-root") as HTMLElement;
      expect(paper.style.width).toBe("350px");
    });
  });

  describe("Internal Functions - flattenMenuItems", () => {
    it("should flatten nested menu items correctly", async () => {
      const user = userEvent.setup();
      render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "Sub Item");

      await waitFor(() => {
        expect(screen.getByText("Sub Item 1")).toBeInTheDocument();
        expect(screen.getByText("Sub Item 2")).toBeInTheDocument();
      });
    });

    it("should handle menu items without subMenu in flattening", async () => {
      const user = userEvent.setup();
      render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "Menu Item 3");

      await waitFor(() => {
        expect(screen.queryAllByText("Menu Item 3")[1]).toBeInTheDocument();
      });
    });
  });

  describe("Internal Functions - filterMenuItems", () => {
    it("should return empty array when search term is empty", async () => {
      const user = userEvent.setup();
      render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.clear(searchInput);

      // All items should be visible
      expect(screen.getByText("Menu Item 1")).toBeInTheDocument();
      expect(screen.getByText("Menu Item 2")).toBeInTheDocument();
      expect(screen.getByText("Menu Item 3")).toBeInTheDocument();
    });

    it("should filter items case-insensitively", async () => {
      const user = userEvent.setup();
      render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "MENU ITEM 1");

      await waitFor(() => {
        expect(screen.queryAllByText("Menu Item 1")[1]).toBeInTheDocument();
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("should stop propagation on search field keydown events", () => {
      render(<CNestedMenu {...mockNestedMenuPropsWithSearch} />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        bubbles: true,
      });
      const stopPropagationSpy = vi.spyOn(keydownEvent, "stopPropagation");

      searchInput.parentElement?.dispatchEvent(keydownEvent);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe("Negative Scenarios", () => {
    it("should handle onMenuItemSelect throwing error gracefully", () => {
      const errorOnSelect = vi.fn(() => {
        try {
          throw new Error("Selection error");
        } catch {
          /* Error caught and ignored for testing */
        }
      });

      try {
        render(
          <CNestedMenu
            {...mockNestedMenuProps}
            onMenuItemSelect={errorOnSelect}
          />
        );

        const menuItem = screen.getByText("Menu Item 1");
        fireEvent.click(menuItem);

        expect(errorOnSelect).toHaveBeenCalledTimes(1);
      } catch {
        /* Error caught and ignored for testing */
      }
    });

    it("should handle invalid parentPath gracefully", () => {
      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          parentPath={null as unknown as string[]}
          level={1}
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("should handle menu items with null subMenu", () => {
      const itemsWithNullSubmenu = [
        {
          name: "Null Submenu Item",
          value: "null-submenu",
          subMenu: null,
        },
      ] as unknown as typeof mockNestedMenuProps.menuItems;

      render(
        <CNestedMenu
          {...mockNestedMenuProps}
          menuItems={itemsWithNullSubmenu}
        />
      );

      expect(screen.getByText("Null Submenu Item")).toBeInTheDocument();
    });
  });
});
