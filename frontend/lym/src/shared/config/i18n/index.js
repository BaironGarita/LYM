import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {es} from "@/shared/config/locales/es";
import {en} from "@/shared/config/locales/en";

const resources = {
  es,
  en,
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",

    supportedLngs: ["es", "en"],
    load: "languageOnly", // 'es-CR' -> 'es'
    cleanCode: true,

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    debug: true,
  });

export default i18n;
