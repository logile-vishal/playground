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
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";

import type { CreateTemplateFormType } from "../form-schema/create-template-form-schema";
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
  registerFormElement: UseFormRegister<CreateTemplateFormType>;
  setFocus?: UseFormSetFocus<CreateTemplateFormType>;
  subscribe?: UseFormSubscribe<CreateTemplateFormType>;
  formErrors?: FieldErrors<CreateTemplateFormType>;
  formState: FormState<CreateTemplateFormType>;
  control: Control<CreateTemplateFormType>;
  watch: UseFormWatch<CreateTemplateFormType>;
  isDirty: boolean;
  setDeletedQuestionId: (questionId: number) => void;
};
export type QuestionsListManager = {
  DEFAULT_QUESTION_TYPE: "radio";
};
export type CreateTemplateTabsType = keyof typeof CREATE_TEMPLATE_TABS;
