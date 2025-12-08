import React from "react";
import { SimpleTreeView, TreeItem, treeItemClasses } from "@mui/x-tree-view";
import { styled } from "@mui/material/styles";
import CSvgIcon from "@/core/components/icon/Icon";
import Box from "@mui/material/Box";
import "./TreeView.scss";
import type { TreeViewNodeDataType } from "@/core/types/tree-view.type";
import { renderMacTruncate } from "@/utils/mac-truncate";
import { ArrowDownFill, ArrowRightFill } from "@/core/constants/icons";

type TreeViewProps = {
  data: TreeViewNodeDataType[];
  setSelectedData?: React.Dispatch<React.SetStateAction<number | null>>;
  handleClick?: (
    event: React.MouseEvent<HTMLLIElement>,
    directory: TreeViewNodeDataType
  ) => void;
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
      color: "#0A68DB",
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

function getExpandedTagIds(nodes: TreeViewNodeDataType[]): string[] {
  let result: string[] = [];

  for (const node of nodes) {
    if (node.isExpanded === true) {
      result.push(String(node.tagId));
    }
    if (node.subLibrary && node.subLibrary.length > 0) {
      result = result.concat(getExpandedTagIds(node.subLibrary));
    }
  }

  return result;
}

const CTreeView: React.FC<TreeViewProps> = ({ data, handleClick }) => {
  const renderTree = (nodes: TreeViewNodeDataType) => (
    <StyledTreeItem
      key={nodes.tagId}
      itemId={String(nodes.tagId)}
      label={renderMacTruncate(nodes.tagName)}
      onClick={(e) => handleClick(e, nodes)}
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
      defaultExpandedItems={getExpandedTagIds(data) || []}
    >
      {data.map((tree) => renderTree(tree))}
    </SimpleTreeView>
  );
};

export default CTreeView;
