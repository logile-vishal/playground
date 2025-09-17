// theme/theme.ts

import { createTheme } from '@mui/material/styles';
import typography from './typography';
import { lightPalette, darkPalette } from './palette';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 1200, 
        md: 1440, 
        lg: 1440,
        xl: 2560, 
      },
    },
    palette: mode === 'light' ? lightPalette : darkPalette,
    typography,
    shape: {
      borderRadius: 8
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
           
          },
    
        },
      },
    },
  });
