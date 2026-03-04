import { clsx as classNames } from "clsx";
import type { BadgeProps } from "../../types/badge.type";
import "./badge.scss";

export function Badge({
  className,
  color = "blue",
  shape = "rounded",
  size = "md",
  style = "filled",
  leadIcon,
  tailIcon,
  children,
}: BadgeProps) {
  const rootClasses = classNames(
    "badge",
    `badge--color-${color}`,
    `badge--shape-${shape}`,
    `badge--size-${size}`,
    `badge--style-${style}`,
    className
  );

  return (
    <div className={rootClasses}>
      {leadIcon && <span className="badge__icon badge__icon--lead">{leadIcon}</span>}
      {children && <span className="badge__label">{children}</span>}
      {tailIcon && <span className="badge__icon badge__icon--tail">{tailIcon}</span>}
    </div>
  );
}
