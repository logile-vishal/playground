import type { IconColorType } from "@/core/types/icon.type";
import type { SvgIconComponent } from "../../icon/Icon";

export type NestedMenuItem = {
  name: string;
  value: string;
  subMenu?: NestedMenuItem[];
  customSubMenu?: React.ReactNode;
  righticon?: string;
  leftIcon?: SvgIconComponent;
  leftIconStyleProps?: { color?: IconColorType; fill?: string };
  rightIconStyleProps?: { color?: IconColorType; fill?: string };
  labelStyleProps?: { color?: string; fontWeight?: number | string };
  pathArray?: string[];
  path?: string;
  parentAsItem?: boolean;
};
export type PopupPosition = {
  anchorOrigin: {
    vertical: "top" | "bottom";
    horizontal: "left" | "right";
  };
  transformOrigin: {
    vertical: "top" | "bottom";
    horizontal: "left" | "right";
  };
};
