import { z as zod } from "zod";

import {
  answerConditionRefinement,
  baseTriggerTaskSchema,
  recipientsRequiredRefinement,
} from "./trigger-task";
import { richTextValidationSchema } from "./questions";

export const followUpTaskSchema = baseTriggerTaskSchema
  .extend({
    primaryOrgLevelPos: zod.string().optional().nullable(),
    triggerTaskName: richTextValidationSchema,
    templateId: zod
      .number()
      .min(
        1,
        "Template selection is required"
      ) /* TODO: Update validation message later */,
    durationValue: zod.string().nullable().optional(),
    durationType: zod.enum(["DAY", "HOUR", "MINUTE"]).nullable().optional(),
    originalTaskEndTime: zod.boolean().optional(),
    priority: zod.string().optional().nullable(),
    userRetainVisibility: zod.boolean().optional(),
    reminderNotificationType: zod
      .enum(["NONE", "TASK_DUE_TIME"])
      .optional()
      .nullable(),
    messageDefinition: zod
      .object({
        conditionUnit: zod
          .enum(["DAY", "HOUR", "MINUTE"])
          .nullable()
          .optional(),
        conditionValue: zod.number().nullable().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    answerConditionRefinement(data, ctx);
    recipientsRequiredRefinement(data, ctx);
  });

export const followUpTaskStepSchema = zod.object({
  followUp: followUpTaskSchema,
});

export type FollowUpTaskStep = zod.infer<typeof followUpTaskStepSchema>;
export type FollowUpTaskSchema = zod.infer<typeof followUpTaskSchema>;
