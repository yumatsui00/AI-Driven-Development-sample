import { NextResponse } from "next/server";
import { deleteTask } from "@/logic/taskRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const id = (body?.id as string) ?? "";
  if (!id) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const result = await deleteTask(id);
  if (!result.ok) {
    const status = result.error === "task_not_found" ? 404 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ success: true });
}
