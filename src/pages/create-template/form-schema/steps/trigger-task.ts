import { z as zod } from "zod";
import { useMemo } from "react";
import { useCreateTemplateTranslations } from "../../translation/useCreateTemplateTranslations";
import { isNonEmptyValue } from "@/utils";

export const useTriggerTaskSchemas = () => {
  const { VALIDATION } = useCreateTemplateTranslations();

  return useMemo(() => {
    const recipientOrgSchema = zod.object({
      recipientId: zod.string(),
      triggerId: zod.string().nullable(),
      orgId: zod.number(),
    });

    const recipientOrgTypeSchema = zod.object({
      recipientId: zod.string(),
      triggerId: zod.string().nullable(),
      orgTypeId: zod.number(),
    });

    const recipientPositionSchema = zod.object({
      recipientId: zod.string(),
      triggerId: zod.string().nullable(),
      positionId: zod.number().min(1, VALIDATION.TRIGGER_TASK.fieldRequired),
    });

    const recipientOrgTypePositionSchema = zod.object({
      orgTypePositionId: zod
        .number()
        .min(1, VALIDATION.TRIGGER_TASK.fieldRequired),
      triggerId: zod.string().nullable(),
      orgTypeId: zod.number().nullable(),
      positionId: zod.number().nullable().optional(),
    });

    const triggerConditionSchema = zod.object({
      condition: zod
        .enum(["TASK_COMPLETED", "TASK_EXPIRED", "TASK_COMPLIANCE", "ANSWER"])
        .nullable()
        .refine((value) => value !== null, {
          message: VALIDATION.TRIGGER_TASK.fieldRequired,
        }),
      questionId: zod.string().nullable(),
      answerIndex: zod.string().nullable(),
      recipients: zod.array(zod.string()).optional(),
    });

    const triggerNewCustomRecipientSchema = zod.object({
      recipientId: zod.string().optional(),
      orgLevel: zod.number().optional(),
      orgs: zod.array(zod.number()).optional(),
      orgTypes: zod.array(zod.number()).optional(),
      positions: zod.array(zod.number()).optional(),
    });

    const triggerRecipientSchema = zod.object({
      customRecipients: triggerNewCustomRecipientSchema,
      isRelative: zod.boolean().optional(),
      isOrgTypeRelative: zod.boolean().optional(),
    });

    const triggerNewCustomRecipientStepSchema = zod.object({
      recipient: triggerRecipientSchema,
    });

    const baseTriggerTaskSchema = zod
      .object({
        triggerType: zod.enum(["MESSAGE", "TASK"]),
        triggerId: zod.string().optional().nullable(),
      })
      .merge(triggerConditionSchema)
      .merge(triggerRecipientSchema);

    const answerConditionRefinement = <
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
            message: VALIDATION.TRIGGER_TASK.fieldRequired,
            path: ["questionId"],
          });
        }
        if (!data.answerIndex || data.answerIndex.trim() === "") {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: VALIDATION.TRIGGER_TASK.fieldRequired,
            path: ["answerIndex"],
          });
        }
      }
    };

    const recipientsRequiredRefinement = <
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
          message: VALIDATION.TRIGGER_TASK.recipientsRequired,
          path: ["recipients"],
        });
      }
    };

    return {
      recipientOrgSchema,
      recipientOrgTypeSchema,
      recipientPositionSchema,
      recipientOrgTypePositionSchema,
      triggerConditionSchema,
      triggerNewCustomRecipientSchema,
      triggerRecipientSchema,
      triggerNewCustomRecipientStepSchema,
      baseTriggerTaskSchema,
      answerConditionRefinement,
      recipientsRequiredRefinement,
    };
  }, [VALIDATION]);
};

export type TriggerCondition = zod.infer<
  ReturnType<typeof useTriggerTaskSchemas>["triggerConditionSchema"]
>;
export type TriggerRecipient = zod.infer<
  ReturnType<typeof useTriggerTaskSchemas>["triggerRecipientSchema"]
>;
export type BaseTriggerTask = zod.infer<
  ReturnType<typeof useTriggerTaskSchemas>["baseTriggerTaskSchema"]
>;
export type TriggerNewCustomRecipientStep = zod.infer<
  ReturnType<
    typeof useTriggerTaskSchemas
  >["triggerNewCustomRecipientStepSchema"]
>;
