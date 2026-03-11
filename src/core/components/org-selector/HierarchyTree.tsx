import classNames from "classnames";
import type { HierarchyTreeProps, OrgNode } from "@/core/types/org-selector.type";
import CTreeView from "@/core/components/tree-view/TreeView";

function getAllChildIds(node: OrgNode): string[] {
  const ids: string[] = [node.id];
  if (node.children) {
    node.children.forEach((child) => {
      ids.push(...getAllChildIds(child));
    });
  }
  return ids;
}

export function HierarchyTree({ nodes, selectedIds, onSelectedChange }: HierarchyTreeProps) {
  const handleCheckboxChange = (node: OrgNode, isActuallySelected: boolean) => {
    const childIds = getAllChildIds(node);
    if (isActuallySelected) {
      onSelectedChange(selectedIds.filter((id) => !childIds.includes(id)));
    } else {
      const newIds = [...selectedIds];
      childIds.forEach((id) => {
        if (!newIds.includes(id)) newIds.push(id);
      });
      onSelectedChange(newIds);
    }
  };

  return (
    <div className="org-hierarchy-tree">
      <CTreeView<OrgNode>
        data={nodes}
        expandAll={true}
        getItemId={(node) => node.id}
        getItemLabel={(node) => node.label}
        getItemChildren={(node) => node.children}
        renderLabel={(node) => {
          const hasChildren = node.children && node.children.length > 0;
          const isSelected = selectedIds.includes(node.id);
          const childIds = hasChildren ? getAllChildIds(node).slice(1) : [];
          const someSelected = hasChildren && childIds.some((id) => selectedIds.includes(id));
          const allChildrenSelected = hasChildren && childIds.every((id) => selectedIds.includes(id));
          const isIndeterminate = someSelected && !allChildrenSelected;
          
          const isActuallySelected = isSelected || allChildrenSelected;

          return (
            <div className="org-tree-node__row">
              {/* Checkbox */}
              <button
                type="button"
                role="checkbox"
                aria-checked={isIndeterminate ? "mixed" : isActuallySelected}
                className="org-tree-node__checkbox-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(node, isActuallySelected);
                }}
              >
                <span
                  className={classNames("org-tree-node__checkbox", {
                    "org-tree-node__checkbox--checked": isActuallySelected,
                    "org-tree-node__checkbox--indeterminate": isIndeterminate,
                  })}
                >
                  {isActuallySelected && !isIndeterminate && (
                    <svg viewBox="0 0 10 8" fill="none" className="org-tree-node__check-icon">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {isIndeterminate && (
                    <span className="org-tree-node__indeterminate-bar" />
                  )}
                </span>
              </button>

              {/* Label */}
              <span className="org-tree-node__label">{node.label}</span>
            </div>
          );
        }}
      />
    </div>
  );
}
