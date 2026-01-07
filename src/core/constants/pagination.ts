export const PAGINATION_EVENT_TYPE = {
  prev: "prev",
  next: "next",
  pageSize: "pageSize",
  currentPage: "currentPage",
} as const;

export const PAGINATION_SIZE = {
  small: "small",
  large: "large",
} as const;

export const DEFAULT_PAGINATION_SIZE_OPTIONS = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];
