import { useContext } from "react";

import { CreateTemplateFormContext } from "../services/create-template-form.service";

const useCreateTemplateForm = () => {
  const context = useContext(CreateTemplateFormContext);
  return context;
};

export default useCreateTemplateForm;
