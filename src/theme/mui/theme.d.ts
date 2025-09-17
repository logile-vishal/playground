
import  '@mui/material/styles';

declare module '@mui/material/styles' {
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
}
