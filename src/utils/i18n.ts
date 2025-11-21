import en from "../../assets/translations/en.json";
import fr from "../../assets/translations/fr.json";
import jp from "../../assets/translations/jp.json";
import type { Lang, TranslationObject } from "@/types/landing";

const translations: Record<Lang, TranslationObject> = {
  en,
  fr,
  jp
};

/**
 * Load translation text for the given language.
 * Falls back to English if the key is missing.
 */
export function loadTranslation(lang: Lang): TranslationObject {
  const base = translations.en;
  const selected = translations[lang] ?? base;
  return {
    appName: selected.appName ?? base.appName,
    tagline: selected.tagline ?? base.tagline,
    description: selected.description ?? base.description,
    cta: selected.cta ?? base.cta,
    login: selected.login ?? base.login,
    signup: selected.signup ?? base.signup,
    language: selected.language ?? base.language,
    languages: selected.languages ?? base.languages,
    aiSummary: selected.aiSummary ?? base.aiSummary
  };
}
