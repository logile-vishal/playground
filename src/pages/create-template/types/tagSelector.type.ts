import type { PopoverProps } from "@mui/material";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import type {
  TemplateTagsProps,
  TemplateTagsPropsForAdvanceFilter,
} from "./questions.type";

export type TagSelectorProps = {
  label: string;
  placeholder: string;
  value: TemplateTagsProps[] | TemplateTagsPropsForAdvanceFilter[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (event: React.MouseEvent, data: NestedMenuItem) => void;
  className?: string;
  anchorOrigin?: PopoverProps["anchorOrigin"];
  transformOrigin?: PopoverProps["transformOrigin"];
  menuWidth?: string;
  menuHeight?: string;
  isInLineLabel?: boolean;
};
