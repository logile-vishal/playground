import type { SORT_DIRECTION } from "../constants/sort";

export type SortType = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];
