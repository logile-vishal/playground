import { z as zod } from "zod";
import { useMemo } from "react";

import { isNonEmptyValue } from "@/utils";

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
    .refine((value) => value !== null, { message: "Field is required" }),
  questionId: zod.string().nullable(),
  answerIndex: zod.string().nullable(),
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
 * Base fields for trigger tasks (notifications: MESSAGE and follow-up tasks: TASK)
 * Note: We define base fields separately because discriminatedUnion cannot be merged directly
 */
export const baseTriggerTaskSchema = zod
  .object({
    triggerType: zod.enum(["MESSAGE", "TASK"]),
    triggerId: zod.string().optional().nullable(),
  })
  .merge(triggerConditionSchema)
  .merge(triggerRecipientSchema);

/**
 * Refinement function for ANSWER condition validation
 * Use this when creating final schemas that need the conditional validation
 */
export const answerConditionRefinement = <
  T extends {
    condition?: string;
    questionId?: string | null;
    answerIndex?: string | null;
  },
>(
  data: T,
  ctx: zod.RefinementCtx
) => {
  if (data.condition === "ANSWER") {
    if (!data.questionId || data.questionId.trim() === "") {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: "Field is required",
        path: ["questionId"],
      });
    }
    if (!data.answerIndex || data.answerIndex.trim() === "") {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: "Field is required",
        path: ["answerIndex"],
      });
    }
  }
};

/**
 * Refinement function for recipients validation
 * Ensures at least one of recipients or customRecipients has a value
 */
export const recipientsRequiredRefinement = <
  T extends {
    recipients?: string[];
    customRecipients?: {
      orgLevel?: number;
      orgs?: number[];
      orgTypes?: number[];
      positions?: number[];
    };
  },
>(
  data: T,
  ctx: zod.RefinementCtx
) => {
  const hasRecipients = isNonEmptyValue(data.recipients);
  const hasCustomRecipients = isNonEmptyValue(data.customRecipients);

  if (!hasRecipients && !hasCustomRecipients) {
    ctx.addIssue({
      code: zod.ZodIssueCode.custom,
      message: "At least one recipient is required",
      path: ["recipients"],
    });
  }
};

export const useBaseTriggerTaskSchema = (): typeof baseTriggerTaskSchema => {
  return useMemo(() => baseTriggerTaskSchema, []);
};

export type TriggerCondition = zod.infer<typeof triggerConditionSchema>;
export type TriggerRecipient = zod.infer<typeof triggerRecipientSchema>;
export type BaseTriggerTask = zod.infer<typeof baseTriggerTaskSchema>;
export type TriggerNewCustomRecipientStep = zod.infer<
  typeof triggerNewCustomRecipientStepSchema
>;
