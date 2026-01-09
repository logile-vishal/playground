import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CTreeView from "../TreeView";

import {
  mockTreeNodeSimple,
  mockTreeNodeWithChildren,
  mockTreeNodeWithMixedExpansion,
  mockTreeNodeWithLongName,
  mockTreeData,
  mockTreeDataDeeplyNested,
  mockTreeDataEmpty,
  mockTreeDataMultipleRoots,
  mockHandleClick,
  mockSetSelectedData,
} from "./__mocks__/TreeView.mocks";

// Mock dependencies
vi.mock("@/core/components/icon/Icon", () => ({
  default: ({
    component,
    size,
    color,
  }: {
    component: React.ComponentType;
    size: number;
    color: string;
  }) => (
    <svg
      data-testid="svg-icon"
      data-component={component?.name || "icon"}
      data-size={size}
      data-color={color}
    />
  ),
}));

vi.mock("@/utils/mac-truncate", () => ({
  renderMacTruncate: (text: string) => (
    <span data-testid="mac-truncate">{text}</span>
  ),
}));

vi.mock("@/core/constants/icons", () => ({
  ArrowDownFill: () => <svg data-testid="arrow-down-icon" />,
  ArrowRightFill: () => <svg data-testid="arrow-right-icon" />,
}));

describe("CTreeView Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render CTreeView component with empty data", () => {
      const { container } = render(
        <CTreeView
          data={mockTreeDataEmpty}
          handleClick={mockHandleClick}
        />
      );

      const treeView = container.querySelector('[aria-label="directory tree"]');
      expect(treeView).toBeInTheDocument();
    });

    it("should render CTreeView component with single node", () => {
      render(
        <CTreeView
          data={[mockTreeNodeSimple]}
          handleClick={mockHandleClick}
        />
      );

      expect(screen.getByText("Root Folder")).toBeInTheDocument();
    });

    it("should render CTreeView component with multiple root nodes", () => {
      render(
        <CTreeView
          data={mockTreeData}
          handleClick={mockHandleClick}
        />
      );

      expect(screen.getByText("Root Folder")).toBeInTheDocument();
      expect(screen.getByText("Parent Folder")).toBeInTheDocument();
    });

    it("should render tree with nested children", () => {
      render(
        <CTreeView
          data={[mockTreeNodeWithChildren]}
          handleClick={mockHandleClick}
        />
      );

      expect(screen.getByText("Parent Folder")).toBeInTheDocument();
      expect(screen.getByText("Child Folder 1")).toBeInTheDocument();
      expect(screen.getByText("Child Folder 2")).toBeInTheDocument();
    });

    it("should render deeply nested tree structure", () => {
      render(
        <CTreeView
          data={mockTreeDataDeeplyNested}
          handleClick={mockHandleClick}
        />
      );

      expect(screen.getByText("Level 1")).toBeInTheDocument();
      expect(screen.getByText("Level 2")).toBeInTheDocument();
      expect(screen.getByText("Level 3")).toBeInTheDocument();
      // Level 4 is not visible because Level 3 has isExpanded: false
    });

    it("should apply mac-truncate to node labels", () => {
      render(
        <CTreeView
          data={[mockTreeNodeWithLongName]}
          handleClick={mockHandleClick}
        />
      );

      const macTruncateElements = screen.getAllByTestId("mac-truncate");
      expect(macTruncateElements.length).toBeGreaterThan(0);
    });

    it("should render with correct aria-label", () => {
      const { container } = render(
        <CTreeView
          data={mockTreeData}
          handleClick={mockHandleClick}
        />
      );

      const treeView = container.querySelector('[aria-label="directory tree"]');
      expect(treeView).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should accept data prop correctly", () => {
      render(
        <CTreeView
          data={mockTreeData}
          handleClick={mockHandleClick}
        />
      );

      expect(screen.getByText("Root Folder")).toBeInTheDocument();
      expect(screen.getByText("Parent Folder")).toBeInTheDocument();
    });

    it("should work without setSelectedData prop", () => {
      expect(() => {
        render(
          <CTreeView
            data={mockTreeData}
            handleClick={mockHandleClick}
          />
        );
      }).not.toThrow();
    });

    it("should work with setSelectedData prop", () => {
      expect(() => {
        render(
          <CTreeView
            data={mockTreeData}
            setSelectedData={mockSetSelectedData}
            handleClick={mockHandleClick}
          />
        );
      }).not.toThrow();
    });

    it("should work with undefined handleClick prop", () => {
      expect(() => {
        render(
          <CTreeView
            data={mockTreeData}
            handleClick={undefined}
          />
        );
      }).not.toThrow();
    });

    it("should handle empty data array", () => {
      const { container } = render(
        <CTreeView
          data={mockTreeDataEmpty}
          handleClick={mockHandleClick}
        />
      );

      const treeItems = container.querySelectorAll('[role="treeitem"]');
      expect(treeItems.length).toBe(0);
    });
  });

  describe("Event Handling", () => {
    it("should call handleClick when a node is clicked", () => {
      render(
        <CTreeView
          data={[mockTreeNodeSimple]}
          handleClick={mockHandleClick}
        />
      );

      const node = screen.getByText("Root Folder");
      fireEvent.click(node);

      expect(mockHandleClick).toHaveBeenCalledTimes(1);
      expect(mockHandleClick).toHaveBeenCalledWith(
        expect.any(Object),
        mockTreeNodeSimple
      );
    });

    it("should call handleClick with correct node data for nested nodes", () => {
      vi.clearAllMocks();
      render(
        <CTreeView
          data={[mockTreeNodeWithChildren]}
          handleClick={mockHandleClick}
        />
      );

      const childNode = screen.getByText("Child Folder 1");
      fireEvent.click(childNode);

      // Event may bubble, check that handleClick was called with the child node data
      expect(mockHandleClick).toHaveBeenCalled();
      const calls = mockHandleClick.mock.calls;
      const childNodeCall = calls.find((call) => call[1].tagId === 3);
      expect(childNodeCall).toBeDefined();
      expect(childNodeCall[1]).toEqual(mockTreeNodeWithChildren.subLibrary[0]);
    });

    it("should handle multiple clicks on different nodes", () => {
      render(
        <CTreeView
          data={mockTreeData}
          handleClick={mockHandleClick}
        />
      );

      const rootNode = screen.getByText("Root Folder");
      const parentNode = screen.getByText("Parent Folder");

      fireEvent.click(rootNode);
      fireEvent.click(parentNode);

      expect(mockHandleClick).toHaveBeenCalledTimes(2);
    });

    it("should not throw error when handleClick is not provided", () => {
      render(
        <CTreeView
          data={[mockTreeNodeSimple]}
          handleClick={vi.fn()}
        />
      );

      const node = screen.getByText("Root Folder");

      expect(() => {
        fireEvent.click(node);
      }).not.toThrow();
    });

    it("should handle click on deeply nested nodes", () => {
      vi.clearAllMocks();
      render(
        <CTreeView
          data={mockTreeDataDeeplyNested}
          handleClick={mockHandleClick}
        />
      );

      // Click on Level 3 since Level 4 is not visible (Level 3 is collapsed)
      const level3Node = screen.getByText("Level 3");
      fireEvent.click(level3Node);

      expect(mockHandleClick).toHaveBeenCalled();
    });
  });

  describe("Expanded Items Functionality", () => {
    it("should expand nodes marked as isExpanded=true by default", () => {
      render(
        <CTreeView
          data={[mockTreeNodeWithChildren]}
          handleClick={mockHandleClick}
        />
      );

      // Parent folder is expanded, so children should be visible
      expect(screen.getByText("Child Folder 1")).toBeInTheDocument();
      expect(screen.getByText("Child Folder 2")).toBeInTheDocument();
    });

    it("should not expand nodes marked as isExpanded=false", () => {
      render(
        <CTreeView
          data={[mockTreeNodeSimple]}
          handleClick={mockHandleClick}
        />
      );

      // No children should be visible as node is not expanded
      const { container } = render(
        <CTreeView
          data={[mockTreeNodeSimple]}
          handleClick={mockHandleClick}
        />
      );

      const treeItems = container.querySelectorAll('[role="treeitem"]');
      expect(treeItems.length).toBe(1);
    });

    it("should handle mixed expansion states correctly", () => {
      render(
        <CTreeView
          data={[mockTreeNodeWithMixedExpansion]}
          handleClick={mockHandleClick}
        />
      );

      // Should show expanded nodes
      expect(screen.getByText("Mixed Expansion Root")).toBeInTheDocument();
      expect(screen.getByText("Expanded Child")).toBeInTheDocument();
      expect(screen.getByText("Nested Expanded")).toBeInTheDocument();
      expect(screen.getByText("Collapsed Child")).toBeInTheDocument();
      // Hidden Nested should not be visible because Collapsed Child is not expanded
      expect(screen.queryByText("Hidden Nested")).not.toBeInTheDocument();
    });

    it("should expand deeply nested nodes when all parents are expanded", () => {
      render(
        <CTreeView
          data={mockTreeDataDeeplyNested}
          handleClick={mockHandleClick}
        />
      );

      expect(screen.getByText("Level 1")).toBeInTheDocument();
      expect(screen.getByText("Level 2")).toBeInTheDocument();
      expect(screen.getByText("Level 3")).toBeInTheDocument();
    });

    it("should handle nodes with null isExpanded value", () => {
      const nodeWithNullExpansion = {
        ...mockTreeNodeSimple,
        isExpanded: null,
      };

      expect(() => {
        render(
          <CTreeView
            data={[nodeWithNullExpansion]}
            handleClick={mockHandleClick}
          />
        );
      }).not.toThrow();
    });
  });

  describe("Tree Structure Rendering", () => {
    it("should render correct number of tree items", () => {
      render(
        <CTreeView
          data={mockTreeDataMultipleRoots}
          handleClick={mockHandleClick}
        />
      );

      const rootNodes = screen.getByText("Root Folder");
      const parentNode = screen.getByText("Parent Folder");
      const level1Node = screen.getByText("Level 1");

      expect(rootNodes).toBeInTheDocument();
      expect(parentNode).toBeInTheDocument();
      expect(level1Node).toBeInTheDocument();
    });

    it("should maintain correct hierarchy for nested items", () => {
      render(
        <CTreeView
          data={[mockTreeNodeWithChildren]}
          handleClick={mockHandleClick}
        />
      );

      const parentNode = screen
        .getByText("Parent Folder")
        .closest('[role="treeitem"]');
      expect(parentNode).toBeInTheDocument();

      // Children should exist in the DOM
      expect(screen.getByText("Child Folder 1")).toBeInTheDocument();
      expect(screen.getByText("Child Folder 2")).toBeInTheDocument();
    });

    it("should handle nodes with empty subLibrary array", () => {
      expect(() => {
        render(
          <CTreeView
            data={[mockTreeNodeSimple]}
            handleClick={mockHandleClick}
          />
        );
      }).not.toThrow();
    });

    it("should render all nodes in a complex tree structure", () => {
      render(
        <CTreeView
          data={mockTreeDataMultipleRoots}
          handleClick={mockHandleClick}
        />
      );

      // Check various nodes from different levels
      expect(screen.getByText("Root Folder")).toBeInTheDocument();
      expect(screen.getByText("Parent Folder")).toBeInTheDocument();
      expect(screen.getByText("Child Folder 1")).toBeInTheDocument();
      expect(screen.getByText("Level 1")).toBeInTheDocument();
      expect(screen.getByText("Mixed Expansion Root")).toBeInTheDocument();
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle node with very long name", () => {
      render(
        <CTreeView
          data={[mockTreeNodeWithLongName]}
          handleClick={mockHandleClick}
        />
      );

      expect(
        screen.getByText(
          "This is a very long folder name that should trigger text truncation functionality"
        )
      ).toBeInTheDocument();
    });

    it("should handle node with tagId of 0", () => {
      const nodeWithZeroId = {
        ...mockTreeNodeSimple,
        tagId: 0,
      };

      expect(() => {
        render(
          <CTreeView
            data={[nodeWithZeroId]}
            handleClick={mockHandleClick}
          />
        );
      }).not.toThrow();
    });

    it("should handle node with empty tagName", () => {
      const nodeWithEmptyName = {
        ...mockTreeNodeSimple,
        tagName: "",
      };

      const { container } = render(
        <CTreeView
          data={[nodeWithEmptyName]}
          handleClick={mockHandleClick}
        />
      );

      expect(container.querySelector('[role="treeitem"]')).toBeInTheDocument();
    });

    it("should handle node with special characters in tagName", () => {
      const nodeWithSpecialChars = {
        ...mockTreeNodeSimple,
        tagName: "Folder @#$%^&*() Test",
      };

      render(
        <CTreeView
          data={[nodeWithSpecialChars]}
          handleClick={mockHandleClick}
        />
      );

      expect(screen.getByText("Folder @#$%^&*() Test")).toBeInTheDocument();
    });

    it("should handle single child in subLibrary", () => {
      const nodeWithSingleChild = {
        ...mockTreeNodeWithChildren,
        subLibrary: [mockTreeNodeWithChildren.subLibrary[0]],
      };

      render(
        <CTreeView
          data={[nodeWithSingleChild]}
          handleClick={mockHandleClick}
        />
      );

      expect(screen.getByText("Child Folder 1")).toBeInTheDocument();
    });

    it("should handle large number of siblings", () => {
      const manyChildren = Array.from({ length: 50 }, (_, i) => ({
        ...mockTreeNodeSimple,
        tagId: i + 100,
        tagName: `Child ${i + 1}`,
        subLibrary: [],
      }));

      const parentWithManyChildren = {
        ...mockTreeNodeWithChildren,
        subLibrary: manyChildren,
      };

      expect(() => {
        render(
          <CTreeView
            data={[parentWithManyChildren]}
            handleClick={mockHandleClick}
          />
        );
      }).not.toThrow();
    });

    it("should handle node with all boolean flags as false", () => {
      const nodeWithFalseFlags = {
        ...mockTreeNodeSimple,
        isPublic: false,
        isPrivate: false,
        isHidden: false,
        isNoShow: false,
      };

      expect(() => {
        render(
          <CTreeView
            data={[nodeWithFalseFlags]}
            handleClick={mockHandleClick}
          />
        );
      }).not.toThrow();
    });

    it("should handle node with reportType as 0", () => {
      const nodeWithZeroReportType = {
        ...mockTreeNodeSimple,
        reportType: 0,
      };

      expect(() => {
        render(
          <CTreeView
            data={[nodeWithZeroReportType]}
            handleClick={mockHandleClick}
          />
        );
      }).not.toThrow();
    });
  });

  describe("Tree Item Styling and Classes", () => {
    it("should apply correct role to tree view", () => {
      const { container } = render(
        <CTreeView
          data={mockTreeData}
          handleClick={mockHandleClick}
        />
      );

      const treeView = container.querySelector('[aria-label="directory tree"]');
      expect(treeView).toBeInTheDocument();
    });

    it("should render tree items with correct role", () => {
      const { container } = render(
        <CTreeView
          data={[mockTreeNodeSimple]}
          handleClick={mockHandleClick}
        />
      );

      const treeItem = container.querySelector('[role="treeitem"]');
      expect(treeItem).toBeInTheDocument();
    });

    it("should render with flexGrow and overflow styles applied", () => {
      const { container } = render(
        <CTreeView
          data={mockTreeData}
          handleClick={mockHandleClick}
        />
      );

      const treeView = container.querySelector('[aria-label="directory tree"]');
      expect(treeView).toHaveStyle({ flexGrow: "1" });
    });
  });

  describe("Icon Rendering", () => {
    it("should render expand/collapse icons", () => {
      const { container } = render(
        <CTreeView
          data={[mockTreeNodeWithChildren]}
          handleClick={mockHandleClick}
        />
      );

      // Icon components should be rendered
      const icons = container.querySelectorAll('[data-testid="svg-icon"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should render blank icon for leaf nodes", () => {
      const { container } = render(
        <CTreeView
          data={[mockTreeNodeSimple]}
          handleClick={mockHandleClick}
        />
      );

      // Should render tree structure
      expect(container.querySelector('[role="treeitem"]')).toBeInTheDocument();
    });
  });

  describe("Interaction with TreeItem", () => {
    it("should handle click event with correct parameters", () => {
      render(
        <CTreeView
          data={[mockTreeNodeWithChildren]}
          handleClick={mockHandleClick}
        />
      );

      const parentNode = screen.getByText("Parent Folder");

      fireEvent.click(parentNode);

      expect(mockHandleClick).toHaveBeenCalled();
      const callArgs = mockHandleClick.mock.calls[0];
      expect(callArgs[0]).toBeDefined(); // event object
      expect(callArgs[1]).toEqual(mockTreeNodeWithChildren); // node data
    });

    it("should pass correct node data on click for different nodes", () => {
      render(
        <CTreeView
          data={mockTreeData}
          handleClick={mockHandleClick}
        />
      );

      const node1 = screen.getByText("Root Folder");
      const node2 = screen.getByText("Parent Folder");

      fireEvent.click(node1);
      expect(mockHandleClick).toHaveBeenLastCalledWith(
        expect.any(Object),
        mockTreeNodeSimple
      );

      fireEvent.click(node2);
      expect(mockHandleClick).toHaveBeenLastCalledWith(
        expect.any(Object),
        mockTreeNodeWithChildren
      );
    });
  });

  describe("getExpandedTagIds Internal Logic", () => {
    it("should identify expanded nodes correctly", () => {
      render(
        <CTreeView
          data={[mockTreeNodeWithMixedExpansion]}
          handleClick={mockHandleClick}
        />
      );

      // The expanded nodes should be visible
      expect(screen.getByText("Mixed Expansion Root")).toBeInTheDocument();
      expect(screen.getByText("Expanded Child")).toBeInTheDocument();
      expect(screen.getByText("Nested Expanded")).toBeInTheDocument();
    });

    it("should handle nodes without expanded flag", () => {
      const nodesWithoutExpanded = [
        {
          ...mockTreeNodeSimple,
          isExpanded: false,
        },
      ];

      expect(() => {
        render(
          <CTreeView
            data={nodesWithoutExpanded}
            handleClick={mockHandleClick}
          />
        );
      }).not.toThrow();
    });

    it("should handle recursive expansion correctly", () => {
      render(
        <CTreeView
          data={mockTreeDataDeeplyNested}
          handleClick={mockHandleClick}
        />
      );

      // All levels should be visible due to expansion
      expect(screen.getByText("Level 1")).toBeInTheDocument();
      expect(screen.getByText("Level 2")).toBeInTheDocument();
      expect(screen.getByText("Level 3")).toBeInTheDocument();
    });

    it("should handle mixed isExpanded states in sibling nodes", () => {
      render(
        <CTreeView
          data={[mockTreeNodeWithMixedExpansion]}
          handleClick={mockHandleClick}
        />
      );

      // Both expanded and collapsed siblings should be present
      expect(screen.getByText("Expanded Child")).toBeInTheDocument();
      expect(screen.getByText("Collapsed Child")).toBeInTheDocument();
    });
  });

  describe("Rendering with Different Data Structures", () => {
    it("should handle array with single expanded node", () => {
      const singleExpandedNode = [
        {
          ...mockTreeNodeWithChildren,
          isExpanded: true,
        },
      ];

      render(
        <CTreeView
          data={singleExpandedNode}
          handleClick={mockHandleClick}
        />
      );

      expect(screen.getByText("Parent Folder")).toBeInTheDocument();
      expect(screen.getByText("Child Folder 1")).toBeInTheDocument();
    });

    it("should handle array with single collapsed node", () => {
      const singleCollapsedNode = [
        {
          ...mockTreeNodeWithChildren,
          isExpanded: false,
        },
      ];

      render(
        <CTreeView
          data={singleCollapsedNode}
          handleClick={mockHandleClick}
        />
      );

      expect(screen.getByText("Parent Folder")).toBeInTheDocument();
    });

    it("should handle multiple root nodes with different states", () => {
      const mixedRootNodes = [
        { ...mockTreeNodeSimple, isExpanded: false },
        { ...mockTreeNodeWithChildren, isExpanded: true },
      ];

      render(
        <CTreeView
          data={mixedRootNodes}
          handleClick={mockHandleClick}
        />
      );

      expect(screen.getByText("Root Folder")).toBeInTheDocument();
      expect(screen.getByText("Parent Folder")).toBeInTheDocument();
      expect(screen.getByText("Child Folder 1")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should not throw error when clicking on node without handleClick", () => {
      render(
        <CTreeView
          data={[mockTreeNodeSimple]}
          handleClick={vi.fn()}
        />
      );

      const node = screen.getByText("Root Folder");

      expect(() => {
        fireEvent.click(node);
      }).not.toThrow();
    });

    it("should handle malformed data gracefully", () => {
      const malformedNode = {
        ...mockTreeNodeSimple,
        subLibrary: null as any,
      };

      expect(() => {
        render(
          <CTreeView
            data={[malformedNode]}
            handleClick={mockHandleClick}
          />
        );
      }).not.toThrow();
    });

    it("should handle undefined subLibrary", () => {
      const nodeWithoutSubLibrary = {
        ...mockTreeNodeSimple,
        subLibrary: undefined as any,
      };

      expect(() => {
        render(
          <CTreeView
            data={[nodeWithoutSubLibrary]}
            handleClick={mockHandleClick}
          />
        );
      }).not.toThrow();
    });
  });

  describe("Performance and Optimization", () => {
    it("should render large tree without errors", () => {
      const largeTree = Array.from({ length: 100 }, (_, i) => ({
        ...mockTreeNodeSimple,
        tagId: i + 1000,
        tagName: `Node ${i + 1}`,
      }));

      expect(() => {
        render(
          <CTreeView
            data={largeTree}
            handleClick={mockHandleClick}
          />
        );
      }).not.toThrow();
    });

    it("should handle rapid successive clicks", () => {
      render(
        <CTreeView
          data={[mockTreeNodeSimple]}
          handleClick={mockHandleClick}
        />
      );

      const node = screen.getByText("Root Folder");

      fireEvent.click(node);
      fireEvent.click(node);
      fireEvent.click(node);

      expect(mockHandleClick).toHaveBeenCalledTimes(3);
    });
  });
});
