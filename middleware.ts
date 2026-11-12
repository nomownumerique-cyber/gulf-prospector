import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // ne pas bloquer les routes API ni les assets statiques
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname === "/favicon.ico") return NextResponse.next();
  if (pathname.startsWith("/login")) return NextResponse.next();
  const cookie = req.cookies.get("sahm_auth")?.value;
  if (cookie !== "1") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
