import type { IconColorType } from "@/core/types/icon.type";
import type { SvgIconComponent } from "../../icon/Icon";

export type NestedMenuItem = {
  label: string;
  /** Legacy fields used by some tests */
  name?: string;
  filterHelperText?: string;
  value: string;
  /** Optional legacy path fields for tests */
  path?: string;
  pathArray?: string[];
  subMenu?: {
    items: NestedMenuItem[];
    onClick?: (e: React.MouseEvent<HTMLElement>, item: NestedMenuItem) => void;
    width?: number | string;
    minWidth?: number | string;
  };
  customSubMenu?: React.ReactNode;
  righticon?: string;
  leftIcon?: SvgIconComponent;
  leftIconStyleProps?: { color?: IconColorType; fill?: string };
  rightIconStyleProps?: { color?: IconColorType; fill?: string };
  labelStyleProps?: { color?: string; fontWeight?: number | string };
  parentAsItem?: boolean;
  filterPath?: string;
};

// Template types for customizing menu item
export type MenuItemTemplateContext = {
  item: NestedMenuItem;
  isSelected: boolean;
  isFocused: boolean;
  isNested: boolean;
  hasCustomMenu: boolean;
  level: number;
};

export type MenuItemTemplates = {
  /** Custom template for rendering the entire item content */
  itemTemplate?: (context: MenuItemTemplateContext) => React.ReactNode;
  /** Custom template for rendering the label section */
  labelTemplate?: (context: MenuItemTemplateContext) => React.ReactNode;
  /** Custom template for rendering the left icon */
  leftIconTemplate?: (context: MenuItemTemplateContext) => React.ReactNode;
  /** Custom template for rendering the right/chevron icon */
  rightIconTemplate?: (context: MenuItemTemplateContext) => React.ReactNode;
};
