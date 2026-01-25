import { z as zod } from "zod";

/* Recursive Schema for Directory Structure */
type libraryStructure = {
  libraryId: number;
  subLibrary?: libraryStructure;
};

const directorySchema: zod.ZodType<libraryStructure> = zod.lazy(() =>
  zod.object({
    libraryId: zod.number(),
    subLibrary: directorySchema.optional(),
  })
) as zod.ZodType<libraryStructure>;

const basicInfoStepChecklistSchema = zod.object({
  baseTemplateType: zod.literal("checklist"),
  templateName: zod.string().min(1, "This field is required"),
  description: zod.string().optional(),
  templateType: zod.string().min(1, "This field is required"),
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
  libraryId: zod.number().min(1, "Directory ID is required"),
  libraryStructure: directorySchema,
});

const basicInfoStepFormSchema = zod.object({
  baseTemplateType: zod.literal("form"),
  templateName: zod.string().min(1, "This field is required"),
  description: zod.string().optional(),
  templateType: zod.string().min(1, "This field is required"),
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
  libraryId: zod.number().min(1, "This field is required"),
  libraryStructure: directorySchema,
  attachment: zod
    .array(
      zod.object({
        fileName: zod.string(),
        fileUrl: zod.string(),
      })
    )
    .min(1, "This field is required"),
});

const basicInfoStepSpreadsheetSchema = zod.object({
  baseTemplateType: zod.literal("spreadsheet"),
  templateName: zod.string().min(1, "This field is required"),
  description: zod.string().optional(),
  templateType: zod.string().min(1, "This field is required"),
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
  libraryId: zod.number().min(1, "Directory ID is required"),
  libraryStructure: directorySchema,
  attachment: zod
    .array(
      zod.object({
        fileName: zod.string(),
        fileUrl: zod.string(),
      })
    )
    .min(1, "This field is required"),
});

const basicInfoStepGridSchema = zod.object({
  baseTemplateType: zod.literal("grid"),
  templateName: zod.string().min(1, "This field is required"),
  description: zod.string().optional(),
  templateType: zod.string().min(1, "This field is required"),
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
  libraryId: zod.number().min(1, "This field is required"),
  libraryStructure: directorySchema,
});

export const basicInfoStepSchema = zod.discriminatedUnion("baseTemplateType", [
  basicInfoStepChecklistSchema,
  basicInfoStepFormSchema,
  basicInfoStepSpreadsheetSchema,
  basicInfoStepGridSchema,
]);
