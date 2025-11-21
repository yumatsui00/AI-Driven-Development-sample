"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { loadTranslation } from "@/utils/i18n";
import { getStoredLang } from "@/utils/lang";

type Session = {
  login: boolean;
  userId: string;
  email: string;
};

/**
 * Simple protected dashboard; redirects to home when no session.
 */
export default function DashboardPage() {
  const router = useRouter();
  const [lang, setLang] = useState(() => getStoredLang("en"));
  const translation = useMemo(() => loadTranslation(lang), [lang]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("session");
    if (!raw) {
      alert(translation.auth.sessionMissing);
      router.push("/");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Session;
      if (!parsed.login) {
        alert(translation.auth.sessionMissing);
        router.push("/");
        return;
      }
      setSession(parsed);
    } catch (e) {
      router.push("/");
    }
  }, [router, translation.auth.sessionMissing]);

  const handleLogout = () => {
    localStorage.removeItem("session");
    router.push("/");
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
            <Button size="lg" variant="ghost" className="border border-ink-200 bg-white" onClick={handleLogout}>
              {translation.auth.logout}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
