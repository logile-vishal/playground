import { useContext } from "react";

import {
  Edit,
  Focus,
  Globe,
  Theme,
  User,
  UserMinus,
  Users,
  UserSetting,
  UserStar,
  Signout,
} from "@/core/constants/icons";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import { THEME_MODES } from "@/core/constants/theme-mode";
import { ThemeContext } from "@/theme-mui/ThemeContext";
import i18n from "@/i18n";

import AdminModeCustomMenu from "../components/AdminMenuCustomCard";

export const useAdminMenuItemsList = (): NestedMenuItem[] => {
  const { updateThemeMode } = useContext(ThemeContext);

  return [
    {
      name: "Change Role",
      value: "change-role",
      leftIcon: User,
    },
    {
      name: "Set Focus",
      value: "set-focus",
      leftIcon: Focus,
    },
    {
      name: "User Profile",
      value: "user-profile",
      leftIcon: Users,
    },
    {
      name: "Modify Dashboard",
      value: "modify-dashboard",
      leftIcon: Edit,
    },
    {
      name: "Reduce Role",
      value: "reduce-role",
      leftIcon: UserMinus,
    },
    {
      name: "User Management",
      value: "user-management",
      leftIcon: UserSetting,
    },
    {
      name: "Admin Mode",
      value: "admin-mode",
      leftIcon: UserStar,
      customSubMenu: <AdminModeCustomMenu />,
    },
    {
      name: "Theme",
      value: "theme",
      leftIcon: Theme,
      parentAsItem: false,
      subMenu: {
        items: [
          {
            name: "Dark",
            value: THEME_MODES.DARK,
          },
          {
            name: "Light",
            value: THEME_MODES.LIGHT,
          },
          {
            name: "System Default",
            value: THEME_MODES.SYSTEM,
          },
        ],
        onClick: (_event, theme) => {
          updateThemeMode(theme.value);
        },
      },
    },
    {
      name: "Language",
      value: "language",
      leftIcon: Globe,
      parentAsItem: false,
      subMenu: {
        items: [
          {
            name: "English",
            value: "en",
          },
          {
            name: "Spanish",
            value: "es",
          },
          {
            name: "Chinese",
            value: "zh",
          },
          {
            name: "Hindi",
            value: "hi",
          },
        ],
        onClick: (_event, lang) => {
          i18n.changeLanguage(lang.value);
        },
      },
    },
    {
      name: "Logout",
      value: "logout",
      leftIcon: Signout,
      leftIconStyleProps: { color: "violation" },
      labelStyleProps: { color: "var(--logile-text-state-violation)" },
    },
  ];
};

export const adminModeList = [
  {
    name: "All Settings",
    value: "all-settings",
  },
  {
    name: "Permissions",
    value: "permissions",
  },
  {
    name: "Internationalization",
    value: "internationalization",
  },
];
