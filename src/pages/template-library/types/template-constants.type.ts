import type { NestedMenuItem } from "@/core/components/nested-menu/types";
export type SortOption = NestedMenuItem & {
  fieldName: string;
  value: "ASC" | "DESC";
  label?: string;
};
