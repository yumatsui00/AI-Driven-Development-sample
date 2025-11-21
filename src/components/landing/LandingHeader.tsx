/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
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
    <header className="flex items-center justify-between px-6 py-4">
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
            className="absolute left-0 z-10 mt-2 w-28 rounded-md border border-ink-200 bg-white shadow-lg"
          >
            {(Object.keys(translation.languages) as Lang[]).map((code) => (
              <li
                key={code}
                role="option"
                aria-selected={code === lang}
                className={cn(
                  "cursor-pointer px-3 py-2 text-sm hover:bg-ink-100",
                  code === lang && "bg-ink-100"
                )}
                onClick={() => {
                  onChangeLang(code);
                  setOpen(false);
                }}
              >
                {translation.languages[code]}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="border border-ink-200 bg-white">
          {translation.login}
        </Button>
        <Button className="shadow-lg">{translation.signup}</Button>
      </div>
    </header>
  );
}
