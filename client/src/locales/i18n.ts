import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import languageEN from "./en/translate.json";
import languagePL from "./pl/translate.json";

i18n.use(initReactI18next).init({
    resources: {
        en: languageEN,
        pl: languagePL
    },
    lng: "en",
    fallbackLng: "en",
    debug: true,
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: ".",
    interpolation: {
        escapeValue: false,
        formatSeparator: ","
    },
    react: {
        wait: true,
        bindI18n: "languageChanged loaded",
        bindStore: "added removed",
        nsMode: "default"
    }
});

export default i18n;
