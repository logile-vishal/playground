import { z as zod } from "zod";

/**
 * Common schema for recipient organization
 */
export const recipientOrgSchema = zod.object({
  recipientId: zod.number(),
  triggerId: zod.number(),
  orgId: zod.number(),
});

/**
 * Common schema for recipient organization type
 */
export const recipientOrgTypeSchema = zod.object({
  recipientId: zod.number(),
  triggerId: zod.number(),
  orgTypeId: zod.number(),
});

/**
 * Common schema for recipient position
 */
export const recipientPositionSchema = zod.object({
  recipientId: zod.number(),
  triggerId: zod.number(),
  positionId: zod.number(),
});

/**
 * Common schema for recipient organization type position
 */
export const recipientOrgTypePositionSchema = zod.object({
  orgTypePositionId: zod.number(),
  triggerId: zod.number(),
  orgTypeId: zod.number(),
  positionId: zod.number(),
});

/**
 * Common schema for trigger task condition
 */
export const triggerConditionSchema = zod.object({
  condition: zod.enum(["TASK_COMPLETED", "TASK_EXPIRED", "TASK_COMPLIANCE"]),
  conditionQuestion: zod.string().optional(),
  conditionAnswer: zod.string().optional(),
});

/**
 * Common schema for trigger task recipients
 */
export const triggerRecipientSchema = zod.object({
  recipients: zod
    .array(zod.string())
    .min(1, "At least one recipient is required"),
  orgLevelId: zod.number(),
  recipientOrgs: zod.array(recipientOrgSchema).optional(),
  isRelative: zod.boolean().optional(),
  recipientOrgTypes: zod.array(recipientOrgTypeSchema).optional(),
  isOrgTypeRelative: zod.boolean().optional(),
  recipientPositions: zod.array(recipientPositionSchema).optional(),
  recipientOrgtypePositions: zod
    .array(recipientOrgTypePositionSchema)
    .optional(),
});

/**
 * Base schema for trigger tasks (notifications: MESSAGE and follow-up tasks: TASK)
 */
export const baseTriggerTaskSchema = zod.object({
  triggerType: zod.enum(["MESSAGE", "TASK"]),
  ...triggerConditionSchema.shape,
  ...triggerRecipientSchema.shape,
});

export type TriggerCondition = zod.infer<typeof triggerConditionSchema>;
export type TriggerRecipient = zod.infer<typeof triggerRecipientSchema>;
export type BaseTriggerTask = zod.infer<typeof baseTriggerTaskSchema>;
