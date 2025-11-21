"use client";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddTaskButton from "./AddTaskButton";
import TaskCard from "./TaskCard";
import type { TranslationObject } from "@/types/landing";
import type { List } from "@/types/list";
import type { Task } from "@/types/task";

type ListColumnProps = {
  list: List;
  tasks: Task[];
  translation: TranslationObject;
  accent?: {
    card: string;
    header: string;
    badge: string;
  };
  onAddTask: (listId: string, title: string, description: string) => Promise<void> | void;
  onUpdateTask: (taskId: string, fields: { title?: string; description?: string }) => Promise<void> | void;
  onDeleteTask: (taskId: string) => Promise<void> | void;
  onDeleteList: (listId: string) => Promise<void> | void;
};

/**
 * Renders a list column with sortable tasks.
 */
export default function ListColumn({
  list,
  tasks,
  translation,
  accent,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onDeleteList
}: ListColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `list-${list.id}`,
    data: { type: "list", listId: list.id }
  });

  return (
    <Card
      ref={setNodeRef}
      className={`flex h-full min-w-[280px] flex-col border-ink-200 bg-white/90 ${accent?.card ?? ""} ${
        isOver ? "ring-2 ring-ink-300" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${accent?.badge ?? "bg-ink-300"}`}
            aria-hidden
          />
          <p className={`text-sm font-semibold ${accent?.header ?? "text-ink-900"}`}>{list.name}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onDeleteList(list.id)} className="text-xs text-red-600">
          {translation.lists.delete}
        </Button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4">
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <p className="rounded-md border border-dashed border-ink-200 bg-white/70 p-3 text-xs text-ink-600">
              {translation.tasks.empty}
            </p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                listId={list.id}
                translation={translation}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </SortableContext>
        <AddTaskButton translation={translation} onCreate={(title, description) => onAddTask(list.id, title, description)} />
      </CardContent>
    </Card>
  );
}
