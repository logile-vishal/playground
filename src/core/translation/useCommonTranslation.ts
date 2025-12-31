import { useTranslation } from "react-i18next";

export const useCommonTranslation = () => {
  const { t } = useTranslation("common");
  const GENERAL = {
    renameButtonLabel: t("GENERAL.renameButtonLabel"),
    deleteButtonLabel: t("GENERAL.deleteButtonLabel"),
    cancelButtonLabel: t("GENERAL.cancelButtonLabel"),
    saveButtonLabel: t("GENERAL.saveButtonLabel"),
    addButtonLabel: t("GENERAL.addButtonLabel"),
    closeButtonLabel: t("GENERAL.closeButtonLabel"),
    confirmButtonLabel: t("GENERAL.confirmButtonLabel"),
  };

  return {
    GENERAL,
  };
};
