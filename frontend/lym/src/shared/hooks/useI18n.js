import { useTranslation } from "react-i18next";

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (lang) => {
    await i18n.changeLanguage(lang);
    // Persistencia (ambas claves por compatibilidad)
    localStorage.setItem("language", lang);
    localStorage.setItem("i18nextLng", lang);
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
    // usar el idioma resuelto para re-render fiable
    language: i18n.resolvedLanguage || i18n.language,
  };
};
