import { NextResponse } from "next/server";
import { listProjects } from "@/logic/projectRepository";
import { getBoardById } from "@/logic/boardRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const boardId = (body?.boardId as string) ?? "";
  const userId = (body?.userId as string) ?? "";
  if (!boardId) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const boardResult = await getBoardById(boardId);
  if (!boardResult.ok) {
    return NextResponse.json({ error: boardResult.error }, { status: 500 });
  }
  if (!boardResult.value) {
    return NextResponse.json({ error: "board_not_found" }, { status: 404 });
  }

  if (userId) {
    const projects = await listProjects(userId);
    if (!projects.ok) {
      return NextResponse.json({ error: "projects_read_failed" }, { status: 500 });
    }
    const allowed = new Set(projects.value.map((p) => p.id));
    if (!allowed.has(boardResult.value.projectId)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  }

  return NextResponse.json({ board: boardResult.value });
}
