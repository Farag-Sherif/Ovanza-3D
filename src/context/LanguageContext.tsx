import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import i18n from "../i18n";

export type Lang = "ar" | "en";

interface LanguageCtx {
  language: Lang;
  dir: "rtl" | "ltr";
  setLanguage: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageCtx>({
  language: "ar",
  dir: "rtl",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Lang>(() => {
    const saved = localStorage.getItem("ovanza-lang");
    return saved === "en" || saved === "ar" ? saved : "ar";
  });

  const dir: "rtl" | "ltr" = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    i18n.changeLanguage(language);
    localStorage.setItem("ovanza-lang", language);
  }, [language, dir]);

  return (
    <LanguageContext.Provider
      value={{ language, dir, setLanguage: setLanguageState }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
