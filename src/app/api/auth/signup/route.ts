import { NextResponse } from "next/server";
import { createUser } from "@/logic/auth/createUser";

export async function POST(request: Request) {
  const body = await request.json();
  const email = (body?.email as string) ?? "";
  const password = (body?.password as string) ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const result = await createUser({ email, password });
  if (!result.ok) {
    const status = result.error === "email_exists" ? 409 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ id: result.value.id });
}
