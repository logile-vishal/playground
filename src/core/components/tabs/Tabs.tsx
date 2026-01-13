import React from "react";
import { Tabs, type TabsProps } from "@mui/material";
import clsx from "@/utils/clsx";

import "./Tabs.scss";

export type CTabsProps = TabsProps & {
  variant?: "standard" | "scrollable";
};

/**
 * @method CTabs
 * @description Custom styled tabs component with consistent theming
 * @param {CTabsProps} props - Component props
 * @param {React.ReactNode} props.children - Tab elements to render
 * @param {number} props.value - Currently active tab value
 * @param {Function} props.onChange - Callback when tab selection changes
 * @param {string} [props.variant] - Tab variant (standard, scrollable)
 * @return {React.ReactNode} Custom styled tabs component
 */
const CTabs: React.FC<CTabsProps> = ({
  className,
  variant = "standard",
  ...props
}) => {
  return (
    <div className="tabs__container">
      <Tabs
        {...props}
        variant={variant}
        className={clsx({
          tabs: true,
          [className || ""]: !!className,
        })}
      />
    </div>
  );
};

export default CTabs;
