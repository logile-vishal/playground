import { createTheme } from "@mui/material/styles";

import type { ThemeMode } from "@/core/types/theme.type";

import typography from "./typography";
import { lightPalette, darkPalette } from "./palette";

export const getMuiThemeObject = (mode: ThemeMode) =>
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
    palette: mode === "light" ? lightPalette : darkPalette,
    typography,
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiPopper: {
        styleOverrides: {
          root: {
            zIndex: 2000,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {},
          root: {
            "&.MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--logile-border-bold-subtle)",
            },

            "&.Mui-focused.MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--logile-border-brand-primary-subtle)",
              top: "-5px",
            },

            "&.Mui-focused > input + .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--logile-border-brand-primary-subtle)",
              borderWidth: 1,
              top: "-5px",
            },

            "& > .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--logile-border-primary)",
              borderWidth: 1,
              top: "-5px",
              "&:hover": {
                borderColor: "var(--logile-border-brand-primary-subtle)",
              },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--logile-border-brand-primary-subtle)",
              top: "-5px",
              borderWidth: 1,
            },
            "&.MuiInputBase-root.MuiOutlinedInput-root.MuiSelect-root:hover .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "var(--logile-border-bold-subtle)",
              },
          },
        },
      },
    },
  });
