import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { ViewportSize } from "@/core/types/viewport.type";

export const useGetViewPortSize = (): ViewportSize => {
  const theme = useTheme();

  const isXl = useMediaQuery(theme.breakpoints.only("xl"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));

  if (isXl) return "xl";
  if (isLg) return "lg";
  if (isMd) return "md";
  if (isSm) return "sm";
  if (isXs) return "xs";

  return "md";
};

/**
 * @hook useIsDesktopViewport
 * Returns true for 1366px+ (desktop layout: permanent narrow sidebar, full page template).
 * Uses a direct media query instead of MUI breakpoints because the MUI "sm" range
 * (1200–1440px) spans both the tablet (1200–1366px) and desktop (1366px+) zones.
 */
export const useIsDesktopViewport = () => {
  return useMediaQuery("(min-width: 1366px)");
};
