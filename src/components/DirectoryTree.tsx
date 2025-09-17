import React from "react";
import { SimpleTreeView, TreeItem, treeItemClasses } from "@mui/x-tree-view";
import { styled } from "@mui/material/styles";
import SvgIcon from "@/core/components/Icon";
import Box from "@mui/material/Box";
import "./style.scss";

type TreeNode = {
  tagId: number;
  tagName: string;
  children?: TreeNode[];
};

interface DirectoryTreeProps {
  data: TreeNode[];
  setSelectedData: React.Dispatch<React.SetStateAction<number | null>>;
  handleClick: (id: string) => void;
}

const StyledTreeItem = styled(TreeItem)(() => ({
  [`& .${treeItemClasses.label}`]: {
    fontSize: "17px",
    fontWeight: 400,
    color: "#333333",
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
    fontWeight: 500,
  },
  [`& .MuiTreeItem-iconContainer`]: {
    width: "auto",
  },
}));

const ArrowRightIcon = () => (
  <SvgIcon component="arrowRightFill" size={24} fill="#5C5C5C" />
);

const ArrowDownIcon = () => (
  <SvgIcon component="arrowDownFill" size={24} fill="#5C5C5C" />
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

const DirectoryTree: React.FC<DirectoryTreeProps> = ({ data, handleClick }) => {

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
    <div className="template-directory-tree-main-container">
    <SimpleTreeView
      aria-label="directory tree"
      slots={{ expandIcon: ArrowRightIcon, collapseIcon: ArrowDownIcon, endIcon: BlankIcon }}
      sx={{ flexGrow: 1, overflowY: "auto", height:'100%' }}
      defaultExpandedItems={getExpandedTagIds(data) || []}
    >
      {data.map((tree) => renderTree(tree))}
    </SimpleTreeView>
    </div>
  );
};

export default DirectoryTree;
