import { createContext, useContext } from "react";

import type { CreateTemplateFormContextType } from "../types/create-template-form-schema.type";

export const CreateTemplateFormContext =
  createContext<CreateTemplateFormContextType | null>(null);

export const useCreateTemplateForm = () =>
  useContext(CreateTemplateFormContext);
