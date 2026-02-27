// React & third-party
import { useMemo } from "react";
import { z as zod } from "zod";

import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
// Core hooks
import { useBasicInfoStepSchema } from "./steps/basic-info";
import { useQuestionStepSchema } from "./steps/questions";
import { useAdvancedOptionsSchema } from "./steps/advanced-options";
import {
  useNotificationStepSchema,
  type NotificationSchema,
} from "./steps/notifications";
import {
  useFollowUpTaskStepSchema,
  type FollowUpTaskSchema,
} from "./steps/followup-tasks";

export const useCreateTemplateFormSchema = () => {
  const { VALIDATION } = useCreateTemplateTranslations();
  const basicInfoStepSchema = useBasicInfoStepSchema();
  const { questionStepSchema } = useQuestionStepSchema();
  const advancedOptionsSchema = useAdvancedOptionsSchema();
  const { notificationStepSchema } = useNotificationStepSchema();
  const { followUpTaskStepSchema } = useFollowUpTaskStepSchema();

  const gridColumnSchema = useMemo(
    () =>
      zod.object({
        columnId: zod.string(),
        title: zod.string().min(1, VALIDATION.COLUMNS?.fieldRequired),
      }),
    [VALIDATION]
  );

  const checklistTypeFormSchema = useMemo(
    () =>
      zod.object({
        templateType: zod.literal("checklist"),
        basicData: basicInfoStepSchema,
        questions: zod
          .array(questionStepSchema)
          .min(1, VALIDATION.QUESTIONS.optionsRequired),
        advancedOptions: advancedOptionsSchema,
        notifications: zod.array(notificationStepSchema) as zod.ZodType<
          NotificationSchema[]
        >,
        followUpTasks: zod.array(followUpTaskStepSchema) as zod.ZodType<
          FollowUpTaskSchema[]
        >,
      }),
    [
      basicInfoStepSchema,
      questionStepSchema,
      advancedOptionsSchema,
      notificationStepSchema,
      followUpTaskStepSchema,
      VALIDATION,
    ]
  );

  const gridTypeFormSchema = useMemo(
    () =>
      zod.object({
        templateType: zod.literal("grid"),
        basicData: basicInfoStepSchema,
        columns: zod
          .array(gridColumnSchema)
          .min(1, VALIDATION.COLUMNS?.oneColumnRequiredError),
        questions: zod
          .array(questionStepSchema)
          .min(1, VALIDATION.ROWS?.oneRowRequiredError),
        advancedOptions: advancedOptionsSchema,
        notifications: zod.array(notificationStepSchema) as zod.ZodType<
          NotificationSchema[]
        >,
        followUpTasks: zod.array(followUpTaskStepSchema) as zod.ZodType<
          FollowUpTaskSchema[]
        >,
      }),
    [
      basicInfoStepSchema,
      gridColumnSchema,
      questionStepSchema,
      advancedOptionsSchema,
      notificationStepSchema,
      followUpTaskStepSchema,
      VALIDATION,
    ]
  );

  const spreadsheetTypeFormSchema = useMemo(
    () =>
      zod.object({
        templateType: zod.literal("spreadsheet"),
        basicData: basicInfoStepSchema,
        advancedOptions: advancedOptionsSchema,
        notifications: zod.array(notificationStepSchema) as zod.ZodType<
          NotificationSchema[]
        >,
        followUpTasks: zod.array(followUpTaskStepSchema) as zod.ZodType<
          FollowUpTaskSchema[]
        >,
      }),
    [
      basicInfoStepSchema,
      advancedOptionsSchema,
      notificationStepSchema,
      followUpTaskStepSchema,
    ]
  );

  const formTypeFormSchema = useMemo(
    () =>
      zod.object({
        templateType: zod.literal("form"),
        basicData: basicInfoStepSchema,
        advancedOptions: advancedOptionsSchema,
        notifications: zod.array(notificationStepSchema) as zod.ZodType<
          NotificationSchema[]
        >,
        followUpTasks: zod.array(followUpTaskStepSchema) as zod.ZodType<
          FollowUpTaskSchema[]
        >,
      }),
    [
      basicInfoStepSchema,
      advancedOptionsSchema,
      notificationStepSchema,
      followUpTaskStepSchema,
    ]
  );

  return useMemo(
    () =>
      zod.discriminatedUnion("templateType", [
        checklistTypeFormSchema,
        gridTypeFormSchema,
        spreadsheetTypeFormSchema,
        formTypeFormSchema,
      ]),
    [
      checklistTypeFormSchema,
      gridTypeFormSchema,
      spreadsheetTypeFormSchema,
      formTypeFormSchema,
    ]
  );
};

export type CreateTemplateFormType = zod.infer<
  ReturnType<typeof useCreateTemplateFormSchema>
>;
