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

import type { ASSIGN_TEMPLATE_TABS } from "../constants/constants";
import type { AssignTemplateFormType } from "../form-schema/assign-template-form-schema";

export type AssignTemplateFormContextType = {
  getFormValues: UseFormGetValues<AssignTemplateFormType>;
  getFieldState?: UseFormGetFieldState<AssignTemplateFormType>;
  setError?: UseFormSetError<AssignTemplateFormType>;
  clearErrors?: UseFormClearErrors<AssignTemplateFormType>;
  setFormValue: UseFormSetValue<AssignTemplateFormType>;
  triggerValidation: UseFormTrigger<AssignTemplateFormType>;
  resetField?: UseFormResetField<AssignTemplateFormType>;
  resetForm?: UseFormReset<AssignTemplateFormType>;
  handleSubmitForm: UseFormHandleSubmit<AssignTemplateFormType>;
  unregisterFormElement?: UseFormUnregister<AssignTemplateFormType>;
  registerFormElement: UseFormRegister<AssignTemplateFormType>;
  setFocus?: UseFormSetFocus<AssignTemplateFormType>;
  subscribe?: UseFormSubscribe<AssignTemplateFormType>;
  formErrors?: FieldErrors<AssignTemplateFormType>;
  formState: FormState<AssignTemplateFormType>;
  control: Control<AssignTemplateFormType>;
  watch: UseFormWatch<AssignTemplateFormType>;
  isDirty: boolean;
};

export type AssignTemplateTabsType = keyof typeof ASSIGN_TEMPLATE_TABS;
