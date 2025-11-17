import { useEffect } from "react";
import { useDirtyForm } from "@/core/services/dirty-form-check.service";

/**
 * Synchronizes a local "dirty" flag with the shared dirty-form service.
 *
 * @remarks
 * - Invokes the shared service's `setIsDirty` with the provided `isDirty` value whenever that value changes.
 * - On unmount (cleanup), it resets the shared dirty state to `false`.
 * - Must be used inside a React function component and follow React Hooks rules (call unconditionally).
 *
 * @param isDirty - True when the current form/component has unsaved changes; false otherwise.
 *
 */
export function useDirtyFormGuard(isDirty: boolean) {
  const { setIsDirty } = useDirtyForm();

  useEffect(() => {
    setIsDirty(isDirty);
    return () => setIsDirty(false); // cleanup on unmount
  }, [isDirty, setIsDirty]);
}