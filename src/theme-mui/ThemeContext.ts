import { type ThemeContextType } from "@mui/material";
import { createContext } from "react";

export const ThemeContext = createContext<ThemeContextType>({
  toggleColorMode: () => {},
  mode: "light",
});
