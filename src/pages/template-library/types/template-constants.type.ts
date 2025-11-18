import type { ReactNode } from "react";

export type SortOption = {
  getLabel: () => ReactNode;
  key: "ASC" | "DESC";
  name?: string;
};