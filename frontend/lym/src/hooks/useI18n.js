import { useTranslation } from "react-i18next";

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const getCurrentLanguage = () => i18n.language;

  const isRTL = () => {
    // Si agregas idiomas de derecha a izquierda en el futuro
    return ["ar", "he", "fa"].includes(i18n.language);
  };

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    isRTL,
    language: i18n.language,
  };
};
