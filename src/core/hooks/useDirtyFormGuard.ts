import { useEffect } from "react";
import { useDirtyForm } from "@/core/services/dirty-form-check.service";

/**
 * Synchronizes a local "dirty" flag with the shared dirty-form service.
 *
 * @remarks
 * - Adds the form to the dirty forms set when `isDirty` is true, removes it when false.
 * - On unmount (cleanup), it removes the form from the dirty set.
 * - Must be used inside a React function component and follow React Hooks rules (call unconditionally).
 *
 * @param formName - A unique identifier for the form being tracked.
 * @param isDirty - True when the current form/component has unsaved changes; false otherwise.
 *
 */
export function useDirtyFormGuard(formName: string, isDirty: boolean) {
  const { addDirtyForm, removeDirtyForm } = useDirtyForm();

  useEffect(() => {
    if (isDirty) {
      addDirtyForm(formName);
    } else {
      removeDirtyForm(formName);
    }
  }, [formName, isDirty, addDirtyForm, removeDirtyForm]);

  // Cleanup on unmount
  useEffect(() => {
    return () => removeDirtyForm(formName);
  }, [formName, removeDirtyForm]);
}
