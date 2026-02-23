import { z as zod } from "zod";

/**
 * Common schema for recipient organization
 */
export const recipientOrgSchema = zod.object({
  recipientId: zod.string(),
  triggerId: zod.string().nullable(),
  orgId: zod.number(),
});

/**
 * Common schema for recipient organization type
 */
export const recipientOrgTypeSchema = zod.object({
  recipientId: zod.string(),
  triggerId: zod.string().nullable(),
  orgTypeId: zod.number(),
});

/**
 * Common schema for recipient position
 */
export const recipientPositionSchema = zod.object({
  recipientId: zod.string(),
  triggerId: zod.string().nullable(),
  positionId: zod.number().min(1, "Field is required"),
});

/**
 * Common schema for recipient organization type position
 */
export const recipientOrgTypePositionSchema = zod.object({
  orgTypePositionId: zod.number().min(1, "Field is required"),
  triggerId: zod.string().nullable(),
  orgTypeId: zod.number().nullable(),
  positionId: zod.number().nullable().optional(),
});

/**
 * Common schema for trigger task condition
 */
export const triggerConditionSchema = zod.object({
  condition: zod
    .enum(["TASK_COMPLETED", "TASK_EXPIRED", "TASK_COMPLIANCE", "ANSWER"])
    .nullable()
    .refine((val) => val !== null && val !== undefined, {
      message: "Condition is required",
    }),
  questionId: zod.string().nullable().optional(),
  answerIndex: zod.string().nullable().optional(),
  recipients: zod.array(zod.string()).optional(),
});

/**
 * Common schema for trigger task recipients
 */

export const triggerNewCustomRecipientSchema = zod.object({
  recipientId: zod.string().optional(),
  orgLevel: zod.number().optional(),
  orgs: zod.array(zod.number()).optional(),
  orgTypes: zod.array(zod.number()).optional(),
  positions: zod.array(zod.number()).optional(),
});

export const triggerRecipientSchema = zod.object({
  customRecipients: triggerNewCustomRecipientSchema,
  isRelative: zod.boolean().optional(),
  isOrgTypeRelative: zod.boolean().optional(),
});

export const triggerNewCustomRecipientStepSchema = zod.object({
  recipient: triggerRecipientSchema,
});

/**
 * Base schema for trigger tasks (notifications: MESSAGE and follow-up tasks: TASK)
 */
export const baseTriggerTaskSchema = zod
  .object({
    triggerType: zod.enum(["MESSAGE", "TASK"]),
    triggerId: zod.string().optional().nullable(),
  })
  .merge(triggerConditionSchema)
  .merge(triggerRecipientSchema);

export type TriggerCondition = zod.infer<typeof triggerConditionSchema>;
export type TriggerRecipient = zod.infer<typeof triggerRecipientSchema>;
export type BaseTriggerTask = zod.infer<typeof baseTriggerTaskSchema>;
export type TriggerNewCustomRecipientStep = zod.infer<
  typeof triggerNewCustomRecipientStepSchema
>;
