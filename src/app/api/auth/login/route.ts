import { NextResponse } from "next/server";
import { verifyCredentials } from "@/logic/auth/verifyCredentials";

export async function POST(request: Request) {
  const body = await request.json();
  const email = (body?.email as string) ?? "";
  const password = (body?.password as string) ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const result = await verifyCredentials(email, password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json({ user: result.value });
}
