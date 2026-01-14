import { z as zod } from "zod";

/* Schema for Steps */
export const basicInfoStepSchema = zod.object({});
export const questionStepSchema = zod.discriminatedUnion("questionType", [
  zod.object({
    qId: zod.string(),
    questionType: zod.literal("radio"),
    basicData: zod.object({
      title: zod
        .string()
        .refine(
          (val) =>
            val.trim() !== "" &&
            val.trim() !== "<p></p>" &&
            val.trim() !== "<p><br></p>",
          {
            message: "This field is required", //TODO: Check for error message and replace once confirmed
          }
        ),
      response: zod
        .array(
          zod.object({
            optionId: zod.string(),
            title: zod.string(),
          })
        )
        .min(2, "This field is required"), //TODO: Check for error message and replace once confirmed
    }),
    advancedSettings: zod.object({
      isRequired: zod.boolean(),
      notification: zod.object({
        title: zod.string().optional(),
        description: zod.string().optional(),
      }),
    }),
  }),
  zod.object({
    type: zod.literal("section"),
    sectionName: zod.string(),
    questions: zod.array(zod.lazy(() => questionStepSchema)),
  }),
]);
export const advancedOptionsSchema = zod.object({});
export const notificationStepSchema = zod.object({});
export const followUpTaskStepSchema = zod.array(zod.object({}));

export const gridColumnSchema = zod.object({
  columnId: zod.string(),
  title: zod.string(),
}); // TODO: Define the schema properly

export const checklistTypeFormSchema = zod.object({
  templateType: zod.literal("checklist"),
  basicData: basicInfoStepSchema,
  questions: zod.array(questionStepSchema),
  advancedOptions: advancedOptionsSchema,
  notifications: zod.array(notificationStepSchema),
  followUpTask: followUpTaskStepSchema,
});

export const gridTypeFormSchema = zod.object({
  templateType: zod.literal("grid"),
  basicData: basicInfoStepSchema,
  column: gridColumnSchema,
  row: zod.array(questionStepSchema),
  advancedOptions: advancedOptionsSchema,
  notifications: zod.array(notificationStepSchema),
  followUpTask: followUpTaskStepSchema,
});

export const spreadsheetTypeFormSchema = zod.object({
  templateType: zod.literal("spreadsheet"),
  basicData: basicInfoStepSchema,
  advancedOptions: advancedOptionsSchema,
  notifications: zod.array(notificationStepSchema),
  followUpTask: followUpTaskStepSchema,
});

export const createTemplateFormSchema = zod.discriminatedUnion("templateType", [
  checklistTypeFormSchema,
  gridTypeFormSchema,
  spreadsheetTypeFormSchema,
]);

export type CreateTemplateFormType = zod.infer<typeof createTemplateFormSchema>;
export type QuestionStepType = zod.infer<typeof questionStepSchema>;
