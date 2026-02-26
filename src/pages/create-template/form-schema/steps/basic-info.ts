import { z as zod } from "zod";
import { useMemo } from "react";
import { useCreateTemplateTranslations } from "../../translation/useCreateTemplateTranslations";

export const useBasicInfoStepSchema = () => {
  const { VALIDATION } = useCreateTemplateTranslations();
  return useMemo(() => {
    const directorySchema = zod
      .object({
        libraryId: zod.number().optional(),
        subLibrary: zod.lazy(() => directorySchema).optional(),
      })
      .optional();

    const basicInfoStepChecklistSchema = zod.object({
      baseTemplateType: zod.literal("checklist"),
      templateName: zod.string().min(1, VALIDATION.BASIC_INFO.fieldRequired),
      description: zod.string().optional(),
      templateType: zod.string().min(1, VALIDATION.BASIC_INFO.fieldRequired),
      tags: zod
        .array(
          zod.object({
            tagId: zod.number(),
            tagName: zod.string(),
            attributeId: zod.number().optional().nullable(),
            attributeName: zod.string().optional().nullable(),
          })
        )
        .optional(),
      libraryId: zod.number().min(1, VALIDATION.BASIC_INFO.directoryRequired),
      libraryStructure: directorySchema,
    });

    const basicInfoStepFormSchema = zod.object({
      baseTemplateType: zod.literal("form"),
      templateName: zod.string().min(1, VALIDATION.BASIC_INFO.fieldRequired),
      description: zod.string().optional(),
      templateType: zod.string().min(1, VALIDATION.BASIC_INFO.fieldRequired),
      tags: zod
        .array(
          zod.object({
            tagId: zod.number(),
            tagName: zod.string(),
            attributeId: zod.number().optional().nullable(),
            attributeName: zod.string().optional().nullable(),
          })
        )
        .optional(),
      libraryId: zod.number().min(1, VALIDATION.BASIC_INFO.directoryRequired),
      libraryStructure: directorySchema,
      attachment: zod
        .array(
          zod.object({
            fileName: zod.string(),
            fileUrl: zod.string(),
          })
        )
        .min(1, VALIDATION.BASIC_INFO.fieldRequired),
    });

    const basicInfoStepSpreadsheetSchema = zod.object({
      baseTemplateType: zod.literal("spreadsheet"),
      templateName: zod.string().min(1, VALIDATION.BASIC_INFO.fieldRequired),
      description: zod.string().optional(),
      templateType: zod.string().min(1, VALIDATION.BASIC_INFO.fieldRequired),
      tags: zod
        .array(
          zod.object({
            tagId: zod.number(),
            tagName: zod.string(),
            attributeId: zod.number().optional().nullable(),
            attributeName: zod.string().optional().nullable(),
          })
        )
        .optional(),
      libraryId: zod.number().min(1, VALIDATION.BASIC_INFO.directoryRequired),
      libraryStructure: directorySchema,
      attachment: zod
        .array(
          zod.object({
            fileName: zod.string(),
            fileUrl: zod.string(),
          })
        )
        .min(1, VALIDATION.BASIC_INFO.fieldRequired),
    });

    const basicInfoStepGridSchema = zod.object({
      baseTemplateType: zod.literal("grid"),
      templateName: zod.string().min(1, VALIDATION.BASIC_INFO.fieldRequired),
      description: zod.string().optional(),
      templateType: zod.string().min(1, VALIDATION.BASIC_INFO.fieldRequired),
      tags: zod
        .array(
          zod.object({
            tagId: zod.number(),
            tagName: zod.string(),
            attributeId: zod.number().optional().nullable(),
            attributeName: zod.string().optional().nullable(),
          })
        )
        .optional(),
      libraryId: zod.number().min(1, VALIDATION.BASIC_INFO.directoryRequired),
      libraryStructure: directorySchema,
    });

    return zod.discriminatedUnion("baseTemplateType", [
      basicInfoStepChecklistSchema,
      basicInfoStepFormSchema,
      basicInfoStepSpreadsheetSchema,
      basicInfoStepGridSchema,
    ]);
  }, [VALIDATION]);
};
