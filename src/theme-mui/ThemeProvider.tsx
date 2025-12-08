// theme/ThemeProvider.tsx
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { getTheme } from "./theme";
import type { ThemeMode } from "@/core/types/theme.type";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const isDarkPrefered = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<ThemeMode>(
    isDarkPrefered ? "dark" : "light"
  );

  useEffect(() => {
    if (isDarkPrefered) {
      setMode("dark");
    }
  }, [isDarkPrefered]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light")),
      mode,
    }),
    [mode]
  );

  /**
   * @param themeMode = theme mode name e.g. dark,light etc..
   *
   * This method sets the data-theme attribute at the HTML Tag level
   */
  const updateHtmlTheme = (themeMode: ThemeMode) => {
    const htmlEle = document.querySelector("html");
    htmlEle.setAttribute("data-theme", themeMode);
  };

  useEffect(() => updateHtmlTheme(mode), [mode]);
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        {/* <CssBaseline /> */}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
