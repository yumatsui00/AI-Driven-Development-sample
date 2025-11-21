import { NextResponse } from "next/server";
import { deleteList } from "@/logic/listRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const listId = (body?.id as string) ?? "";
  const boardId = (body?.boardId as string) ?? "";
  if (!listId || !boardId) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const result = await deleteList(listId, boardId);
  if (!result.ok) {
    const status = result.error === "list_not_found" ? 404 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ success: true });
}
