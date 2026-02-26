import { z as zod } from "zod";
import { useMemo } from "react";

import {
  answerConditionRefinement,
  baseTriggerTaskSchema,
  recipientsRequiredRefinement,
} from "./trigger-task";
import { useQuestionStepSchema } from "./questions";
import { useCreateTemplateTranslations } from "../../translation/useCreateTemplateTranslations";

export const useNotificationStepSchema = () => {
  const { VALIDATION } = useCreateTemplateTranslations();
  const { richTextValidationSchema } = useQuestionStepSchema();
  return useMemo(() => {
    const notificationSchema = baseTriggerTaskSchema
      .extend({
        messageTemplates: zod.object({
          id: zod.number().optional(),
          subject: richTextValidationSchema,
          message: richTextValidationSchema,
        }),
      })
      .superRefine((data, ctx) => {
        recipientsRequiredRefinement(data, ctx);
        answerConditionRefinement(data, ctx);
      });

    const notificationStepSchema = zod.object({
      notification: notificationSchema,
    });

    return { notificationStepSchema, notificationSchema };
  }, [VALIDATION, richTextValidationSchema]);
};

export type NotificationStep = zod.infer<
  ReturnType<typeof useNotificationStepSchema>["notificationStepSchema"]
>;
export type NotificationSchema = zod.infer<
  ReturnType<typeof useNotificationStepSchema>["notificationSchema"]
>;
