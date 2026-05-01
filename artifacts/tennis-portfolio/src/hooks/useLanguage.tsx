import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  SOURCE_LOCALE,
  SUPPORTED_LOCALES,
  UI,
  isLocale,
  type Locale,
} from "@/i18n/uiStrings";

const STORAGE_KEY = "vc.lang";

interface LanguageContextValue {
  language: Locale;
  setLanguage: (loc: Locale) => void;
  ui: (typeof UI)[Locale];
  locales: readonly Locale[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitial(): Locale {
  if (typeof window === "undefined") return SOURCE_LOCALE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLocale(stored)) return stored;
  const nav = window.navigator?.language?.slice(0, 2).toLowerCase() ?? "";
  return isLocale(nav) ? nav : SOURCE_LOCALE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Locale>(SOURCE_LOCALE);

  useEffect(() => {
    setLanguageState(detectInitial());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((loc: Locale) => {
    setLanguageState(loc);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, loc);
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      ui: UI[language],
      locales: SUPPORTED_LOCALES,
    }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
