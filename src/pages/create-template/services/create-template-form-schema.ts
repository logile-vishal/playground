import { z as zod } from "zod";

export const basicDataSchema = zod.object({});

export const questionsSchema = zod.discriminatedUnion("type", [
  zod.object({
    qId: zod.string(),
    type: zod.literal("radio"),
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
    questions: zod.array(zod.lazy(() => questionsSchema)),
  }),
]);

export const advancedOptionsSchema = zod.object({});

export const notificationsSchema = zod.object({});
export const followUpTaskSchema = zod.array(zod.object({}));

export const createTemplateFormSchema = zod.object({
  basicData: basicDataSchema,
  questions: zod.array(questionsSchema),
  advancedOptions: advancedOptionsSchema,
  notifications: zod.array(notificationsSchema),
  followUpTask: followUpTaskSchema,
});
