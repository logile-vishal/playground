import { z as zod } from "zod";

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
    questionType: zod.literal("section"),
    sectionName: zod.string(),
    questions: zod.array(zod.lazy(() => questionStepSchema)),
  }),
]);
