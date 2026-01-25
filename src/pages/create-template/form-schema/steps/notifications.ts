import { z as zod } from "zod";

import { baseTriggerTaskSchema } from "./trigger-task";

export const notificationStepSchema = baseTriggerTaskSchema.extend({
  messageTemplates: zod.object({
    id: zod.number(),
    subject: zod.string(),
    body: zod.string(),
  }),
});

export type NotificationStep = zod.infer<typeof notificationStepSchema>;
