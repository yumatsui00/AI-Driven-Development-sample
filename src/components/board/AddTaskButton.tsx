"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TranslationObject } from "@/types/landing";

type AddTaskButtonProps = {
  translation: TranslationObject;
  onCreate: (title: string, description: string) => Promise<void> | void;
};

/**
 * Inline form for adding a task inside a list.
 */
export default function AddTaskButton({ translation, onCreate }: AddTaskButtonProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setTitle("");
    setDescription("");
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    await onCreate(title, description);
    reset();
  };

  if (!open) {
    return (
      <Button variant="ghost" size="sm" className="w-full justify-start text-ink-700" onClick={() => setOpen(true)}>
        + {translation.tasks.add}
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-lg border border-ink-200 bg-white p-3 shadow-sm">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={translation.tasks.title_placeholder}
      />
      <textarea
        className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 shadow-inner focus:outline-none"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={translation.tasks.description_placeholder}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="bg-ink-900 text-white hover:bg-ink-800">
          {translation.tasks.save}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          {translation.tasks.cancel}
        </Button>
      </div>
    </form>
  );
}
