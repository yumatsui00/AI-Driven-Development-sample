"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { LandingHeaderProps, Lang } from "@/types/landing";

/**
 * Header with language selector and auth action buttons.
 */
export default function LandingHeader({
  lang,
  translation,
  onChangeLang
}: LandingHeaderProps) {
  const selectedLabel = useMemo(
    () => translation.languages[lang] ?? translation.languages.en,
    [lang, translation.languages]
  );

  return (
    <header className="flex items-center justify-between gap-4 border-b border-ink-200/60 px-8 py-5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            aria-haspopup="listbox"
            className="gap-2 border border-ink-200 bg-white shadow-sm hover:bg-ink-50"
          >
            <span aria-hidden>🌐</span>
            <span className="text-xs uppercase tracking-wide">
              {translation.language}: {selectedLabel}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent align="start">
            {(Object.keys(translation.languages) as Lang[]).map((code) => (
              <DropdownMenuItem
                key={code}
                role="option"
                aria-selected={code === lang}
                className="justify-between text-sm"
                onSelect={(event) => {
                  event.preventDefault();
                  onChangeLang(code);
                }}
              >
                {translation.languages[code]}
                {code === lang ? <span className="text-ink-500">•</span> : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
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
