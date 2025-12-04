export const Severity = {
  INFORMATION: "information",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  FEATURE: "feature",
} as const;

export type SeverityType = (typeof Severity)[keyof typeof Severity];
