"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Session } from "@/types/auth";
import { loadTranslation } from "@/utils/i18n";
import { clearSession, getSession } from "@/utils/session";
import { getStoredLang } from "@/utils/lang";

/**
 * Protected home page; requires client redirect guard from layout.
 */
export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [lang, setLang] = useState(() => getStoredLang("en"));
  const translation = useMemo(() => loadTranslation(lang), [lang]);

  useEffect(() => {
    const current = getSession();
    if (!current) {
      router.replace("/");
      return;
    }
    setSession(current);
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.replace("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-ink-50 to-ink-100 px-4 py-10 text-ink-900">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-ink-900">
              {translation.auth.dashboardTitle}
            </h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base text-ink-700">
              {translation.auth.welcome}: {session?.email ?? ""}
            </p>
            <Button
              size="lg"
              variant="ghost"
              className="border border-ink-200 bg-white"
              onClick={handleLogout}
            >
              {translation.auth.logout}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
