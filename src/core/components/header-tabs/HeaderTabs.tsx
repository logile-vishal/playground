import React from "react";
import { clsx } from "clsx";
import type { HeaderTabItem, HeaderTabsProps } from "@/core/types/header-tabs.type";
import { Badge } from "@/core/components/badge/Badge";
import "./HeaderTabs.scss";

// ─── Single Header Tab ───────────────────────────────────────────────

type HeaderTabProps = {
  item: HeaderTabItem;
  isActive: boolean;
  bordered: boolean;
  onClick: (key: string) => void;
};

const HeaderTab: React.FC<HeaderTabProps> = ({
  item,
  isActive,
  bordered,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={clsx({
        "header-tab": true,
        "header-tab--active": isActive,
        "header-tab--bordered": bordered,
        "header-tab--disabled": !!item.disabled,
      })}
      onClick={() => !item.disabled && onClick(item.key)}
      disabled={item.disabled}
      role="tab"
      aria-selected={isActive}
    >
      {/* 
        Active background: CSS rectangle with fixed 8px border-radius.
        Left and right flares (8px inverse curves) are purely CSS driven.
      */}
      {isActive && (
        <div className="header-tab__active-bg">
          <div className="header-tab__flare header-tab__flare--left" />
          <div className="header-tab__flare header-tab__flare--right" />
        </div>
      )}

      {/* Content wrapper */}
      <div className="header-tab__content">
        {item.icon && <span className="header-tab__icon">{item.icon}</span>}
        <span className="header-tab__label">{item.label}</span>
        {item.badge !== undefined && (
          <Badge size="xxs" shape="number" color="red" style="filled">
            {item.badge}
          </Badge>
        )}
        {item.alertDot && <span className="header-tab__alert-dot" />}
      </div>
    </button>
  );
};

// ─── Header Tabs Group ───────────────────────────────────────────────

const HeaderTabs: React.FC<HeaderTabsProps> = ({
  items,
  bordered = false,
  activeKey,
  onChange,
  className,
}) => {
  return (
    <div
      className={clsx(
        "header-tabs",
        bordered && "header-tabs--bordered",
        className
      )}
      role="tablist"
    >
      {items.map((item) => (
        <HeaderTab
          key={item.key}
          item={item}
          isActive={item.key === activeKey}
          bordered={bordered}
          onClick={(key) => onChange?.(key)}
        />
      ))}
    </div>
  );
};

export default HeaderTabs;
