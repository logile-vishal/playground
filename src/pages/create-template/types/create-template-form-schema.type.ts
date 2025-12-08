import type { z as zod } from "zod";
import type {
  advancedOptionsSchema,
  basicDataSchema,
  followUpTaskSchema,
  notificationsSchema,
  questionsSchema,
} from "../services/create-template-form-schema";
import type { CREATE_TEMPLATE_TABS } from "../constants/constant";
import type {
  UseFormGetValues,
  UseFormGetFieldState,
  UseFormSetError,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormTrigger,
  FormState,
  UseFormResetField,
  UseFormReset,
  UseFormHandleSubmit,
  UseFormUnregister,
  Control,
  UseFormRegister,
  UseFormSetFocus,
  UseFormSubscribe,
} from "react-hook-form";

export type basicDataSchemaType = zod.infer<typeof basicDataSchema>;

export type questionsSchemaType = zod.infer<typeof questionsSchema>;

export type advancedOptionsSchemaType = zod.infer<typeof advancedOptionsSchema>;

export type notificationsSchemaType = zod.infer<typeof notificationsSchema>;

export type followUpTaskSchemaType = zod.infer<typeof followUpTaskSchema>;

export type CreateTemplateFormValuesType = {
  basicData: basicDataSchemaType;
  questions: questionsSchemaType[];
  advancedOptions: advancedOptionsSchemaType;
  notifications: notificationsSchemaType[];
  followUpTask: followUpTaskSchemaType;
};
export type CreateTemplateFormContextType = {
  getFormValues: UseFormGetValues<CreateTemplateFormValuesType>;
  getFieldState?: UseFormGetFieldState<CreateTemplateFormValuesType>;
  setError?: UseFormSetError<CreateTemplateFormValuesType>;
  clearErrors?: UseFormClearErrors<CreateTemplateFormValuesType>;
  setFormValue: UseFormSetValue<CreateTemplateFormValuesType>;
  triggerValidation: UseFormTrigger<CreateTemplateFormValuesType>;
  resetField?: UseFormResetField<CreateTemplateFormValuesType>;
  resetForm?: UseFormReset<CreateTemplateFormValuesType>;
  handleSubmitForm: UseFormHandleSubmit<CreateTemplateFormValuesType>;
  unregisterFormElement?: UseFormUnregister<CreateTemplateFormValuesType>;
  formControl: Control<CreateTemplateFormValuesType>;
  registerFormElement: UseFormRegister<CreateTemplateFormValuesType>;
  setFocus?: UseFormSetFocus<CreateTemplateFormValuesType>;
  subscribe?: UseFormSubscribe<CreateTemplateFormValuesType>;
  formErrors?: FormState<CreateTemplateFormValuesType>["errors"];
};
export type QuestionsListManager = {
  DEFAULT_QUESTION_TYPE: questionsSchemaType["type"];
};
export type CreateTemplateTabsType = keyof typeof CREATE_TEMPLATE_TABS;
