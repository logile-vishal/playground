import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateTemplateFormContext } from "../services/create-template-form.service";
import { createTemplateFormSchema } from "../form-schema/create-template-form-schema";
import type { CreateTemplateFormContextType } from "../types/create-template-form-schema.type";
import type { CreateTemplateFormType } from "../form-schema/create-template-form-schema";
import type { CreateTemplateFormProviderProps } from "../types/createTemplateFormProvider.type";

// TODO: Add default values according to different template types and remove static values
export const CreateTemplateFormProvider: React.FC<
  CreateTemplateFormProviderProps
> = ({ children }) => {
  const defaultFormValues: CreateTemplateFormType = {
    templateType: "checklist",
    basicData: {
      baseTemplateType: "checklist",
      templateName: "",
      description: "",
      templateType: "",
      tags: [],
      libraryId: 1,
      libraryStructure: {
        libraryId: 1,
      },
    },
    questions: [],
    advancedOptions: {},
    notifications: [
      {
        triggerType: "MESSAGE",
        condition: "TASK_COMPLETED",
        orgLevelId: 1,
        messageTemplates: {
          id: 1,
          subject: "Floors in %assignee_store% need to be clean",
          body: "Please ensure that the floors are cleaned by the end of the day.",
        },
        recipients: ["Assignee", "Ad Hoc"],
      },
      {
        triggerType: "MESSAGE",
        condition: "TASK_EXPIRED",
        orgLevelId: 2,
        messageTemplates: {
          id: 2,
          subject: "Low Compliance expired in %assignee_store%",
          body: "Please address the low compliance issues as soon as possible.",
        },
        recipients: ["Assignee"],
      },
    ],
    followUpTasks: [
      {
        triggerType: "TASK",
        condition: "TASK_COMPLETED",
        triggerTaskName: "Floors in %assignee_store% need to be clean",
        recipients: ["Assignee"],
        orgLevelId: 1,
        templateId: 2010,
        durationValue: 15,
        durationType: "MINUTE",
      },
      {
        triggerType: "TASK",
        condition: "TASK_EXPIRED",
        triggerTaskName: "Low Compliance expired in %assignee_store%",
        recipients: ["Assignee", "Supervisor"],
        orgLevelId: 2,
        templateId: 2002,
        durationValue: 2,
        durationType: "HOUR",
      },
    ],
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
  } = useForm<CreateTemplateFormType>({
    resolver: zodResolver(createTemplateFormSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

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
  };

  return (
    <CreateTemplateFormContext.Provider value={createTemplateFormProviderValue}>
      <form className="create-template-form">{children}</form>
    </CreateTemplateFormContext.Provider>
  );
};
