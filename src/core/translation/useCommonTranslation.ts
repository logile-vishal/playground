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
    seeMoreButtonLabel: t("GENERAL.seeMoreButtonLabel"),
    seeLessButtonLabel: t("GENERAL.seeLessButtonLabel"),
  };

  const PAGINATION = {
    pageLabel: t("PAGINATION.pageLabel"),
    ofLabel: t("PAGINATION.ofLabel"),
  };

  const EDITOR_TOOLBAR = {
    bold: t("EDITOR_TOOLBAR.bold"),
    italic: t("EDITOR_TOOLBAR.italic"),
    underline: t("EDITOR_TOOLBAR.underline"),
    link: t("EDITOR_TOOLBAR.link"),
    attachment: t("EDITOR_TOOLBAR.attachment"),
    clearFormat: t("EDITOR_TOOLBAR.clearFormat"),
    wildcard: t("EDITOR_TOOLBAR.wildcard"),
  };

  const EDITOR_FILE_UPLOAD = {
    text: t("EDITOR_FILE_UPLOAD.text"),
    title: t("EDITOR_FILE_UPLOAD.title"),
    linkPlaceholder: t("EDITOR_FILE_UPLOAD.linkPlaceholder"),
  };

  const EDITOR_LINK_UPLOAD = {
    title: t("EDITOR_LINK_UPLOAD.title"),
    editTitle: t("EDITOR_LINK_UPLOAD.editTitle"),
    text: t("EDITOR_LINK_UPLOAD.text"),
    link: t("EDITOR_LINK_UPLOAD.link"),
    placeholder: t("EDITOR_LINK_UPLOAD.placeholder"),
    cancelBtn: t("EDITOR_LINK_UPLOAD.cancelBtn"),
    removeLinkBtn: t("EDITOR_LINK_UPLOAD.removeLinkBtn"),
    submitBtn: t("EDITOR_LINK_UPLOAD.submitBtn"),
  };

  const EDITOR_ERROR = {
    REQUIRED_FIELD: t("EDITOR_ERROR.REQUIRED_FIELD"),
  };

  const NO_DATA = {
    TITLE: t("NO_DATA.TITLE"),
  };
  const NESTED_MENU = {
    filterPlaceholder: t("GENERAL.filterPlaceholder"),
  };

  return {
    GENERAL,
    PAGINATION,
    EDITOR_TOOLBAR,
    EDITOR_FILE_UPLOAD,
    EDITOR_LINK_UPLOAD,
    EDITOR_ERROR,
    NO_DATA,
    NESTED_MENU,
  };
};
