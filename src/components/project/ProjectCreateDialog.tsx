"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TranslationObject } from "@/types/landing";

type ProjectCreateDialogProps = {
  translation: TranslationObject;
  onCreate: (name: string) => Promise<void>;
};

/**
 * Dialog to create a new project.
 */
export default function ProjectCreateDialog({ translation, onCreate }: ProjectCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError(translation.projects.name_required);
      return;
    }
    setLoading(true);
    try {
      await onCreate(name.trim());
      setName("");
      setOpen(false);
    } catch (err) {
      setError(translation.projects.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="px-6">
          {translation.projects.create_button}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translation.projects.create}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="project-name">{translation.projects.create}</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={translation.projects.name_placeholder}
            />
          </div>
          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {translation.projects.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {translation.projects.create_button}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
