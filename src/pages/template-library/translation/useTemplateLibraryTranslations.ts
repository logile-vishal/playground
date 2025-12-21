import { useTranslation } from "react-i18next";
import { EmptyState } from "@/core/constants/icons";

export const useTemplateLibraryTranslations = () => {
  const { t } = useTranslation("template-library");

  const TEMPLATE_LIBRARY_HEADING = {
    createTemplate: t("TEMPLATE_LIBRARY_HEADING.createTemplate"),
    folderTree: t("TEMPLATE_LIBRARY_HEADING.folderTree"),
    template: t("TEMPLATE_LIBRARY_HEADING.template"),
    templateLibrary: t("TEMPLATE_LIBRARY_HEADING.templateLibrary"),
    searchTemplates: t("TEMPLATE_LIBRARY_HEADING.searchTemplates"),
  };

  const TEMPLATE_LIBRARY_NO_DATA = {
    title: t("TEMPLATE_LIBRARY_NO_DATA.title"),
    description: t("TEMPLATE_LIBRARY_NO_DATA.description"),
    imageSrcName: EmptyState,
  };

  const TEMPLATE_TABLE_COLUMN_HEADINGS = {
    name: t("TEMPLATE_TABLE_COLUMN_HEADINGS.name"),
    type: t("TEMPLATE_TABLE_COLUMN_HEADINGS.type"),
    status: t("TEMPLATE_TABLE_COLUMN_HEADINGS.status"),
    created: t("TEMPLATE_TABLE_COLUMN_HEADINGS.created"),
    lastModified: t("TEMPLATE_TABLE_COLUMN_HEADINGS.lastModified"),
    actions: t("TEMPLATE_TABLE_COLUMN_HEADINGS.actions"),
  };

  const NO_DATA_SEARCH = {
    title: t("NO_DATA_SEARCH.title"),
    description: t("NO_DATA_SEARCH.description"),
  };

  return {
    TEMPLATE_LIBRARY_HEADING,
    TEMPLATE_LIBRARY_NO_DATA,
    TEMPLATE_TABLE_COLUMN_HEADINGS,
    NO_DATA_SEARCH,
  };
};
