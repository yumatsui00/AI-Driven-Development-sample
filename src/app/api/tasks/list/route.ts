import { NextResponse } from "next/server";
import { listTasksByBoard } from "@/logic/taskRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const boardId = (body?.boardId as string) ?? "";
  if (!boardId) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const result = await listTasksByBoard(boardId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ tasks: result.value });
}
