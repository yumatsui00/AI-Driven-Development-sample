import { NextResponse } from "next/server";
import { createBoard } from "@/logic/boardRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const projectId = (body?.projectId as string) ?? "";
  const name = (body?.name as string) ?? "";

  if (!projectId || !name) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const result = await createBoard(name, projectId);
  if (!result.ok) {
    const status = result.error === "board_name_required" ? 400 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ board: result.value });
}
