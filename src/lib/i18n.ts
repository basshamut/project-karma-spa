import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "../locales/es/common.json";
import en from "../locales/en/common.json";
import ca from "../locales/ca/common.json";
import ptBR from "../locales/pt-BR/common.json";
import fr from "../locales/fr/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { common: es },
      en: { common: en },
      ca: { common: ca },
      "pt-BR": { common: ptBR },
      fr: { common: fr },
    },
    fallbackLng: "es",
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
