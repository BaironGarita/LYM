import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    {
      code: "es",
      name: "Español",
      nativeName: "Español",
      flag: "🇪🇸",
    },
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
    },
  ];

  const currentCode = i18n.resolvedLanguage || i18n.language || "es";
  const currentLanguage =
    languages.find((lang) => lang.code === currentCode) || languages[0];

  const changeLanguage = async (langCode) => {
    if (langCode === i18n.language) {
      setIsOpen(false);
      return;
    }

    try {
      setIsChanging(true);

      // Cambiar el idioma
      await i18n.changeLanguage(langCode);

      // Guardar en localStorage para persistencia
      localStorage.setItem("i18nextLng", langCode);

      // Opcional: También puedes disparar un evento personalizado
      window.dispatchEvent(
        new CustomEvent("languageChanged", {
          detail: { language: langCode },
        })
      );

      console.log(`Idioma cambiado a: ${langCode}`);
    } catch (error) {
      console.error("Error al cambiar idioma:", error);
    } finally {
      setIsChanging(false);
      setIsOpen(false);
    }
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          isChanging
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Seleccionar idioma"
      >
        <Globe className={`h-4 w-4 ${isChanging ? "animate-spin" : ""}`} />
        <span className="hidden sm:inline">
          {isChanging ? "Cambiando..." : currentLanguage.nativeName}
        </span>
        <span className="text-lg">{currentLanguage.flag}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
            Seleccionar idioma
          </div>

          {languages.map((lang) => {
            const isActive = i18n.language === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                disabled={isChanging}
                className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex items-center gap-3 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                } ${isChanging ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                <span className="text-lg">{lang.flag}</span>

                <div className="flex flex-col flex-1">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-xs text-gray-500">{lang.name}</span>
                </div>

                {isActive && (
                  <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
