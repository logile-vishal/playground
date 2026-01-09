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
      label: "Change Role",
      value: "change-role",
      leftIcon: User,
    },
    {
      label: "Set Focus",
      value: "set-focus",
      leftIcon: Focus,
    },
    {
      label: "User Profile",
      value: "user-profile",
      leftIcon: Users,
    },
    {
      label: "Modify Dashboard",
      value: "modify-dashboard",
      leftIcon: Edit,
    },
    {
      label: "Reduce Role",
      value: "reduce-role",
      leftIcon: UserMinus,
    },
    {
      label: "User Management",
      value: "user-management",
      leftIcon: UserSetting,
    },
    {
      label: "Admin Mode",
      value: "admin-mode",
      leftIcon: UserStar,
      customSubMenu: <AdminModeCustomMenu />,
    },
    {
      label: "Theme",
      value: "theme",
      leftIcon: Theme,
      parentAsItem: false,
      subMenu: {
        items: [
          {
            label: "Dark",
            value: THEME_MODES.DARK,
          },
          {
            label: "Light",
            value: THEME_MODES.LIGHT,
          },
          {
            label: "System Default",
            value: THEME_MODES.SYSTEM,
          },
        ],
        onClick: (_event, theme) => {
          updateThemeMode(theme.value);
        },
      },
    },
    {
      label: "Language",
      value: "language",
      leftIcon: Globe,
      parentAsItem: false,
      subMenu: {
        items: [
          {
            label: "English",
            value: "en",
          },
          {
            label: "Español",
            value: "es",
          },
          {
            label: "中文",
            value: "zh",
          },
          {
            label: "हिन्दी",
            value: "hi",
          },
        ],
        onClick: (_event, lang) => {
          i18n.changeLanguage(lang.value);
        },
      },
    },
    {
      label: "Logout",
      value: "logout",
      leftIcon: Signout,
      leftIconStyleProps: { color: "violation" },
      labelStyleProps: { color: "var(--logile-text-state-violation)" },
    },
  ];
};

export const adminModeList = [
  {
    label: "All Settings",
    value: "all-settings",
  },
  {
    label: "Permissions",
    value: "permissions",
  },
  {
    label: "Internationalization",
    value: "internationalization",
  },
];
