import Link from "next/link";
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
  const href = `/projects/${project.id}/boards`;
  return (
    <Card>
      <CardHeader className="pb-2">
        <Link href={href} className="text-lg font-semibold text-ink-900 hover:underline">
          {project.name}
        </Link>
      </CardHeader>
      <CardContent className="text-sm text-ink-600">
        {translation.projects.created_at}: {created}
      </CardContent>
    </Card>
  );
}
