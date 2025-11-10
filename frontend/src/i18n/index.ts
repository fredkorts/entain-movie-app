import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import et from "./locales/et.json";
import ru from "./locales/ru.json";

const saved = localStorage.getItem("lang");
const browser = (navigator.language || "en").split("-")[0];

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, et: { translation: et }, ru: { translation: ru } },
    lng: saved || browser || "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
