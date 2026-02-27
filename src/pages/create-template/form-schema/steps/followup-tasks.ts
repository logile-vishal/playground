import { z as zod } from "zod";
import { useMemo } from "react";

import { useTriggerTaskSchemas } from "./trigger-task";
import { useCreateTemplateTranslations } from "../../translation/useCreateTemplateTranslations";
import { useQuestionStepSchema } from "./questions";

export const useFollowUpTaskStepSchema = () => {
  const { VALIDATION } = useCreateTemplateTranslations();
  const { richTextValidationSchema } = useQuestionStepSchema();
  const {
    answerConditionRefinement,
    recipientsRequiredRefinement,
    baseTriggerTaskSchema,
  } = useTriggerTaskSchemas();

  return useMemo(() => {
    const followUpTaskSchema = baseTriggerTaskSchema
      .extend({
        primaryOrgLevelPos: zod.string().optional().nullable(),
        triggerTaskName: richTextValidationSchema,
        templateId: zod
          .number()
          .min(1, VALIDATION.FOLLOWUP_TASKS.templateRequired),
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

    const followUpTaskStepSchema = zod.object({
      followUp: followUpTaskSchema,
    });

    return { followUpTaskStepSchema, followUpTaskSchema };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [VALIDATION]);
};

export type FollowUpTaskStep = zod.infer<
  ReturnType<typeof useFollowUpTaskStepSchema>["followUpTaskStepSchema"]
>;
export type FollowUpTaskSchema = zod.infer<
  ReturnType<typeof useFollowUpTaskStepSchema>["followUpTaskSchema"]
>;
