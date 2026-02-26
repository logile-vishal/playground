import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";

import { CreateTemplateFormContext } from "../services/create-template-form.service";
import { useCreateTemplateFormSchema } from "../form-schema/create-template-form-schema";
import type { CreateTemplateFormType } from "../form-schema/create-template-form-schema";
import type { CreateTemplateFormProviderProps } from "../types/createTemplateFormProvider.type";
import type { CreateTemplateFormContextType } from "../types/create-template-form-schema.type";

// TODO: Add default values according to different template types and remove static values
export const CreateTemplateFormProvider: React.FC<
  CreateTemplateFormProviderProps
> = ({ children }) => {
  const createTemplateFormSchema = useCreateTemplateFormSchema();
  const defaultFormValues = useMemo<CreateTemplateFormType>(
    () => ({
      templateType: "checklist",
      basicData: {
        baseTemplateType: "checklist",
        templateName: "",
        description: "",
        templateType: "",
        tags: [],
        libraryId: 0,
        libraryStructure: null,
      },
      questions: [],
      advancedOptions: {},
      notifications: [],
      followUpTasks: [],
    }),
    []
  );

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
  } = useForm<CreateTemplateFormType>({
    resolver: zodResolver(createTemplateFormSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  useEffect(() => {
    // Reset once on mount to initialize form defaults.
    // Running this when schema or reset changes was causing an infinite loop.
    reset(defaultFormValues, {
      keepValues: true,
      keepErrors: true,
      keepDirty: true,
      keepTouched: true,
      keepIsSubmitted: true,
      keepSubmitCount: true,
      keepDefaultValues: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTemplateFormProviderValue: CreateTemplateFormContextType = {
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
    <CreateTemplateFormContext.Provider value={createTemplateFormProviderValue}>
      <form className="create-template-form">{children}</form>
    </CreateTemplateFormContext.Provider>
  );
};
