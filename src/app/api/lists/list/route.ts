import { NextResponse } from "next/server";
import { getLists } from "@/logic/listRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const boardId = (body?.boardId as string) ?? "";
  if (!boardId) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const result = await getLists(boardId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ lists: result.value });
}
