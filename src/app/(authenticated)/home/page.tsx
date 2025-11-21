"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Session } from "@/types/auth";
import { loadTranslation } from "@/utils/i18n";
import { clearSession, getSession } from "@/utils/session";
import { getStoredLang, setStoredLang } from "@/utils/lang";
import ProjectCard from "@/components/project/ProjectCard";
import ProjectCreateDialog from "@/components/project/ProjectCreateDialog";
import type { Project } from "@/types/project";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

/**
 * Protected home page; requires client redirect guard from layout.
 */
export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [lang, setLang] = useState(() => getStoredLang("en"));
  const translation = useMemo(() => loadTranslation(lang), [lang]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const languages = Object.keys(translation.languages) as Lang[];

  const fetchProjects = useCallback(async (userId: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(translation.projects.error);
        setProjects([]);
        return;
      }
      setProjects(data.projects as Project[]);
    } catch (e) {
      setError(translation.projects.error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [translation.projects.error]);

  useEffect(() => {
    const current = getSession();
    if (!current) {
      router.replace("/");
      return;
    }
    setSession(current);
    fetchProjects(current.userId);
  }, [router, fetchProjects]);

  const handleLogout = () => {
    clearSession();
    router.replace("/");
  };

  const handleCreate = async (name: string) => {
    if (!session) return;
    setError("");
    const res = await fetch("/api/projects/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userId: session.userId })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error ?? "create_failed");
    }
    await fetchProjects(session.userId);
  };

  const handleDelete = async (id: string) => {
    if (!session) return;
    setError("");
    const res = await fetch("/api/projects/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId: session.userId })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(translation.projects.error);
      return;
    }
    await fetchProjects(session.userId);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-ink-50 to-ink-100 px-4 py-10 text-ink-900">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-ink-900">
                  {translation.projects.title}
                </h1>
                <p className="text-sm text-ink-600">{translation.auth.dashboardTitle}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-ink-200 bg-white"
                  >
                    {translation.language}: {translation.languages[lang]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent align="end">
                    {languages.map((code) => (
                      <DropdownMenuItem
                        key={code}
                        onSelect={() => {
                          setLang(code);
                          setStoredLang(code);
                        }}
                        className="text-sm"
                      >
                        {translation.languages[code]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-base text-ink-700">
                {translation.auth.welcome}: {session?.email ?? ""}
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="border border-ink-200 bg-white"
                onClick={handleLogout}
              >
                {translation.projects.logout}
              </Button>
            </div>
            <div className="flex justify-end">
              <ProjectCreateDialog translation={translation} onCreate={handleCreate} />
            </div>
            {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
            {loading ? (
              <p className="text-sm text-ink-600">Loading...</p>
            ) : projects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink-200 bg-white/70 p-4 text-center text-sm text-ink-600">
                {translation.projects.empty}
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="group relative">
                    <ProjectCard project={project} translation={translation} />
                    <button
                      type="button"
                      className="absolute right-3 top-3 hidden rounded-md border border-red-200 bg-white px-2 py-1 text-xs text-red-600 shadow-sm group-hover:block"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
