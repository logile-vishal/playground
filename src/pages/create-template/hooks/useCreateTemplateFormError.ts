import {
  useFormState,
  get,
  type FieldValues,
  type Control,
} from "react-hook-form";

import useCreateTemplateForm from "./useCreateTemplateForm";

/**
 * @param fieldPath - The form field path (e.g., "questions.0.subQuestions.1.questionBasicData.title")
 * @returns Object containing hasError boolean and the error object
 *
 * @example
 * // In a nested QuestionCard component
 * const { hasError, error } = useFormFieldError(questionFormPath);
 *
 * // Check specific nested field
 * const { hasError: hasTitleError } = useFormFieldError(`${questionFormPath}.questionBasicData.title`);
 */
export const useFormFieldError = (fieldPath: string) => {
  const { control } = useCreateTemplateForm();

  const { errors } = useFormState({
    control: control as unknown as Control<FieldValues>,
    name: fieldPath as never,
  });

  if (!fieldPath || !errors) {
    return { hasError: false, error: undefined };
  }

  const error = get(errors, fieldPath);

  return {
    hasError: Boolean(error),
    error,
  };
};

/**
 * Custom hook to check if any field within a path has errors.
 * Useful for checking if a section or question group has any errors.
 *
 * @param basePath - The base form field path (e.g., "questions.0")
 * @returns boolean indicating if any nested field has errors
 *
 * @example
 * // Check if any field in a question has errors
 * const hasAnyError = useFormFieldHasAnyError(questionFormPath);
 */
export const useFormFieldHasAnyError = (basePath: string): boolean => {
  const { control } = useCreateTemplateForm();

  // useFormState subscribes to form state changes and triggers re-renders
  const { errors } = useFormState({
    control: control as unknown as Control<FieldValues>,
    name: basePath as never, // Subscribe to specific field for optimized re-renders
  });

  if (!basePath || !errors) {
    return false;
  }

  const errorObj = get(errors, basePath);
  return Boolean(errorObj);
};
