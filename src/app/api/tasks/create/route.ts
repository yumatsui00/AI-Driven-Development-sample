import { NextResponse } from "next/server";
import { createTask } from "@/logic/taskRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const listId = (body?.listId as string) ?? "";
  const title = (body?.title as string) ?? "";
  const description = (body?.description as string) ?? "";
  if (!listId || !title) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const result = await createTask(listId, title, description);
  if (!result.ok) {
    const status = result.error === "task_title_required" ? 400 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ task: result.value });
}
