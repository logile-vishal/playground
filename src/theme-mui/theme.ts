// theme/theme.ts

import { createTheme } from "@mui/material/styles";
import typography from "./typography";
import { lightPalette, darkPalette } from "./palette";

export const getTheme = (mode: "light" | "dark") =>
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
          notchedOutline: {

          },
          root: {
            "&.Mui-focused.MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--logile-border-brand-primary-subtle)",
              top: '-5px',
            },

            "&.Mui-focused > input + .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--logile-border-brand-primary-subtle)",
              borderWidth: 1,
              top: '-5px',
            },

            "& > .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--logile-border-secondary)",
              borderWidth: 1,
              top: '-5px',
              '&:hover': {
                borderColor: "var(--logile-border-brand-primary-subtle)",
              }
            }
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--logile-border-brand-primary-subtle)",
              top: '-5px',
              borderWidth: 1,
            },
            "&.MuiInputBase-root.MuiOutlinedInput-root.MuiSelect-root:hover .MuiOutlinedInput-notchedOutline": {
              borderWidth: 1,
              top: '-5px',
              borderColor: "var(--logile-border-brand-primary-subtle)",
            },
            "&.MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--logile-border-brand-primary-subtle)",
            }


          },
        },
      },
    },
  });
