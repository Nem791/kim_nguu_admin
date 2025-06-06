import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-xhr-backend";
import detector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(detector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "de", "vi"], // ✅ Add Vietnamese
    backend: {
      loadPath: "/locales/{{lng}}.json",
    },
    fallbackLng: ["en", "de", "vi"], // ✅ Use a single fallback (or set "vi" if you prefer)
  });

export default i18n;
