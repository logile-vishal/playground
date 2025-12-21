import { useTranslation } from "react-i18next";

export const useLayoutTranslations = () => {
  const { t } = useTranslation("layout");

  const APP_BAR = {
    searchPlaceholder: t("APP_BAR.searchPlaceholder"),
  };

  return {
    APP_BAR,
  };
};
