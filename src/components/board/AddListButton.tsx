"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TranslationObject } from "@/types/landing";

type AddListButtonProps = {
  translation: TranslationObject;
  onCreate: (name: string) => Promise<void> | void;
};

/**
 * Inline control to create a new list.
 */
export default function AddListButton({ translation, onCreate }: AddListButtonProps) {
  const [name, setName] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    await onCreate(name);
    setName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full min-w-[240px] flex-col gap-3 rounded-xl border border-dashed border-ink-200 bg-white/70 p-4 shadow-sm"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800">{translation.lists.add}</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={translation.lists.name_placeholder}
        />
      </div>
      <Button type="submit" className="self-start bg-ink-900 text-white hover:bg-ink-800">
        {translation.lists.add}
      </Button>
    </form>
  );
}
