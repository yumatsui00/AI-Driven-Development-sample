import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

// Match only real routes; route groups do not appear in URLs.
export const config = {
  matcher: ["/", "/home", "/login", "/signup"]
};
