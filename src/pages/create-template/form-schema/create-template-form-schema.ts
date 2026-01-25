import { z as zod } from "zod";
import { basicInfoStepSchema } from "./steps/basic-info";
import { questionStepSchema } from "./steps/questions";
import { advancedOptionsSchema } from "./steps/advanced-options";
import { notificationStepSchema } from "./steps/notifications";
import { followUpTaskStepSchema } from "./steps/followup-tasks";

export const gridColumnSchema = zod.object({
  columnId: zod.string(),
  title: zod.string(),
});

export const checklistTypeFormSchema = zod.object({
  templateType: zod.literal("checklist"),
  basicData: basicInfoStepSchema,
  questions: zod.array(questionStepSchema),
  advancedOptions: advancedOptionsSchema,
  notifications: zod.array(notificationStepSchema),
  followUpTask: zod.array(followUpTaskStepSchema),
});

export const gridTypeFormSchema = zod.object({
  templateType: zod.literal("grid"),
  basicData: basicInfoStepSchema,
  column: gridColumnSchema,
  row: zod.array(questionStepSchema),
  advancedOptions: advancedOptionsSchema,
  notifications: zod.array(notificationStepSchema),
  followUpTask: zod.array(followUpTaskStepSchema),
});

export const spreadsheetTypeFormSchema = zod.object({
  templateType: zod.literal("spreadsheet"),
  basicData: basicInfoStepSchema,
  advancedOptions: advancedOptionsSchema,
  notifications: zod.array(notificationStepSchema),
  followUpTask: zod.array(followUpTaskStepSchema),
});

export const formTypeFormSchema = zod.object({
  templateType: zod.literal("form"),
  basicData: basicInfoStepSchema,
  advancedOptions: advancedOptionsSchema,
  notifications: zod.array(notificationStepSchema),
  followUpTask: zod.array(followUpTaskStepSchema),
});

export const createTemplateFormSchema = zod.discriminatedUnion("templateType", [
  checklistTypeFormSchema,
  gridTypeFormSchema,
  spreadsheetTypeFormSchema,
  formTypeFormSchema,
]);

export type CreateTemplateFormType = zod.infer<typeof createTemplateFormSchema>;
export type QuestionStepType = zod.infer<typeof questionStepSchema>;
