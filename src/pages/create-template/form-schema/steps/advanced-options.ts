import { z as zod } from "zod";

export const advancedOptionsSchema = zod.object({
  complianceThreshold: zod.number().optional(),
  labourHours: zod.number().optional(),
  labourHoursUnit: zod.enum(["DAY", "HOUR", "MINUTE"]).optional(),
  templateAccess: zod.enum(["PUBLIC", "PRIVATE"]).optional(),
  signatureRequired: zod.boolean().optional(),
});
