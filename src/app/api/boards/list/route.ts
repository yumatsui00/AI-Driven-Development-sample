import { NextResponse } from "next/server";
import { listBoards } from "@/logic/boardRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const projectId = (body?.projectId as string) ?? "";
  if (!projectId) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const result = await listBoards(projectId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ boards: result.value });
}
