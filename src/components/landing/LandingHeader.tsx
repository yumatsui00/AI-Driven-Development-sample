"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { LandingHeaderProps, Lang } from "@/types/landing";
import { cn } from "@/utils/cn";

/**
 * Header with language selector and auth action buttons.
 */
export default function LandingHeader({
  lang,
  translation,
  onChangeLang
}: LandingHeaderProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(
    () => translation.languages[lang] ?? translation.languages.en,
    [lang, translation.languages]
  );

  return (
    <header className="flex items-center justify-between gap-4 border-b border-ink-200/60 px-8 py-5">
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="gap-2 border border-ink-200 bg-white shadow-sm hover:bg-ink-50"
        >
          <span aria-hidden>🌐</span>
          <span className="text-xs uppercase tracking-wide">
            {translation.language}: {selectedLabel}
          </span>
        </Button>
        {open ? (
          <ul
            role="listbox"
            className="absolute left-0 z-10 mt-2 w-36 rounded-xl border border-ink-200 bg-white shadow-xl"
          >
            {(Object.keys(translation.languages) as Lang[]).map((code) => (
              <li key={code} className="border-t border-ink-100 first:border-t-0">
                <button
                  type="button"
                  role="option"
                  aria-selected={code === lang}
                  className={cn(
                    "flex w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-ink-100",
                    code === lang && "bg-ink-100"
                  )}
                  onClick={() => {
                    onChangeLang(code);
                    setOpen(false);
                  }}
                >
                  {translation.languages[code]}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="lg" className="border border-ink-200 bg-white px-6">
          {translation.login}
        </Button>
        <Button size="lg" className="px-8 shadow-xl shadow-ink-300/70">
          {translation.signup}
        </Button>
      </div>
    </header>
  );
}
