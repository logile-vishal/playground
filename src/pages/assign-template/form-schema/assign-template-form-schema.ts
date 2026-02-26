import { z as zod } from "zod";

export const assignTemplateFormSchema = zod.object({});

export type AssignTemplateFormType = zod.infer<typeof assignTemplateFormSchema>;
