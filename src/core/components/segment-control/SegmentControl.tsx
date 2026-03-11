import React from "react";
import classNames from "classnames";
import type { SegmentControlProps, SegmentItem } from "@/core/types/segment-control.type";
import { Badge } from "@/core/components/badge/Badge";
import "./segment-control.scss";

export const SegmentControl: React.FC<SegmentControlProps> = ({
  items,
  activeKey,
  onChange,
  type = "surface",
  size = "xs",
  className,
  disabled = false,
}) => {
  const handleSelect = (item: SegmentItem) => {
    if (disabled || item.disabled) return;
    onChange?.(item.key);
  };

  return (
    <div
      className={classNames(
        "segment-control",
        `segment-control--type-${type}`,
        `segment-control--size-${size}`,
        { "segment-control--disabled": disabled },
        className
      )}
      role="tablist"
    >
      {items.map((item, index) => {
        const isActive = item.key === activeKey;
        const isDisabled = disabled || item.disabled;

        return (
          <button
            key={item.key}
            role="tab"
            aria-selected={isActive}
            disabled={isDisabled}
            onClick={() => handleSelect(item)}
            className={classNames(
              "segment-control__item",
              {
                "segment-control__item--active": isActive,
                "segment-control__item--disabled": isDisabled,
                "segment-control__item--first": index === 0,
                "segment-control__item--last": index === items.length - 1,
              }
            )}
            type="button"
          >
            {/* Separator — hidden on first item and when this or previous item is active */}
            {index > 0 && (
              <span className={classNames("segment-control__separator", {
                "segment-control__separator--hidden":
                  isActive || items[index - 1]?.key === activeKey,
              })} />
            )}

            {/* Label wrapper */}
            <span className="segment-control__label">
              {item.icon && (
                <span className="segment-control__icon">{item.icon}</span>
              )}
              <span className="segment-control__text">{item.label}</span>
              {item.badge !== undefined && (
                <Badge
                  color="orange"
                  size="xxs"
                  shape="number"
                  style="filled"
                >
                  {item.badge}
                </Badge>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SegmentControl;
