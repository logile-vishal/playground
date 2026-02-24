import { useEffect, useState, useCallback } from "react";
import { useBlocker } from "react-router-dom";
import { useDirtyForm } from "@/core/services/dirty-form-check.service";
import CModal, { ModalBody } from "../components/modal/Modal";
import { useCommonTranslation } from "../translation/useCommonTranslation";
import { BUTTON_SEVERITY } from "../constants/button-constant";

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
  const { NAVIGATION_GUARD } = useCommonTranslation();

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
      size="medium"
      showActions={true}
      title={NAVIGATION_GUARD.modalTitle}
      open={open}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      confirmText={NAVIGATION_GUARD.confirmButtonLabel}
      severity={BUTTON_SEVERITY.destructive}
    >
      <ModalBody>{NAVIGATION_GUARD.modalMessage}</ModalBody>
    </CModal>
  );
}
