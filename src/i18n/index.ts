import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend) // Load JSON files dynamically
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: import.meta.env.MODE === "development",
    interpolation: { escapeValue: false },
    ns: ["common", "template-library"], // Preload namespaces
    defaultNS: "common", // Default namespace for t() calls
    backend: {
      loadPath: "./locales/{{lng}}/{{ns}}.json", // dynamic loading
    },
    detection: {
      order: ["localStorage", "navigator", "querystring", "cookie", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },
  });

export default i18n;
