import { NextResponse } from "next/server";
import { listProjects } from "@/logic/projectRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const userId = (body?.userId as string) ?? "";
  if (!userId) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const result = await listProjects(userId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ projects: result.value });
}
