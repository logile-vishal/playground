import { z as zod } from "zod";
import { useMemo } from "react";

import { useTriggerTaskSchemas } from "./trigger-task";
import { useQuestionStepSchema } from "./questions";
import { useCreateTemplateTranslations } from "../../translation/useCreateTemplateTranslations";

export const useNotificationStepSchema = () => {
  const { VALIDATION } = useCreateTemplateTranslations();
  const { richTextValidationSchema } = useQuestionStepSchema();
  const {
    answerConditionRefinement,
    recipientsRequiredRefinement,
    baseTriggerTaskSchema,
  } = useTriggerTaskSchemas();
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [VALIDATION, richTextValidationSchema]);
};

export type NotificationStep = zod.infer<
  ReturnType<typeof useNotificationStepSchema>["notificationStepSchema"]
>;
export type NotificationSchema = zod.infer<
  ReturnType<typeof useNotificationStepSchema>["notificationSchema"]
>;
