import React, { useState, useEffect } from "react";
import { SimpleTreeView, TreeItem, treeItemClasses } from "@mui/x-tree-view";
import { styled } from "@mui/material/styles";
import CSvgIcon from "@/core/components/icon/Icon";
import Box from "@mui/material/Box";
import "./TreeView.scss";
import type { DirectoryType } from "@/core/types/tree-view.type";
import { renderMacTruncate } from "@/utils/mac-truncate";
import { ArrowDownFill, ArrowRightFill } from "@/core/constants/icons";

export type TreeViewProps = {
  data: DirectoryType[];
  setSelectedData?: React.Dispatch<React.SetStateAction<number | null>>;
  handleClick?: (
    event: React.MouseEvent<HTMLLIElement>,
    directory: DirectoryType
  ) => void;
  // New props for controlling expansion
  expandedItems?: number[];
  onExpandedItemsChange?: (expandedItems: number[]) => void;
  expandAll?: boolean;
  collapseAll?: boolean;
  selectedItems?: number[];
};

const StyledTreeItem = styled(TreeItem)(() => ({
  [`& .${treeItemClasses.label}`]: {
    fontSize: "var(--logile-size-body)",
    fontWeight: "var(--logile-weight-400)",
    color: "var(--logile-text-primary)",
    borderRadius: "0px",
  },
  [`& .${treeItemClasses.content}`]: {
    padding: "var(--space-s) var(--space-xl) var(--space-s) var(--space-s)",
    gap: "0px",
    backgroundColor: "transparent",
  },
  [`& .${treeItemClasses.content}:hover`]: {
    backgroundColor: "transparent !important",
  },
  [`& .${treeItemClasses.content}.${treeItemClasses.selected}`]: {
    backgroundColor: "transparent !important",
  },
  [`& .${treeItemClasses.content}.${treeItemClasses.focused}`]: {
    backgroundColor: "transparent !important",
  },
  [`& .${treeItemClasses.content}.${treeItemClasses.selected} .${treeItemClasses.label}`]:
    {
      color: "var(--logile-text-brand-primary)",
      fontWeight: "var(--logile-weight-500)",
    },
  [`& .MuiTreeItem-iconContainer`]: {
    width: "auto",
  },
  [`& .MuiTreeItem-root`]: {
    marginLeft: "12px",
  },
}));

const ArrowRightIcon = () => (
  <CSvgIcon
    component={ArrowRightFill}
    size={24}
    color="primary"
  />
);

const ArrowDownIcon = () => (
  <CSvgIcon
    component={ArrowDownFill}
    size={24}
    color="primary"
  />
);

const BlankIcon = () => (
  <Box
    height="24px"
    width="24px"
  ></Box>
);

/**
 * @method getExpandedLibraryIds
 * @description Recursively extracts library IDs from nodes with expanded state
 *
 * This utility function traverses the tree structure to collect all library IDs
 * from nodes that are currently expanded. It recursively processes child nodes
 * (subLibrary) to capture expanded states at all levels of the tree hierarchy.
 *
 * @param {DirectoryType[]} nodes - Array of tree nodes to process
 * @returns {number[]} Array of library IDs from all expanded nodes
 */
function getExpandedLibraryIds(nodes: DirectoryType[]): number[] {
  let result: number[] = [];

  for (const node of nodes) {
    if (node.isExpanded === true) {
      result.push(node.libraryId);
    }
    if (node.subLibrary && node.subLibrary.length > 0) {
      result = result.concat(getExpandedLibraryIds(node.subLibrary));
    }
  }

  return result;
}

/**
 * @method getAllNodeIds
 * @description Recursively collects all library IDs from the tree structure
 *
 * This utility function traverses all nodes in the tree (both parent and child)
 * to create a comprehensive list of all library IDs. It's used for operations
 * that need to process the entire tree structure regardless of expansion state.
 *
 * @param {DirectoryType[]} nodes - Array of tree nodes to process
 * @returns {number[]} Array containing all library IDs in the tree
 */
function getAllNodeIds(nodes: DirectoryType[]): number[] {
  let result: number[] = [];

  for (const node of nodes) {
    result.push(node.libraryId);
    if (node.subLibrary && node.subLibrary.length > 0) {
      result = result.concat(getAllNodeIds(node.subLibrary));
    }
  }

  return result;
}

const CTreeView: React.FC<TreeViewProps> = ({
  data,
  handleClick,
  expandedItems: externalExpandedItems,
  onExpandedItemsChange,
  expandAll,
  collapseAll,
  selectedItems = [],
}) => {
  // Internal state for expanded items
  const [internalExpandedItems, setInternalExpandedItems] = useState<number[]>(
    []
  );

  // Use external expandedItems if provided, otherwise use internal state
  const expandedItems = externalExpandedItems ?? internalExpandedItems;

  // Initialize expanded items from data on mount
  useEffect(() => {
    if (!externalExpandedItems) {
      setInternalExpandedItems(getExpandedLibraryIds(data));
    }
  }, [data, externalExpandedItems]);

  // Handle expand all
  useEffect(() => {
    if (expandAll) {
      const allNodeIds = getAllNodeIds(data);
      const newExpandedItems = [...allNodeIds];

      if (externalExpandedItems) {
        onExpandedItemsChange?.(newExpandedItems.map((id) => Number(id)));
      } else {
        setInternalExpandedItems(newExpandedItems.map((id) => Number(id)));
      }
    }
  }, [expandAll, data, externalExpandedItems, onExpandedItemsChange]);

  // Handle collapse all
  useEffect(() => {
    if (collapseAll) {
      if (externalExpandedItems) {
        onExpandedItemsChange?.([]);
      } else {
        setInternalExpandedItems([]);
      }
    }
  }, [collapseAll, externalExpandedItems, onExpandedItemsChange]);

  // Handle expansion changes
  /**
   * @method handleExpandedItemsChange
   * @description Manages the expansion state changes for tree items
   * @param {React.SyntheticEvent} _event - The expansion event (unused)
   * @param {string[]} itemIds - Array of expanded item IDs as strings
   */
  const handleExpandedItemsChange = (
    _event: React.SyntheticEvent,
    itemIds: string[]
  ) => {
    if (externalExpandedItems) {
      onExpandedItemsChange?.(itemIds.map((id) => Number(id)));
    } else {
      setInternalExpandedItems(itemIds.map((id) => Number(id)));
    }
  };

  const renderTree = (nodes: DirectoryType) => (
    <StyledTreeItem
      key={nodes.libraryId}
      itemId={String(nodes.libraryId)}
      label={renderMacTruncate(nodes.libraryName)}
      onClick={(e) => handleClick?.(e, nodes)}
    >
      {Array.isArray(nodes.subLibrary)
        ? nodes.subLibrary.map((child) => renderTree(child))
        : null}
    </StyledTreeItem>
  );

  return (
    <SimpleTreeView
      aria-label="directory tree"
      slots={{
        expandIcon: ArrowRightIcon,
        collapseIcon: ArrowDownIcon,
        endIcon: BlankIcon,
      }}
      sx={{ flexGrow: 1, overflowY: "auto", height: "100%" }}
      expandedItems={expandedItems.map((i) => String(i))}
      selectedItems={selectedItems.map((i) => String(i))}
      onExpandedItemsChange={handleExpandedItemsChange}
    >
      {data.map((tree) => renderTree(tree))}
    </SimpleTreeView>
  );
};

export default CTreeView;
