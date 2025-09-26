import type { ReactNode } from "react";

export type SortOption = {
  getLabel: () => ReactNode;
  key: "ASCENDING" | "DESCENDING";
};