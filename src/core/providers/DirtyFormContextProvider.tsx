import { useState } from "react";

import { DirtyFormContext } from "@/core/services/dirty-form-check.service";

/**
 * Provides dirty-form tracking to descendant components via DirtyFormContext.
 *
 * This provider manages an internal boolean state `isDirty` and exposes it along with
 * its state updater (`setIsDirty`) through the context. It is intended to wrap parts
 * of the application that contain forms or other editable content so that consumers
 * can read whether any tracked form has unsaved changes and mark the form as dirty.
 *
 * @param props.children - The React nodes that will have access to the DirtyFormContext.
 *
 * @returns A React element that renders `children` wrapped by DirtyFormContext.Provider.
 */
export const DirtyFormProvider = ({ children }) => {
  const [isDirty, setIsDirty] = useState(false);

  return (
    <DirtyFormContext.Provider value={{ isDirty, setIsDirty }}>
      {children}
    </DirtyFormContext.Provider>
  );
};
