import React, { useCallback } from "react";
import classNames from "classnames";
import type { FlatListProps, OrgNode } from "@/core/types/org-selector.type";

export function FlatList({ nodes, selectedIds, onSelectedChange }: FlatListProps) {
  const toggle = useCallback((id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedChange(selectedIds.filter((s) => s !== id));
    } else {
      onSelectedChange([...selectedIds, id]);
    }
  }, [selectedIds, onSelectedChange]);

  // Flatten tree nodes to a single list
  function flattenNodes(nodes: OrgNode[]): OrgNode[] {
    return nodes.reduce<OrgNode[]>((acc, node) => {
      acc.push(node);
      if (node.children) acc.push(...flattenNodes(node.children));
      return acc;
    }, []);
  }

  const flatNodes = flattenNodes(nodes);

  return (
    <div className="org-flat-list">
      {flatNodes.map((node) => {
        const isSelected = selectedIds.includes(node.id);
        return (
          <button
            key={node.id}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            className={classNames("org-flat-list__item", {
              "org-flat-list__item--selected": isSelected,
            })}
            onClick={() => toggle(node.id)}
          >
            <span
              className={classNames("org-tree-node__checkbox", {
                "org-tree-node__checkbox--checked": isSelected,
              })}
            >
              {isSelected && (
                <svg viewBox="0 0 10 8" fill="none" className="org-tree-node__check-icon">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="org-flat-list__label">{node.label}</span>
          </button>
        );
      })}
    </div>
  );
}
