import { NextResponse } from "next/server";
import { deleteProject } from "@/logic/projectRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const userId = (body?.userId as string) ?? "";
  const id = (body?.id as string) ?? "";

  if (!userId || !id) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const result = await deleteProject(id, userId);
  if (!result.ok) {
    const status = result.error === "project_not_found" ? 404 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ success: true });
}
