import { z as zod } from "zod";
import { basicInfoStepSchema } from "./steps/basic-info";
import { questionStepSchema } from "./steps/questions";
import { advancedOptionsSchema } from "./steps/advanced-options";
import {
  notificationStepSchema,
  type NotificationSchema,
} from "./steps/notifications";
import {
  followUpTaskSchema,
  type FollowUpTaskStep,
} from "./steps/followup-tasks";

export const gridColumnSchema = zod.object({
  columnId: zod.string(),
  title: zod.string().min(1, "Column title is required"),
});

export const checklistTypeFormSchema = zod.object({
  templateType: zod.literal("checklist"),
  basicData: basicInfoStepSchema,
  questions: zod
    .array(questionStepSchema)
    .min(1, "At least one question is required"),
  advancedOptions: advancedOptionsSchema,
  notifications: zod.array(notificationStepSchema) as zod.ZodType<
    NotificationSchema[]
  >,
  followUpTasks: zod.array(followUpTaskSchema) as zod.ZodType<
    FollowUpTaskStep[]
  >,
});

export const gridTypeFormSchema = zod.object({
  templateType: zod.literal("grid"),
  basicData: basicInfoStepSchema,
  columns: zod
    .array(gridColumnSchema)
    .min(1, "At least one column is required"),
  questions: zod
    .array(questionStepSchema)
    .min(1, "At least one row is required"),
  advancedOptions: advancedOptionsSchema,
  notifications: zod.array(notificationStepSchema) as zod.ZodType<
    NotificationSchema[]
  >,
  followUpTasks: zod.array(followUpTaskSchema) as zod.ZodType<
    FollowUpTaskStep[]
  >,
});

export const spreadsheetTypeFormSchema = zod.object({
  templateType: zod.literal("spreadsheet"),
  basicData: basicInfoStepSchema,
  advancedOptions: advancedOptionsSchema,
  notifications: zod.array(notificationStepSchema) as zod.ZodType<
    NotificationSchema[]
  >,
  followUpTasks: zod.array(followUpTaskSchema) as zod.ZodType<
    FollowUpTaskStep[]
  >,
});

export const formTypeFormSchema = zod.object({
  templateType: zod.literal("form"),
  basicData: basicInfoStepSchema,
  advancedOptions: advancedOptionsSchema,
  notifications: zod.array(notificationStepSchema) as zod.ZodType<
    NotificationSchema[]
  >,
  followUpTasks: zod.array(followUpTaskSchema) as zod.ZodType<
    FollowUpTaskStep[]
  >,
});

export const createTemplateFormSchema = zod.discriminatedUnion("templateType", [
  checklistTypeFormSchema,
  gridTypeFormSchema,
  spreadsheetTypeFormSchema,
  formTypeFormSchema,
]);

export type CreateTemplateFormType = zod.infer<typeof createTemplateFormSchema>;
export type QuestionType = zod.infer<typeof questionStepSchema>;
