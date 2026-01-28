import { z as zod } from "zod";
import {
  ATTACHMENTS_ENUM,
  DATE_TIME_ENUMS,
  INPUT_TYPE,
  OPTION_ATTCHMENT_REQUIRED_TYPE_ENUMS,
  QUESTION_TYPE,
  RESPONSE_TEMPLATE_ENUMS,
} from "../../constants/questions";

const optionSchema = zod.object({
  title: zod.string().min(1, "This field is required"), //TODO: Check for error message and replace once confirmed
  isCompliant: zod.boolean().nullish(),
  additionalInfo: zod
    .object({
      required: zod.boolean(),
      requiredType: zod.string().nullish(),
    })
    .optional(),
  isDefault: zod.boolean().optional(),
  score: zod.number().optional(),
  formula: zod.string().optional(),
});

const richTextValidationSchema = zod.string().refine(
  (val) => {
    const isValid =
      val.trim() !== "" &&
      val.trim() !== "<p></p>" &&
      val.trim() !== "<p><br></p>";
    return isValid;
  },
  {
    message: "This field is required", //TODO: Check for error message and replace once confirmed
  }
);

/* Question Type: Radio, Dropdown, Checkbox, Dynamic Dropdown, Barcode scan    */
const defaultBasicSettingsSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.RADIO),
  title: richTextValidationSchema,
  response: zod.array(optionSchema).min(1, "This field is required"), //TODO: Check for error message and replace once confirmed
});

/* Question Type: Label */

const labelBasicSettingsSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.LABEL),
  title: richTextValidationSchema,
});

/* Question Type: Sort Input */

/* Sort Input start */
const sortInputAnyCharactersSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.SORT_INPUT),
  inputType: zod.literal(INPUT_TYPE.ANY_CHARACTERS),
  title: richTextValidationSchema,
  minLength: zod.number().optional(),
  maxLength: zod.number().optional(),
});

const sortInputNumberSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.SORT_INPUT),
  inputType: zod.literal(INPUT_TYPE.NUMBER_ONLY),
  title: richTextValidationSchema,
  minValue: zod.number().optional(),
  maxValue: zod.number().optional(),
});

const sortInputDateTimeSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.SORT_INPUT),
  inputType: zod.literal(INPUT_TYPE.DATE_TIME),
  title: richTextValidationSchema,
  value: zod.enum(DATE_TIME_ENUMS),
});

const sortInputSchema = [
  sortInputAnyCharactersSchema,
  sortInputNumberSchema,
  sortInputDateTimeSchema,
] as const;

/* Sort Input end */

/* Long Input Question Type */
const longInputBasicSettingsSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.LONG_INPUT),
  title: richTextValidationSchema,
  minLength: zod.number().optional(),
  maxLength: zod.number().optional(),
});

/* Response Template Question Type */
const responseTemplateBasicSettingsSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.RESPONSE_TEMPLATE),
  title: richTextValidationSchema,
  value: zod.enum(RESPONSE_TEMPLATE_ENUMS),
});

/* Section Type */
export const sectionSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.SECTION),
  title: zod.string(),
  subQuestions: zod.array(zod.lazy(() => questionStepSchema)).optional(),
});

const basicTabSchema = zod.union([
  defaultBasicSettingsSchema,
  labelBasicSettingsSchema,
  zod.discriminatedUnion("inputType", sortInputSchema),
  longInputBasicSettingsSchema,
  responseTemplateBasicSettingsSchema,
  sectionSchema,
]);

const advanceTabSchema = zod.object({
  visibilityRule: zod.object({
    storeClusters: zod.object({
      isEnabled: zod.boolean(),
      clustersList: zod
        .array(
          zod.object({
            clusterId: zod.string().nullish(),
            clusterName: zod.string()?.nullish(),
            clusterValueId: zod.string().nullish(),
            clusterValueName: zod.string()?.nullish(),
          })
        )
        .optional(),
    }),
    basedOnPreviousAnswers: zod.object({
      isEnabled: zod.boolean(),
    }),
    isRandom: zod.boolean(),
    previousExecutionStatus: zod
      .object({
        isEnabled: zod.boolean(),
        status: zod.string(),
      })
      .optional(),
  }),
  tags: zod
    .array(
      zod.object({
        tagId: zod.number(),
        tagName: zod.string(),
        attributeId: zod.number(),
        attributeName: zod.string(),
      })
    )
    .optional(),
  fileAttachments: zod.object({
    isEnabled: zod.boolean(),
    attachments: zod
      .object({
        attachmentType: zod.enum(ATTACHMENTS_ENUM).nullish(),
        required: zod.boolean(),
        requiredType: zod
          .enum(OPTION_ATTCHMENT_REQUIRED_TYPE_ENUMS)
          .optional()
          .nullish(),
      })
      .optional()
      .nullish(),
  }),
  numericValue: zod.object({
    isEnabled: zod.boolean(),
    type: zod.string().nullish(),
  }),
});

export const questionStepSchema = zod.object({
  qId: zod.string(),
  index: zod.string().optional(),
  questionId: zod.number().nullish(),
  questionTypeId: zod.number().nullish(),
  parentTemplateId: zod.number().nullish(),
  isRequired: zod.boolean(),
  questionBasicData: basicTabSchema,
  questionAdvancedSettings: advanceTabSchema,
  subQuestions: zod.array(zod.lazy(() => questionStepSchema)).optional(),
});
