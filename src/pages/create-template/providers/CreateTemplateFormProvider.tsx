import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateTemplateFormContext } from "../services/create-template-form.service";
import { createTemplateFormSchema } from "../services/create-template-form-schema";
import type {
  CreateTemplateFormValuesType,
  CreateTemplateFormContextType,
} from "../types/create-template-form-schema.type";

/**
 *@description CreateTemplateFormProvider is a provider component that provides the form context to its children.
 *@param children - The children of the provider.
 */

interface CreateTemplateFormProviderProps {
  children: React.ReactNode;
}

const CreateTemplateFormProvider = ({
  children,
}: CreateTemplateFormProviderProps) => {
  const defaultFormValues: CreateTemplateFormValuesType = {
    basicData: {},
    questions: [],
    advancedOptions: {},
    notifications: [],
    followUpTask: [],
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<CreateTemplateFormValuesType>({
    resolver: zodResolver(createTemplateFormSchema),
    defaultValues: defaultFormValues,
  });

  const createTemplateFormProviderValue: CreateTemplateFormContextType = {
    registerFormElement: register,
    handleSubmitForm: handleSubmit,
    formControl: control,
    formErrors: errors,
    setFormValue: setValue,
    getFormValues: getValues,
    triggerValidation: trigger,
  };

  return (
    <CreateTemplateFormContext.Provider value={createTemplateFormProviderValue}>
      <form className="create-template-form">{children}</form>
    </CreateTemplateFormContext.Provider>
  );
};
export default CreateTemplateFormProvider;
