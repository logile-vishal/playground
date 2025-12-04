import type {
  ButtonVariant,
  ButtonSize,
  ButtonSeverity,
} from "@/core/types/button.type";

import { buttonPalette } from "./button.palette";
import { buttonSizes } from "./button.sizes";

export const buttonConfig = (
  severity: ButtonSeverity,
  variant: ButtonVariant,
  size: ButtonSize,
) => {
  const palette = buttonPalette[severity]?.[variant];
  if (!palette) return {};

  return {
    height: buttonSizes[size],
    padding: "0 var(--space-xl)",
    "&:hover": { ...palette.hover },
    "&:active": { ...palette.pressed },
    "&:focus": { ...palette.focus },
    "&.Mui-disabled": { ...palette.disabled },
  };
};
