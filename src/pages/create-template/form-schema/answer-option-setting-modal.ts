import { z as zod } from "zod";
import { useMemo } from "react";

import { INPUT_TYPE } from "../constants/questions";

const additionalInfoAnyCharactersSchema = zod.object({
  required: zod.boolean(),
  requiredType: zod.string().nullish(),
  inputType: zod.literal(INPUT_TYPE.ANY_CHARACTERS),
  minLength: zod.string().optional().nullable(),
  maxLength: zod.string().optional().nullable(),
});

const additionalInfoTextOnlySchema = zod.object({
  required: zod.boolean(),
  requiredType: zod.string().nullish(),
  inputType: zod.literal(INPUT_TYPE.TEXT_ONLY),
  minLength: zod.string().optional().nullable(),
  maxLength: zod.string().optional().nullable(),
});

const additionalInfoNumberSchema = zod.object({
  required: zod.boolean(),
  requiredType: zod.string().nullish(),
  inputType: zod.literal(INPUT_TYPE.NUMBER_ONLY),
  minValue: zod.string().optional().nullable(),
  maxValue: zod.string().optional().nullable(),
});

const additionalInfoDateTimeSchema = zod.object({
  required: zod.boolean(),
  requiredType: zod.string().nullish(),
  inputType: zod.literal(INPUT_TYPE.DATE_TIME),
  value: zod.string().optional().nullable(),
});
/**
 * Answer Option Setting Modal Form Schema
 * Defines validation rules for individual answer options in question configurations
 */

const answerSettingSchema = zod.object({
  // Answer option value - required field
  title: zod
    .string()
    .min(1, "Value is required")
    .max(255, "Value cannot exceed 255 characters"),

  // Whether this is the default option
  isDefault: zod.boolean().optional().default(false),

  // Compliance status: true (Compliant), false (Non-Compliant), null (N/A)
  isCompliant: zod.boolean().nullable().optional(),

  // Score for this answer option
  score: zod.number().optional(),

  // Additional information requirement
  additionalInfo: zod
    .discriminatedUnion("inputType", [
      additionalInfoAnyCharactersSchema,
      additionalInfoTextOnlySchema,
      additionalInfoNumberSchema,
      additionalInfoDateTimeSchema,
    ])
    .optional(),

  formula: zod
    .string()
    .optional()
    .refine(
      (val) => {
        // If formula is not enabled, it's optional
        if (!val) return true;
        // Only allow operators, numbers, spaces, and AND/OR keywords
        const formulaRegex = /^(?:[0-9<>=!\s]|AND|OR)+$/i;
        return formulaRegex.test(val);
      },
      {
        message:
          "Formula must contain valid operators (<, >, <=, >=, ==, <>, AND, OR) or numbers",
      }
    ),
});

export const answerOptionSettingModalSchema = zod.object({
  answerOptions: zod
    .array(answerSettingSchema)
    .min(1, "At least one answer option is required"),
});

// Export the type for TypeScript
export type AnswerSettingSchemaType = zod.infer<typeof answerSettingSchema>;

export const useAnswerOptionSettingModalSchema =
  (): typeof answerOptionSettingModalSchema => {
    return useMemo(() => answerOptionSettingModalSchema, []);
  };
