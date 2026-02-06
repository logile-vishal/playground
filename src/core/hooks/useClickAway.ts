import { useEffect, useRef } from "react";

type ClickAwayHandler = (event: MouseEvent | TouchEvent) => void;

type UseClickAwayOptions = {
  excludedClassNames?: string[];
  enabled?: boolean;
};

export const useClickAway = <T extends HTMLElement>(
  handler: ClickAwayHandler,
  options: UseClickAwayOptions = {}
) => {
  const ref = useRef<T>(null);
  const { excludedClassNames = [], enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleClickAway = (event: MouseEvent | TouchEvent): void => {
      const target = event.target as Element;

      if (!target) return;

      // Check if target has any excluded classnames
      const hasExcludedClass = excludedClassNames.some(
        (className) =>
          target.classList?.contains(className) ||
          target.closest(`.${className}`)
      );

      if (hasExcludedClass) {
        return;
      }

      // Check if the target is within a MUI Popover/Menu (which might be rendered in portal)
      const muiPopover = target.closest('[role="presentation"]');
      if (muiPopover && muiPopover.querySelector(".MuiPopover-paper")) {
        return;
      }

      // Special check for MUI Backdrop clicks (when Select menu closes)
      if (
        target.classList?.contains("MuiBackdrop-root") ||
        target.classList?.contains("MuiBackdrop-invisible") ||
        target.closest(".MuiBackdrop-root")
      ) {
        return;
      }

      // Check if the event is related to Select component interactions
      const isSelectRelated =
        target.closest(".MuiSelect-root") ||
        target.closest(".MuiFormControl-root") ||
        target.matches(".MuiSelect-select") ||
        target.matches(".MuiInputBase-input");

      if (isSelectRelated) {
        return;
      }

      // Check if click is outside the ref element
      if (ref.current && !ref.current.contains(target as Node)) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("touchstart", handleClickAway);

    return () => {
      document.removeEventListener("mousedown", handleClickAway);
      document.removeEventListener("touchstart", handleClickAway);
    };
  }, [handler, excludedClassNames, enabled]);

  return ref;
};
