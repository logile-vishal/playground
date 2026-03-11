import type { ReactNode } from "react";

export type SegmentControlType = "surface" | "primary" | "secondary";
export type SegmentControlSize = "xs" | "sm" | "md";

export interface SegmentItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: number;
  disabled?: boolean;
}

export interface SegmentControlProps {
  items: SegmentItem[];
  activeKey: string;
  onChange?: (key: string) => void;
  type?: SegmentControlType;
  size?: SegmentControlSize;
  className?: string;
  disabled?: boolean;
}
