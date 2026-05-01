import { useLanguage } from "@/hooks/useLanguage";
import { LOCALE_LABELS, LOCALE_FULL } from "@/i18n/uiStrings";

interface LanguageSwitcherProps {
  variant?: "header" | "compact";
  className?: string;
}

export function LanguageSwitcher({ variant = "header", className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage, locales } = useLanguage();

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-0.5 ${className}`}>
        {locales.map((loc) => {
          const active = loc === language;
          return (
            <button
              key={loc}
              type="button"
              onClick={() => setLanguage(loc)}
              aria-pressed={active}
              aria-label={`Switch to ${LOCALE_FULL[loc]}`}
              className={`px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                active ? "text-white" : "text-white/40 hover:text-white/80"
              }`}
            >
              {LOCALE_LABELS[loc]}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-1 py-0.5 ${className}`}
    >
      {locales.map((loc) => {
        const active = loc === language;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => setLanguage(loc)}
            aria-pressed={active}
            aria-label={`Switch to ${LOCALE_FULL[loc]}`}
            className={`rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors ${
              active
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            {LOCALE_LABELS[loc]}
          </button>
        );
      })}
    </div>
  );
}
