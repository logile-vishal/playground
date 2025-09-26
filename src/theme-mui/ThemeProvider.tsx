// theme/ThemeProvider.tsx
import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, type ThemeContextType } from '@mui/material';
import { getTheme } from './theme';
import type { ThemeMode } from '@/core/types/theme.type';

export const ThemeContext = createContext<ThemeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light')),
      mode,
    }),
    [mode]
  );

  /**
   * @param themeMode = theme mode name e.g. dark,light etc..
   * 
   * This method sets the data-theme attribute at the HTML Tag level
   */
  const updateHtmlTheme = (themeMode:ThemeMode)=>{
   const htmlEle = document.querySelector('html');
   htmlEle.setAttribute('data-theme',themeMode)
  }

  useEffect(()=> updateHtmlTheme(mode),[mode])
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
