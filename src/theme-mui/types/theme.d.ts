import "@mui/material/styles";
import { THEME_MODES } from "@/core/constants/theme-mode";

type updateThemeModeArg = (typeof THEME_MODES)[keyof typeof THEME_MODES];

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      sidebarWidth: number;
      borderRadiusSm: string;
    };
  }

  interface ThemeOptions {
    custom?: {
      sidebarWidth?: number;
      borderRadiusSm?: string;
    };
  }

  interface ThemeContextType {
    updateThemeMode: (themeMode: updateThemeModeArg) => void;
    mode: ThemeMode;
  }
}
