import type { ReactNode } from "react";

export type HeaderTabItem = {
  /** Unique key for the tab */
  key: string;
  /** Display label */
  label: string;
  /** Optional leading icon */
  icon?: ReactNode;
  /** Show a red notification dot on the tab */
  alertDot?: boolean;
  /** Show a red badge with a count number */
  badge?: number;
  /** Disable the tab */
  disabled?: boolean;
};

export type HeaderTabsProps = {
  /** Array of tab configuration items */
  items: HeaderTabItem[];
  /** Sits underneath the active tab; bordered adds a bottom stroke map */
  bordered?: boolean;
  /** The currently selected tab's key */
  activeKey?: string;
  /** Triggered when a new tab is selected */
  onChange?: (key: string) => void;
  /** Optional extra classes */
  className?: string;
};
