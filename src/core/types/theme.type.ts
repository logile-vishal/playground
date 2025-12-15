import { THEME_MODES } from "@/core/constants/theme-mode";

export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];
