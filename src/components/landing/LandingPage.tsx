"use client";

import { useMemo, useState } from "react";
import LandingLayout from "@/components/landing/LandingLayout";
import type { Lang } from "@/types/landing";
import { loadTranslation } from "@/utils/i18n";
import { getStoredLang, setStoredLang } from "@/utils/lang";

/**
 * Client entry for the landing page with language switching.
 */
export default function LandingPage() {
  const [lang, setLang] = useState<Lang>(() => getStoredLang("en"));
  const translation = useMemo(() => loadTranslation(lang), [lang]);

  return (
    <LandingLayout
      lang={lang}
      translation={translation}
      onChangeLang={(next) => {
        setLang(next);
        setStoredLang(next);
      }}
    />
  );
}
