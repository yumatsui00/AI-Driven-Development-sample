"use client";

import BoardPage from "@/components/board/BoardPage";

type PageProps = {
  params: { boardId: string };
};

export default function BoardDetailPage({ params }: PageProps) {
  return <BoardPage boardId={params.boardId} />;
}
