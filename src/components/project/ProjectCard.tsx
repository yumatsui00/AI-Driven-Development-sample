import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Project } from "@/types/project";
import type { TranslationObject } from "@/types/landing";

type ProjectCardProps = {
  project: Project;
  translation: TranslationObject;
};

/**
 * Card showing basic project info.
 */
export default function ProjectCard({ project, translation }: ProjectCardProps) {
  const created = new Date(project.createdAt).toLocaleDateString();
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold text-ink-900">{project.name}</h3>
      </CardHeader>
      <CardContent className="text-sm text-ink-600">
        {translation.projects.created_at}: {created}
      </CardContent>
    </Card>
  );
}
