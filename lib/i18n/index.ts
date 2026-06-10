import { en } from "./en";
import { zh } from "./zh";

export type Locale = "en" | "zh";

export type Messages = typeof en | typeof zh;

const catalogs = { en, zh } satisfies Record<Locale, Messages>;

export function getMessages(locale: Locale): Messages {
  return catalogs[locale];
}

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("zh")) return "zh";
  return "en";
}

export const LOCALE_STORAGE_KEY = "ams-locale";
