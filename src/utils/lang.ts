import type { Lang } from "@/types/landing";

const LANG_KEY = "lang_preference";

/**
 * Read language from localStorage, or fall back to English.
 */
export function getStoredLang(defaultLang: Lang = "en"): Lang {
  if (typeof window === "undefined") return defaultLang;
  const stored = window.localStorage.getItem(LANG_KEY);
  if (stored === "jp" || stored === "en" || stored === "fr") {
    return stored;
  }
  return defaultLang;
}

/**
 * Persist language to localStorage.
 */
export function setStoredLang(lang: Lang) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANG_KEY, lang);
}
