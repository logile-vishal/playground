import { z as zod } from "zod";

import { baseTriggerTaskSchema } from "./trigger-task";

export const notificationSchema = baseTriggerTaskSchema.extend({
  messageTemplates: zod.object({
    id: zod.number().optional(),
    subject: zod
      .string()
      .min(
        1,
        "Field is required"
      ) /** TODO: error message will be modified later */,
    message: zod
      .string()
      .min(
        1,
        "Field is required"
      ) /** TODO: error message will be modified later */,
  }),
});

export const notificationStepSchema = zod.object({
  notification: notificationSchema,
});

export type NotificationStep = zod.infer<typeof notificationStepSchema>;
export type NotificationSchema = zod.infer<typeof notificationSchema>;
