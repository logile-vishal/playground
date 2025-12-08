import { useEffect, useState, useCallback } from "react";
import { useDirtyForm } from "@/core/services/dirty-form-check.service";
import { useBlocker } from "react-router-dom";
import CModal, { ModalBody } from "../components/modal/Modal";

/**
 * @component NavigationGuard
 *
 * A top-level React component that prevents accidental navigation away from a page
 * with unsaved changes. When the dirty-form state (from useDirtyForm) is true and
 * a navigation to a different pathname is attempted, this component uses the
 * router's blocker (useBlocker) to intercept the transition and show a confirmation modal.
 *
 * @returns {ReactElement} A modal UI that appears when navigation is blocked; render this component to enable the guard.
 *
 */
export function NavigationGuard() {
  const { isDirty } = useDirtyForm();
  const [open, setOpen] = useState(false);

  // Memoize the blocker condition
  const shouldBlock = useCallback(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
    [isDirty]
  );

  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state === "blocked") {
      setOpen(true);
    }
  }, [blocker.state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (blocker.state === "blocked") {
        blocker.reset?.();
      }
    };
  }, [blocker]);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    blocker.proceed?.();
  }, [blocker]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    blocker.reset?.();
  }, [blocker]);

  return (
    <CModal
      size="small"
      showActions={true}
      title="Unsaved changes"
      open={open}
      onClose={handleCancel}
      onConfirm={handleConfirm}
    >
      <ModalBody>
        You have some unsaved Changes. Are you sure you want to leave?
      </ModalBody>
    </CModal>
  );
}
