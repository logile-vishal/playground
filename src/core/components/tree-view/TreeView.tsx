import React from "react";
import { SimpleTreeView, TreeItem, treeItemClasses } from "@mui/x-tree-view";
import { styled } from "@mui/material/styles";
import SvgIcon from "@/core/components/icon/Icon";
import Box from "@mui/material/Box";
import "./TreeView.scss";

type TreeNode = {
  tagId: number;
  tagName: string;
  children?: TreeNode[];
};

interface TreeViewProps {
  data: TreeNode[];
  setSelectedData: React.Dispatch<React.SetStateAction<number | null>>;
  handleClick: (id: string) => void;
}

const StyledTreeItem = styled(TreeItem)(() => ({
  [`& .${treeItemClasses.label}`]: {
    fontSize: "var(--size-body)",
    fontWeight: "var(--weight-400)",
    color: "var(--text-primary)",
    borderRadius: "0px",
  },
  [`& .${treeItemClasses.content}`]: {
    padding: "6px",
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
  [`& .${treeItemClasses.content}.${treeItemClasses.selected} .${treeItemClasses.label}`]: {
    color: "#0A68DB",
    fontWeight: "var(--weight-500)",
  },
  [`& .MuiTreeItem-iconContainer`]: {
    width: "auto",
  },
}));

const ArrowRightIcon = () => (
  <SvgIcon component="arrowRightFill" size={24} fill="var(--icon-primary)" />
);

const ArrowDownIcon = () => (
  <SvgIcon component="arrowDownFill" size={24} fill="var(--icon-primary)" />
);

const BlankIcon = () => (<Box height="24px" width="24px"></Box>)

function getExpandedTagIds(nodes: any) {
  let result: any = [];

  for (const node of nodes) {
    if (node.isExpanded === true) {
      result.push(node.tagId);
    }
    if (node.children && node.children.length > 0) {
      result = result.concat(getExpandedTagIds(node.children));
    }
  }

  return result;
}

const TreeView: React.FC<TreeViewProps> = ({ data, handleClick }) => {

  const renderTree = (nodes: TreeNode) => (
    <StyledTreeItem key={nodes.tagId} itemId={nodes.tagId} label={nodes.tagName} 
      onClick={(e)=>handleClick(e, nodes)}
     >
      {Array.isArray(nodes.children)
        ? nodes.children.map((child) => renderTree(child))
        : null}
    </StyledTreeItem>
  );

  return (
   
    <SimpleTreeView
      aria-label="directory tree"
      slots={{ expandIcon: ArrowRightIcon, collapseIcon: ArrowDownIcon, endIcon: BlankIcon }}
      sx={{ flexGrow: 1, overflowY: "auto", height:'100%' }}
      defaultExpandedItems={getExpandedTagIds(data) || []}
    >
      {data.map((tree) => renderTree(tree))}
    </SimpleTreeView>

  );
};

export default TreeView;
