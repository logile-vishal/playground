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

import type {
  QuestionStepType,
  CreateTemplateFormType,
} from "../services/create-template-form-schema";
import type { CREATE_TEMPLATE_TABS } from "../constants/constant";

export type CreateTemplateFormContextType = {
  getFormValues: UseFormGetValues<CreateTemplateFormType>;
  getFieldState?: UseFormGetFieldState<CreateTemplateFormType>;
  setError?: UseFormSetError<CreateTemplateFormType>;
  clearErrors?: UseFormClearErrors<CreateTemplateFormType>;
  setFormValue: UseFormSetValue<CreateTemplateFormType>;
  triggerValidation: UseFormTrigger<CreateTemplateFormType>;
  resetField?: UseFormResetField<CreateTemplateFormType>;
  resetForm?: UseFormReset<CreateTemplateFormType>;
  handleSubmitForm: UseFormHandleSubmit<CreateTemplateFormType>;
  unregisterFormElement?: UseFormUnregister<CreateTemplateFormType>;
  formControl: Control<CreateTemplateFormType>;
  registerFormElement: UseFormRegister<CreateTemplateFormType>;
  setFocus?: UseFormSetFocus<CreateTemplateFormType>;
  subscribe?: UseFormSubscribe<CreateTemplateFormType>;
  formErrors?: FormState<CreateTemplateFormType>["errors"];
};
export type QuestionsListManager = {
  DEFAULT_QUESTION_TYPE: QuestionStepType["type"];
};
export type CreateTemplateTabsType = keyof typeof CREATE_TEMPLATE_TABS;
