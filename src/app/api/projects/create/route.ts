import { NextResponse } from "next/server";
import { createProject } from "@/logic/projectRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const userId = (body?.userId as string) ?? "";
  const name = (body?.name as string) ?? "";

  if (!userId || !name) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const result = await createProject(name, userId);
  if (!result.ok) {
    const status = result.error === "project_name_required" ? 400 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ project: result.value });
}
