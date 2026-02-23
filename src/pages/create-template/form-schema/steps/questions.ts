import { z as zod } from "zod";
import {
  ATTACHMENTS_ENUM,
  INPUT_TYPE,
  OPTION_ATTACHMENT_REQUIRED_TYPE_ENUMS,
  QUESTION_TYPE,
} from "../../constants/questions";

const additionalInfoAnyCharactersSchema = zod.object({
  required: zod.boolean(),
  requiredType: zod.string().nullish(),
  inputType: zod.literal(INPUT_TYPE.ANY_CHARACTERS),
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

const optionSchema = zod.object({
  title: zod.string().min(1, "This field is required"), //TODO: Check for error message and replace once confirmed
  isCompliant: zod.boolean().nullish(),
  additionalInfo: zod
    .discriminatedUnion("inputType", [
      additionalInfoAnyCharactersSchema,
      additionalInfoNumberSchema,
      additionalInfoDateTimeSchema,
    ])
    .optional(),
  isDefault: zod.boolean().optional(),
  score: zod.number().optional(),
  formula: zod.string().optional(),
});

export const richTextValidationSchema = zod.string().refine(
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
const radioBasicSettingsSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.RADIO),
  title: richTextValidationSchema,
  response: zod.array(optionSchema).min(1, "This field is required"), //TODO: Check for error message and replace once confirmed
});

const dropdownBasicSettingsSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.DROPDOWN),
  title: richTextValidationSchema,
  response: zod.array(optionSchema).min(1, "This field is required"), //TODO: Check for error message and replace once confirmed
});

const checkboxBasicSettingsSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.CHECKBOX),
  title: richTextValidationSchema,
  response: zod.array(optionSchema).min(1, "This field is required"), //TODO: Check for error message and replace once confirmed
});

const dynamicDropdownBasicSettingsSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.DYNAMIC_DROPDOWN),
  title: richTextValidationSchema,
  response: zod.array(optionSchema).min(1, "This field is required"), //TODO: Check for error message and replace once confirmed
});

const barcodeScanBasicSettingsSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.BARCODE_SCAN),
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
  value: zod.string(),
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
  value: zod.string(),
});

/* Section Type */
export const sectionSchema = zod.object({
  questionType: zod.literal(QUESTION_TYPE.SECTION),
  title: zod.string(),
  subQuestions: zod.array(zod.lazy(() => questionStepSchema)).optional(),
});

const basicTabSchema = zod.union([
  radioBasicSettingsSchema,
  dropdownBasicSettingsSchema,
  checkboxBasicSettingsSchema,
  dynamicDropdownBasicSettingsSchema,
  barcodeScanBasicSettingsSchema,
  labelBasicSettingsSchema,
  zod.discriminatedUnion("inputType", sortInputSchema),
  longInputBasicSettingsSchema,
  responseTemplateBasicSettingsSchema,
  sectionSchema,
]);

const advanceTabSchema = zod.object({
  visibilityRule: zod.object({
    storeClusters: zod.object({
      isApplicable: zod.boolean(),
      clustersList: zod
        .array(
          zod.object({
            clusterId: zod.number().nullish(),
            clusterName: zod.string().nullish(),
            clusterValues: zod
              .array(
                zod.object({
                  clusterId: zod.number().nullish(),
                  clusterName: zod.string().nullish(),
                  clusterValueId: zod.number().nullish(),
                  clusterValueName: zod.string().nullish(),
                })
              )
              .nullish(),
          })
        )
        .optional(),
    }),
    basedOnPreviousAnswers: zod.object({
      isApplicable: zod.boolean(),
      previousAnswers: zod
        .object({
          questionTitle: zod.string().nullish(),
        })
        ?.nullish()
        .optional(),
      answerOption: zod.string().nullish().optional(),
    }),
    isRandom: zod.boolean(),
    previousExecutionStatus: zod
      .object({
        isApplicable: zod.boolean(),
        status: zod.string().nullish(),
      })
      .optional(),
  }),
  tags: zod
    .array(
      zod.object({
        tagId: zod.number().optional().nullable(),
        tagName: zod.string().optional().nullable(),
        attributeId: zod.number().optional().nullable(),
        attributeName: zod.string().optional().nullable(),
      })
    )
    .optional(),
  fileAttachments: zod.object({
    isApplicable: zod.boolean(),
    attachments: zod
      .object({
        attachmentType: zod.enum(ATTACHMENTS_ENUM).nullish().optional(),
        requiredType: zod
          .enum(OPTION_ATTACHMENT_REQUIRED_TYPE_ENUMS)
          .optional()
          .nullish(),
        selectedOption: zod
          .object({
            title: zod.string().optional().nullish(),
          })
          .nullish()
          .optional(),
      })
      .optional()
      .nullish(),
  }),
  numericValue: zod
    .object({
      isApplicable: zod.boolean(),
      type: zod.string().nullish().optional(),
    })
    .optional(),
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
