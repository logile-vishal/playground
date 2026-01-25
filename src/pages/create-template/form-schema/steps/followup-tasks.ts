import { z as zod } from "zod";

import { baseTriggerTaskSchema } from "./trigger-task";

export const followUpTaskStepSchema = baseTriggerTaskSchema.extend({
  taskSharing: zod.string().optional(),
  primaryOrgLevelPos: zod.string().optional(),
  triggerTaskName: zod.string().min(1, "Task name is required"),
  templateId: zod.number(),
  durationValue: zod.number(),
  durationType: zod.enum(["DAY", "HOUR", "MINUTE"]),
  originalTaskEndTime: zod.boolean().optional(),
  priority: zod.string().optional(),
  userRetainVisibility: zod.boolean().optional(),
  reminderNotificationType: zod.enum(["NONE", "TASK_DUE_TIME"]).optional(),
  messageDefinition: zod
    .object({
      conditionUnit: zod.enum(["DAY", "HOUR", "MINUTE"]),
      conditionValue: zod.number(),
    })
    .optional(),
});

export type FollowUpTaskStep = zod.infer<typeof followUpTaskStepSchema>;
