"use client";

import { useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Task } from "@/types/task";
import type { TranslationObject } from "@/types/landing";

type TaskCardProps = {
  task: Task;
  listId: string;
  translation: TranslationObject;
  onUpdate: (id: string, fields: { title?: string; description?: string }) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
};

/**
 * Sortable task card with inline edit/delete controls.
 */
export default function TaskCard({ task, listId, translation, onUpdate, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", listId }
  });
  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.7 : 1
    }),
    [transform, transition, isDragging]
  );

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSave = async () => {
    await onUpdate(task.id, { title, description });
    setEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(task.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-lg border border-ink-200 bg-white p-3 shadow-sm"
      {...attributes}
      {...listeners}
    >
      {editing ? (
        <div className="space-y-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea
            className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 shadow-inner focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={translation.tasks.description_placeholder}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="bg-ink-900 text-white hover:bg-ink-800">
              {translation.tasks.save}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              {translation.tasks.cancel}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-ink-900">{task.title}</p>
              {task.description ? (
                <p className="text-xs text-ink-700">{task.description}</p>
              ) : null}
            </div>
            <div className="flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
                {translation.tasks.edit}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDelete} className="text-red-600">
                {translation.tasks.delete}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
