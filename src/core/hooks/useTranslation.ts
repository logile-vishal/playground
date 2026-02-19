import { useTranslation as useI18nTranslation } from "react-i18next";

type TranslationVariables = Record<string, string | number>;

export const useTranslation = (namespace?: string) => {
  const { t: i18nT, i18n, ready } = useI18nTranslation(namespace);

  const t = (key: string, variables?: TranslationVariables): string => {
    return i18nT(key, variables) as string;
  };

  return { t, i18n, ready };
};
