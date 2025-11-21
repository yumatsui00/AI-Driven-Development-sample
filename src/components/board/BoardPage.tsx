"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ListColumn from "./ListColumn";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { loadTranslation } from "@/utils/i18n";
import { getStoredLang, setStoredLang } from "@/utils/lang";
import { getSession, clearSession } from "@/utils/session";
import type { Session } from "@/types/auth";
import type { Lang, TranslationObject } from "@/types/landing";
import type { Board } from "@/types/board";
import type { List } from "@/types/list";
import type { Task } from "@/types/task";

type BoardPageProps = {
  boardId: string;
};

function reorderTasksInState(tasks: Task[], listId: string, orderedIds: string[]): Task[] {
  const mapped = tasks.filter((task) => task.listId === listId);
  const others = tasks.filter((task) => task.listId !== listId);
  const orderMap = new Map(orderedIds.map((id, idx) => [id, idx + 1]));
  const reordered = mapped
    .slice()
    .sort((a, b) => (orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER))
    .map((task) => ({
      ...task,
      order: orderMap.get(task.id) ?? task.order
    }));
  return [...others, ...reordered];
}

function moveTaskLocally(tasks: Task[], taskId: string, fromListId: string, toListId: string, newIndex: number): Task[] {
  const task = tasks.find((t) => t.id === taskId && t.listId === fromListId);
  if (!task) return tasks;
  const fromTasks = tasks.filter((t) => t.listId === fromListId && t.id !== taskId).sort((a, b) => a.order - b.order);
  const toTasks = tasks.filter((t) => t.listId === toListId).sort((a, b) => a.order - b.order);
  const boundedIndex = Math.max(0, Math.min(newIndex, toTasks.length));
  const updatedTo = [...toTasks];
  updatedTo.splice(boundedIndex, 0, { ...task, listId: toListId });
  const normalizedTo = updatedTo.map((t, idx) => ({ ...t, order: idx + 1 }));
  const normalizedFrom = fromTasks.map((t, idx) => ({ ...t, order: idx + 1 }));
  const others = tasks.filter((t) => t.listId !== fromListId && t.listId !== toListId);
  return [...others, ...normalizedFrom, ...normalizedTo];
}

/**
 * Board page container handling lists/tasks and DnD.
 */
export default function BoardPage({ boardId }: BoardPageProps) {
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const [session, setSession] = useState<Session | null>(null);
  const [lang, setLang] = useState<Lang>(() => getStoredLang("en"));
  const translation = useMemo<TranslationObject>(() => loadTranslation(lang), [lang]);
  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [addListOpen, setAddListOpen] = useState(false);
  const [newListName, setNewListName] = useState("");

  const languages = useMemo(() => Object.keys(translation.languages) as Lang[], [translation.languages]);
  const listPalette = useMemo(
    () => [
      { card: "border-amber-200 bg-amber-50/80", header: "text-amber-900", badge: "bg-amber-300" },
      { card: "border-sky-200 bg-sky-50/80", header: "text-sky-900", badge: "bg-sky-300" },
      { card: "border-emerald-200 bg-emerald-50/80", header: "text-emerald-900", badge: "bg-emerald-300" },
      { card: "border-rose-200 bg-rose-50/80", header: "text-rose-900", badge: "bg-rose-300" },
      { card: "border-violet-200 bg-violet-50/80", header: "text-violet-900", badge: "bg-violet-300" }
    ],
    []
  );

  const fetchBoard = useCallback(
    async (userId: string) => {
      const res = await fetch("/api/boards/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId, userId })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(translation.boards.error);
        return;
      }
      setBoard(data.board as Board);
    },
    [boardId, translation.boards.error]
  );

  const fetchLists = useCallback(async () => {
    const res = await fetch("/api/lists/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(translation.lists.error);
      return;
    }
    const fetched = data.lists as List[];
    setLists(fetched.sort((a, b) => a.order - b.order));
  }, [boardId, translation.lists.error]);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(translation.tasks.create_error);
      return;
    }
    const fetched = data.tasks as Task[];
    setTasks(fetched.sort((a, b) => a.order - b.order));
  }, [boardId, translation.tasks.create_error]);

  const hydrate = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError("");
      await Promise.all([fetchBoard(userId), fetchLists(), fetchTasks()]);
      setLoading(false);
    },
    [fetchBoard, fetchLists, fetchTasks]
  );

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/");
      return;
    }
    setSession(s);
    hydrate(s.userId);
  }, [router, hydrate]);

  const handleLogout = () => {
    clearSession();
    router.replace("/");
  };

  const handleAddList = async (name: string) => {
    const res = await fetch("/api/lists/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId, name })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(translation.lists.error);
      return;
    }
    setLists((prev) => [...prev, data.list as List].sort((a, b) => a.order - b.order));
    setNewListName("");
    setAddListOpen(false);
  };

  const handleDeleteList = async (listId: string) => {
    const res = await fetch("/api/lists/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: listId, boardId })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(translation.lists.error);
      return;
    }
    setLists((prev) => prev.filter((l) => l.id !== listId));
    setTasks((prev) => prev.filter((t) => t.listId !== listId));
  };

  const handleAddTask = async (listId: string, title: string, description: string) => {
    const res = await fetch("/api/tasks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listId, title, description })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(translation.tasks.create_error);
      return;
    }
    setTasks((prev) => [...prev, data.task as Task].sort((a, b) => a.order - b.order));
  };

  const handleUpdateTask = async (taskId: string, fields: { title?: string; description?: string }) => {
    const res = await fetch("/api/tasks/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId, ...fields })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(translation.tasks.update_error);
      return;
    }
    setTasks((prev) => prev.map((task) => (task.id === taskId ? (data.task as Task) : task)));
  };

  const handleDeleteTask = async (taskId: string) => {
    const res = await fetch("/api/tasks/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(translation.tasks.update_error);
      return;
    }
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const type = event.active.data.current?.type as string | undefined;
    if (type === "task") {
      setActiveTaskId(String(event.active.id));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);
    if (!over) return;
    const activeId = String(active.id);
    const fromListId = active.data.current?.listId as string | undefined;
    const overListId = over.data.current?.listId as string | undefined;
    if (!fromListId || !overListId) return;

    if (fromListId === overListId) {
      const ids = tasks.filter((t) => t.listId === fromListId).map((t) => t.id);
      const overTaskId = over.data.current?.type === "task" ? String(over.id) : null;
      const oldIndex = ids.indexOf(activeId);
      const newIndex = overTaskId ? ids.indexOf(overTaskId) : ids.length - 1;
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
      const orderedIds = arrayMove(ids, oldIndex, newIndex);
      setTasks((prev) => reorderTasksInState(prev, fromListId, orderedIds));

      const res = await fetch("/api/tasks/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listId: fromListId, taskIds: orderedIds })
      });
      if (!res.ok) {
        setError(translation.tasks.reorder_error);
        await fetchTasks();
      }
      return;
    }

    const overTaskId = over.data.current?.type === "task" ? String(over.id) : null;
    const targetIds = tasks.filter((t) => t.listId === overListId).map((t) => t.id);
    const newIndex = overTaskId ? targetIds.indexOf(overTaskId) : targetIds.length;
    setTasks((prev) => moveTaskLocally(prev, activeId, fromListId, overListId, newIndex));

    const res = await fetch("/api/tasks/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: activeId, fromListId, toListId: overListId, newIndex })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(translation.tasks.move_error);
      await fetchTasks();
    } else {
      await fetchTasks();
    }
  };

  if (!session) {
    return null;
  }

  const activeTask = activeTaskId ? tasks.find((t) => t.id === activeTaskId) : null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-ink-50 to-ink-100 px-6 py-8 text-ink-900">
      <Card className="border-ink-200">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm text-ink-600">{translation.auth.welcome}: {session.email}</p>
              <h1 className="text-2xl font-bold text-ink-900">{board?.name ?? translation.boards.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={addListOpen} onOpenChange={setAddListOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-ink-900 text-white hover:bg-ink-800">
                    {translation.lists.add}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{translation.lists.add}</DialogTitle>
                  </DialogHeader>
                  <form
                    className="space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newListName.trim()) return;
                      void handleAddList(newListName);
                    }}
                  >
                    <Input
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder={translation.lists.name_placeholder}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setAddListOpen(false);
                          setNewListName("");
                        }}
                      >
                        {translation.tasks.cancel}
                      </Button>
                      <Button type="submit" className="bg-ink-900 text-white hover:bg-ink-800">
                        {translation.lists.add}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
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
                      >
                        {translation.languages[code]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                className="border border-ink-200 bg-white"
                onClick={() => {
                  if (board?.projectId) {
                    router.push(`/projects/${board.projectId}/boards`);
                  } else {
                    router.push("/home");
                  }
                }}
              >
                {translation.boards.back}
              </Button>
              <Button variant="ghost" size="sm" className="border border-ink-200 bg-white" onClick={handleLogout}>
                {translation.auth.logout}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
          {loading ? (
            <p className="text-sm text-ink-600">{translation.boards.loading}</p>
          ) : (
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {lists.length === 0 ? (
                  <div className="flex min-w-[320px] items-center rounded-xl border border-dashed border-ink-200 bg-white/80 p-4">
                    <p className="text-sm text-ink-700">{translation.lists.empty}</p>
                  </div>
                ) : (
                  lists
                    .sort((a, b) => a.order - b.order)
                    .map((list, idx) => (
                      <ListColumn
                        key={list.id}
                        list={list}
                        tasks={tasks.filter((task) => task.listId === list.id).sort((a, b) => a.order - b.order)}
                        accent={listPalette[idx % listPalette.length]}
                        translation={translation}
                        onAddTask={handleAddTask}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        onDeleteList={handleDeleteList}
                      />
                    ))
                )}
              </div>
              <DragOverlay>
                {activeTask ? (
                  <div className="w-[260px] rounded-lg border border-ink-200 bg-white p-3 shadow-lg">
                    <p className="text-sm font-semibold text-ink-900">{activeTask.title}</p>
                    {activeTask.description ? (
                      <p className="text-xs text-ink-700">{activeTask.description}</p>
                    ) : null}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
