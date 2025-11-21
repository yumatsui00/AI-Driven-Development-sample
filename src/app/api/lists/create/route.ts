import { NextResponse } from "next/server";
import { createList } from "@/logic/listRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const boardId = (body?.boardId as string) ?? "";
  const name = (body?.name as string) ?? "";
  if (!boardId || !name) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const result = await createList(name, boardId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ list: result.value });
}
