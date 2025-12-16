import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from "@mui/material";

import type { ThemeMode } from "@/core/types/theme.type";
import { THEME_MODES } from "@/core/constants/theme-mode";

import { getMuiThemeObject } from "./theme";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const isDarkPrefered = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = useState<ThemeMode>(
    isDarkPrefered ? THEME_MODES.DARK : THEME_MODES.LIGHT
  );

  /**
   * @method updateThemeMode
   * @param {ThemeMode} themeMode - The selected theme option.
   * @description Updates the application theme mode based on the provided option.
   * - When the user selects the system-preferred option, the theme mode is automatically matched to the system's light or dark setting.
   * - When the user selects dark or light explicitly, the theme mode is set directly to the chosen value.
   */
  const updateThemeMode = useCallback(
    (themeMode: ThemeMode) => {
      if (themeMode === THEME_MODES.SYSTEM) {
        setMode(isDarkPrefered ? THEME_MODES.DARK : THEME_MODES.LIGHT);
      } else {
        setMode(themeMode);
      }
    },
    [isDarkPrefered] // deps
  );

  useEffect(() => {
    //TODO: replace this with a controlled method to update theme when app is able to fetch saved data of user from database
    if (isDarkPrefered) {
      setMode(THEME_MODES.DARK);
    }
  }, [isDarkPrefered]);

  /**
   * @method updateHtmlThemeAttr
   * @param themeMode
   * @description Updates the data-theme attribute with current theme mode value for html element to implement the theme
   */
  const updateHtmlThemeAttr = useCallback((themeMode: ThemeMode) => {
    const htmlEle = document.documentElement;
    htmlEle.setAttribute("data-theme", themeMode);
  }, []);

  useEffect(() => {
    updateHtmlThemeAttr(mode);
  }, [mode, updateHtmlThemeAttr]);

  const theme = useMemo(() => getMuiThemeObject(), []);

  const themeProviderValue = useMemo(
    () => ({
      updateThemeMode,
      mode,
    }),
    [updateThemeMode, mode]
  );

  return (
    <ThemeContext.Provider value={themeProviderValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
