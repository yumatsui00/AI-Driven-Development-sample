"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BoardCard from "@/components/project/BoardCard";
import BoardCreateDialog from "@/components/project/BoardCreateDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Board } from "@/types/board";
import type { Lang } from "@/types/landing";
import { loadTranslation } from "@/utils/i18n";
import { getStoredLang, setStoredLang } from "@/utils/lang";
import { getSession } from "@/utils/session";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Params = { projectId?: string };

export default function ProjectBoardsPage() {
  const router = useRouter();
  const params = useParams<Params>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "";

  const [lang, setLang] = useState<Lang>(() => getStoredLang("en"));
  const translation = useMemo(() => loadTranslation(lang), [lang]);
  const languages = Object.keys(translation.languages) as Lang[];
  const [boards, setBoards] = useState<Board[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    setError("");
    if (!projectId) {
      router.replace("/home");
      return;
    }
    try {
      const res = await fetch("/api/boards/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(translation.boards.error);
        return;
      }
      setBoards(data.boards as Board[]);
    } catch (e) {
      setError(translation.boards.error);
    } finally {
      setLoading(false);
    }
  }, [projectId, router, translation.boards.error]);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/");
      return;
    }
    if (!projectId) {
      router.replace("/home");
      return;
    }
    fetchBoards();
  }, [projectId, router, fetchBoards]);

  const handleCreate = async (name: string) => {
    setError("");
    const res = await fetch("/api/boards/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, projectId })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error ?? "create_failed");
    }
    await fetchBoards();
  };

  const handleDelete = async (id: string) => {
    setError("");
    const res = await fetch("/api/boards/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(translation.boards.error);
      return;
    }
    await fetchBoards();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-ink-50 to-ink-100 px-4 py-10 text-ink-900">
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-ink-900">{translation.boards.title}</h1>
                <p className="text-sm text-ink-600">Project: {projectId}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="border border-ink-200 bg-white">
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
              <Button variant="ghost" onClick={() => router.replace("/home")}>
                ← {translation.boards.back}
              </Button>
              <BoardCreateDialog translation={translation} onCreate={handleCreate} />
            </div>
            {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
            {loading ? (
              <p className="text-sm text-ink-600">Loading...</p>
            ) : boards.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink-200 bg-white/70 p-4 text-center text-sm text-ink-600">
                {translation.boards.empty}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {boards.map((board) => (
                  <div key={board.id} className="group relative">
                    <BoardCard board={board} translation={translation} />
                    <button
                      type="button"
                      className="absolute right-3 top-3 hidden rounded-md border border-red-200 bg-white px-2 py-1 text-xs text-red-600 shadow-sm group-hover:block"
                      onClick={() => handleDelete(board.id)}
                    >
                      {translation.boards.delete}
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
