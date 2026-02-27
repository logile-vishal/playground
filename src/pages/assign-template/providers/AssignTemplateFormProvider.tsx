import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  assignTemplateFormSchema,
  type AssignTemplateFormType,
} from "../form-schema/assign-template-form-schema";
import { AssignTemplateFormContext } from "../services/assign-template-form.service";
import type { AssignTemplateFormContextType } from "../types/assign-template-form-schema.type";
import type { AssignTemplateFormProviderProps } from "../types/assignTemplateFormProvider.type";

export const AssignTemplateFormProvider: React.FC<
  AssignTemplateFormProviderProps
> = ({ children }) => {
  const defaultFormValues: AssignTemplateFormType = {
    basicData: {},
    recipients: [],
    schedule: {},
    notifications: [],
    settings: {},
    attachments: [],
  };

  const {
    register,
    handleSubmit,
    control,
    formState,
    setValue,
    getValues,
    trigger,
    reset,
    watch,
    clearErrors,
    formState: { isDirty },
  } = useForm<AssignTemplateFormType>({
    resolver: zodResolver(assignTemplateFormSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  const assignTemplateFormProviderValue: AssignTemplateFormContextType = {
    registerFormElement: register,
    handleSubmitForm: handleSubmit,
    formErrors: formState.errors,
    formState,
    setFormValue: setValue,
    getFormValues: getValues,
    triggerValidation: trigger,
    control,
    resetForm: reset,
    watch,
    clearErrors,
    isDirty,
  };

  return (
    <AssignTemplateFormContext.Provider value={assignTemplateFormProviderValue}>
      <form className="create-template-form">{children}</form>
    </AssignTemplateFormContext.Provider>
  );
};
