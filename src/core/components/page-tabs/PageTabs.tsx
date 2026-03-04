import React from "react";
import { clsx } from "clsx";
import type { PageTabItem, PageTabsProps } from "@/core/types/page-tabs.type";
import { Badge } from "@/core/components/badge/Badge";
import "./page-tabs.scss";

// ─── Single Page Tab ─────────────────────────────────────────────────

type PageTabProps = {
  item: PageTabItem;
  isActive: boolean;
  onClick: (key: string) => void;
};

const PageTab: React.FC<PageTabProps> = ({ item, isActive, onClick }) => {
  return (
    <button
      type="button"
      className={clsx({
        "page-tab": true,
        "page-tab--active": isActive,
        "page-tab--disabled": !!item.disabled,
      })}
      onClick={() => !item.disabled && onClick(item.key)}
      disabled={item.disabled}
      role="tab"
      aria-selected={isActive}
    >
      <span className="page-tab__label">{item.label}</span>
      {item.badge !== undefined && (
        <Badge
          size="xxs"
          shape="number"
          color={isActive ? "blue" : "grey"}
          style="light"
        >
          {item.badge}
        </Badge>
      )}
    </button>
  );
};

// ─── Page Tabs Group ─────────────────────────────────────────────────

export const PageTabs: React.FC<PageTabsProps> = ({
  items,
  activeKey,
  onChange,
  className,
}) => {
  return (
    <div className={clsx("page-tabs", className)} role="tablist">
      {items.map((item) => (
        <PageTab
          key={item.key}
          item={item}
          isActive={item.key === activeKey}
          onClick={(key) => onChange?.(key)}
        />
      ))}
    </div>
  );
};
