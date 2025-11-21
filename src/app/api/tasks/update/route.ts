import { NextResponse } from "next/server";
import { updateTask } from "@/logic/taskRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const id = (body?.id as string) ?? "";
  const title = body?.title as string | undefined;
  const description = body?.description as string | undefined;
  if (!id) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const result = await updateTask(id, { title, description });
  if (!result.ok) {
    const status = result.error === "task_not_found" ? 404 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ task: result.value });
}
