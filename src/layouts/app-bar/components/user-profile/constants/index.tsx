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
import { useLayoutTranslations } from "@/layouts/translation/useLayoutTranslations";
import { ThemeContext } from "@/theme-mui/ThemeContext";
import i18n from "@/i18n";

import AdminModeCustomMenu from "../components/AdminMenuCustomCard";

export const useAdminMenuItemsList = (): NestedMenuItem[] => {
  const { updateThemeMode } = useContext(ThemeContext);
  const { USER_PROFILE_MENU_OPTIONS } = useLayoutTranslations();

  return [
    {
      label: USER_PROFILE_MENU_OPTIONS.changeRole,
      value: "change-role",
      leftIcon: User,
    },
    {
      label: USER_PROFILE_MENU_OPTIONS.setFocus,
      value: "set-focus",
      leftIcon: Focus,
    },
    {
      label: USER_PROFILE_MENU_OPTIONS.userProfile,
      value: "user-profile",
      leftIcon: Users,
    },
    {
      label: USER_PROFILE_MENU_OPTIONS.modifyDashboard,
      value: "modify-dashboard",
      leftIcon: Edit,
    },
    {
      label: USER_PROFILE_MENU_OPTIONS.reduceRole,
      value: "reduce-role",
      leftIcon: UserMinus,
    },
    {
      label: USER_PROFILE_MENU_OPTIONS.userManagement,
      value: "user-management",
      leftIcon: UserSetting,
    },
    {
      label: USER_PROFILE_MENU_OPTIONS.adminMode,
      value: "admin-mode",
      leftIcon: UserStar,
      customSubMenu: <AdminModeCustomMenu />,
    },
    {
      label: USER_PROFILE_MENU_OPTIONS.theme,
      value: "theme",
      leftIcon: Theme,
      parentAsItem: false,
      subMenu: {
        items: [
          {
            label: USER_PROFILE_MENU_OPTIONS.themeDark,
            value: THEME_MODES.DARK,
          },
          {
            label: USER_PROFILE_MENU_OPTIONS.themeLight,
            value: THEME_MODES.LIGHT,
          },
          {
            label: USER_PROFILE_MENU_OPTIONS.themeSystemDefault,
            value: THEME_MODES.SYSTEM,
          },
        ],
        onClick: (_event, theme) => {
          updateThemeMode(theme.value);
        },
      },
    },
    {
      label: USER_PROFILE_MENU_OPTIONS.language,
      value: "language",
      leftIcon: Globe,
      parentAsItem: false,
      subMenu: {
        items: [
          {
            label: USER_PROFILE_MENU_OPTIONS.languageEnglish,
            value: "en",
          },
          {
            label: USER_PROFILE_MENU_OPTIONS.languageSpanish,
            value: "es",
          },
          {
            label: USER_PROFILE_MENU_OPTIONS.languageChinese,
            value: "zh",
          },
          {
            label: USER_PROFILE_MENU_OPTIONS.languageHindi,
            value: "hi",
          },
        ],
        onClick: (_event, lang) => {
          i18n.changeLanguage(lang.value);
        },
      },
    },
    {
      label: USER_PROFILE_MENU_OPTIONS.logout,
      value: "logout",
      leftIcon: Signout,
      leftIconStyleProps: { color: "violation" },
      labelStyleProps: { color: "var(--logile-text-state-violation)" },
    },
  ];
};

/**
 * @hook useAdminModeList
 * @description Custom hook that returns the admin mode list with translated labels
 * @return {Array} Array of admin mode items with names and values
 */
export const useAdminModeList = () => {
  const { USER_PROFILE_MENU_OPTIONS } = useLayoutTranslations();
  return [
    {
      label: USER_PROFILE_MENU_OPTIONS.adminModeAllSettings,
      value: "all-settings",
    },
    {
      label: USER_PROFILE_MENU_OPTIONS.adminModePermissions,
      value: "permissions",
    },
    {
      label: USER_PROFILE_MENU_OPTIONS.adminModeInternationalization,
      value: "internationalization",
    },
  ];
};
