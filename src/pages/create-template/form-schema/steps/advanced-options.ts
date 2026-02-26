import { z as zod } from "zod";
import { useMemo } from "react";

export const advancedOptionsSchema = zod.object({
  complianceThreshold: zod.number().optional(),
  labourHours: zod.number().optional(),
  labourHoursUnit: zod.enum(["DAY", "HOUR", "MINUTE"]).optional(),
  templateAccess: zod.enum(["PUBLIC", "PRIVATE"]).optional(),
  signatureRequired: zod.boolean().optional(),
});

export const useAdvancedOptionsSchema = (): typeof advancedOptionsSchema => {
  return useMemo(() => advancedOptionsSchema, []);
};
