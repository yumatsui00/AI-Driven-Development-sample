"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TranslationObject } from "@/types/landing";

type BoardCreateDialogProps = {
  translation: TranslationObject;
  onCreate: (name: string) => Promise<void>;
};

export default function BoardCreateDialog({ translation, onCreate }: BoardCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError(translation.boards.error);
      return;
    }
    setLoading(true);
    try {
      await onCreate(name.trim());
      setName("");
      setOpen(false);
    } catch (err) {
      setError(translation.boards.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">{translation.boards.create_button}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translation.boards.create}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="board-name">{translation.boards.create}</Label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={translation.boards.name_placeholder}
            />
          </div>
          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {translation.boards.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {translation.boards.create_button}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
