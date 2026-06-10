"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale, m } = useLocale();

  function pick(next: Locale) {
    setLocale(next);
  }

  return (
    <div
      className="inline-flex rounded-full border border-slate-700 bg-slate-900/80 p-0.5 text-xs font-medium"
      role="group"
      aria-label="Language"
    >
      {(["en", "zh"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => pick(code)}
          className={`rounded-full px-3 py-1.5 transition ${
            locale === code
              ? "bg-emerald-600 text-white"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {m.lang[code]}
        </button>
      ))}
    </div>
  );
}
