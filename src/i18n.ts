import i18n from "i18next";
import i18nBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

declare global {
  interface Window {
    __USER_FRONT_STATIC__?: string;
  }
}

/** Locale JSON lives next to the built assets (`static/user-front/i18n/`). */
function i18nLoadPath(): string {
  const base = (typeof window !== "undefined" && window.__USER_FRONT_STATIC__) || "";
  return `${base.replace(/\/$/, "")}/i18n/{{lng}}.json`;
}

i18n
  .use(i18nBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: i18nLoadPath(),
    },
  });

export default i18n;
