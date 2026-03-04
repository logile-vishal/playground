import type { ReactNode } from "react";

export type BadgeColor =
  | "blue"
  | "grey"
  | "red"
  | "orange"
  | "green"
  | "yellow"
  | "purple"
  | "pink"
  | "teal"
  | "disable";

export type BadgeSize = "xxs" | "xs" | "sm" | "md" | "xl" | "xxl";
export type BadgeStyle = "filled" | "light" | "outline" | "alpha";
export type BadgeShape = "rounded" | "pill" | "number";

export interface BadgeProps {
  /** Additional CSS class names */
  className?: string;
  /** Color variant of the badge */
  color?: BadgeColor;
  /** Text content or number to display inside */
  children?: ReactNode;
  /** Icon to display before the label */
  leadIcon?: ReactNode;
  /** The overall shape of the badge */
  shape?: BadgeShape;
  /** The size variant */
  size?: BadgeSize;
  /** The visual style */
  style?: BadgeStyle;
  /** Icon to display after the label */
  tailIcon?: ReactNode;
}
