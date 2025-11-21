import { NextResponse } from "next/server";
import { reorderTasksWithinList } from "@/logic/taskRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const listId = (body?.listId as string) ?? "";
  const taskIds = (body?.taskIds as string[]) ?? [];
  if (!listId || taskIds.length === 0) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const result = await reorderTasksWithinList(listId, taskIds);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
