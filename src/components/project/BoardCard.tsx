import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Board } from "@/types/board";
import type { TranslationObject } from "@/types/landing";

type BoardCardProps = {
  board: Board;
  translation: TranslationObject;
};

/**
 * Board card links to lists page (future) and shows created date.
 */
export default function BoardCard({ board, translation }: BoardCardProps) {
  const created = new Date(board.createdAt).toLocaleDateString();
  const href = `/projects/${board.projectId}/boards/${board.id}/lists`;
  return (
    <Card>
      <CardHeader className="pb-2">
        <Link href={href} className="text-lg font-semibold text-ink-900 hover:underline">
          {board.name}
        </Link>
      </CardHeader>
      <CardContent className="text-sm text-ink-600">
        {translation.boards.created_at}: {created}
      </CardContent>
    </Card>
  );
}
