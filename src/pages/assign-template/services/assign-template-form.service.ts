import { createContext, useContext } from "react";

import type { AssignTemplateFormContextType } from "../types/assign-template-form-schema.type";

export const AssignTemplateFormContext =
  createContext<AssignTemplateFormContextType | null>(null);

export const useAssignTemplateForm = () =>
  useContext(AssignTemplateFormContext);
