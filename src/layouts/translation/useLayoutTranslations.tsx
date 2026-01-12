import { useTranslation } from "react-i18next";

import { type SvgIconComponent } from "@/core/components/icon/Icon";
import {
  Calendar,
  Communication,
  FoodSafety,
  Forecast,
  Home,
  LabourModel,
  LabourReport,
  QueueManagement,
  QuickLink,
  Staffing,
  Standards,
} from "@/core/constants/icons";

export const useLayoutTranslations = () => {
  const { t } = useTranslation("layout");

  const APP_BAR = {
    searchPlaceholder: t("APP_BAR.searchPlaceholder"),
  };

  const IMS_NAV_LINKS: {
    text: string;
    path: string;
    icon: SvgIconComponent;
  }[] = [
    { text: t("SIDEBAR.IMS_NAV_LINKS.home"), path: "/", icon: Home },
    {
      text: t("SIDEBAR.IMS_NAV_LINKS.quickLinks"),
      path: "/quickLinks",
      icon: QuickLink,
    },
    { text: t("SIDEBAR.IMS_NAV_LINKS.ess"), path: "/ess", icon: Calendar },
    {
      text: t("SIDEBAR.IMS_NAV_LINKS.communication"),
      path: "/communication",
      icon: Communication,
    },
    {
      text: t("SIDEBAR.IMS_NAV_LINKS.standards"),
      path: "/standards",
      icon: Standards,
    },
    {
      text: t("SIDEBAR.IMS_NAV_LINKS.labourModel"),
      path: "/labourModel",
      icon: LabourModel,
    },
    {
      text: t("SIDEBAR.IMS_NAV_LINKS.forecast"),
      path: "/forecast",
      icon: Forecast,
    },
    {
      text: t("SIDEBAR.IMS_NAV_LINKS.staffing"),
      path: "/staffing",
      icon: Staffing,
    },
    {
      text: t("SIDEBAR.IMS_NAV_LINKS.labourReport"),
      path: "/labourReport",
      icon: LabourReport,
    },
    {
      text: t("SIDEBAR.IMS_NAV_LINKS.foodSafety"),
      path: "/foodSafety",
      icon: FoodSafety,
    },
    {
      text: t("SIDEBAR.IMS_NAV_LINKS.queueManagement"),
      path: "/queueManagement",
      icon: QueueManagement,
    },
  ];

  const WFM_NAV_LINKS: {
    text: string;
    path: string;
    icon: SvgIconComponent;
  }[] = [
    { text: t("SIDEBAR.WFM_NAV_LINKS.home"), path: "/", icon: Home },
    {
      text: t("SIDEBAR.WFM_NAV_LINKS.quickLinks"),
      path: "/quickLinks",
      icon: QuickLink,
    },
    { text: t("SIDEBAR.WFM_NAV_LINKS.ess"), path: "/ess", icon: Calendar },
    {
      text: t("SIDEBAR.WFM_NAV_LINKS.communication"),
      path: "/communication",
      icon: Communication,
    },
    {
      text: t("SIDEBAR.WFM_NAV_LINKS.queueManagement"),
      path: "/queueManagement",
      icon: QueueManagement,
    },
  ];

  const NAV_LINKS = {
    IMS: IMS_NAV_LINKS,
    WFM: WFM_NAV_LINKS,
  };

  const USER_PROFILE_MENU_OPTIONS = {
    changeRole: t("USER_PROFILE_MENU_OPTIONS.changeRole"),
    setFocus: t("USER_PROFILE_MENU_OPTIONS.setFocus"),
    userProfile: t("USER_PROFILE_MENU_OPTIONS.userProfile"),
    modifyDashboard: t("USER_PROFILE_MENU_OPTIONS.modifyDashboard"),
    reduceRole: t("USER_PROFILE_MENU_OPTIONS.reduceRole"),
    userManagement: t("USER_PROFILE_MENU_OPTIONS.userManagement"),
    adminMode: t("USER_PROFILE_MENU_OPTIONS.adminMode"),
    adminModeAllSettings: t("USER_PROFILE_MENU_OPTIONS.adminModeAllSettings"),
    adminModePermissions: t("USER_PROFILE_MENU_OPTIONS.adminModePermissions"),
    adminModeInternationalization: t(
      "USER_PROFILE_MENU_OPTIONS.adminModeInternationalization"
    ),
    theme: t("USER_PROFILE_MENU_OPTIONS.theme"),
    themeDark: t("USER_PROFILE_MENU_OPTIONS.themeDark"),
    themeLight: t("USER_PROFILE_MENU_OPTIONS.themeLight"),
    themeSystemDefault: t("USER_PROFILE_MENU_OPTIONS.themeSystemDefault"),
    language: t("USER_PROFILE_MENU_OPTIONS.language"),
    languageEnglish: "English",
    languageSpanish: "Español",
    languageChinese: "中文",
    languageHindi: "हिन्दी",
    logout: t("USER_PROFILE_MENU_OPTIONS.logout"),
  };

  return {
    APP_BAR,
    NAV_LINKS,
    USER_PROFILE_MENU_OPTIONS,
  };
};
