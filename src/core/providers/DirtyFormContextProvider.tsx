import { useState, useCallback, useMemo } from "react";

import { DirtyFormContext } from "@/core/services/dirty-form-check.service";

/**
 * Provides dirty-form tracking to descendant components via DirtyFormContext.
 *
 * This provider manages an array of dirty form identifiers and computes `isDirty`
 * based on whether any forms are currently marked as dirty. It exposes helper
 * functions to add/remove forms from the dirty list.
 *
 * @param props.children - The React nodes that will have access to the DirtyFormContext.
 *
 * @returns A React element that renders `children` wrapped by DirtyFormContext.Provider.
 */
export const DirtyFormProvider = ({ children }) => {
  const [dirtyForms, setDirtyForms] = useState<Set<string>>(new Set());

  const addDirtyForm = useCallback((formName: string) => {
    setDirtyForms((prev) => {
      if (prev.has(formName)) return prev;
      const next = new Set(prev);
      next.add(formName);
      return next;
    });
  }, []);

  const removeDirtyForm = useCallback((formName: string) => {
    setDirtyForms((prev) => {
      if (!prev.has(formName)) return prev;
      const next = new Set(prev);
      next.delete(formName);
      return next;
    });
  }, []);

  const isDirty = dirtyForms.size > 0;

  const value = useMemo(
    () => ({
      isDirty,
      dirtyForms: Array.from(dirtyForms),
      addDirtyForm,
      removeDirtyForm,
    }),
    [isDirty, dirtyForms, addDirtyForm, removeDirtyForm]
  );

  return (
    <DirtyFormContext.Provider value={value}>
      {children}
    </DirtyFormContext.Provider>
  );
};
