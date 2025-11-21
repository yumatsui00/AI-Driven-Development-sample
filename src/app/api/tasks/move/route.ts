import { NextResponse } from "next/server";
import { moveTaskDnd } from "@/logic/taskRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const taskId = (body?.taskId as string) ?? "";
  const fromListId = (body?.fromListId as string) ?? "";
  const toListId = (body?.toListId as string) ?? "";
  const newIndex = Number(body?.newIndex ?? 0);
  if (!taskId || !fromListId || !toListId || Number.isNaN(newIndex)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const result = await moveTaskDnd(taskId, fromListId, toListId, newIndex);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ task: result.value });
}
