import { z as zod } from "zod";

import {
  answerConditionRefinement,
  baseTriggerTaskSchema,
  recipientsRequiredRefinement,
} from "./trigger-task";
import { richTextValidationSchema } from "./questions";

export const notificationSchema = baseTriggerTaskSchema
  .extend({
    messageTemplates: zod.object({
      id: zod.number().optional(),
      subject:
        richTextValidationSchema /** TODO: error message will be modified later */,
      message:
        richTextValidationSchema /** TODO: error message will be modified later */,
    }),
  })
  .superRefine((data, ctx) => {
    recipientsRequiredRefinement(data, ctx);
    answerConditionRefinement(data, ctx);
  });

export const notificationStepSchema = zod.object({
  notification: notificationSchema,
});

export type NotificationStep = zod.infer<typeof notificationStepSchema>;
export type NotificationSchema = zod.infer<typeof notificationSchema>;
