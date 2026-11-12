import { NextResponse } from "next/server";
import { checkPassword, setAuthCookie } from "@/lib/auth";
export async function POST(req: Request) {
  const { password } = await req.json();
  if (!checkPassword(password)) return NextResponse.json({ ok: false }, { status: 401 });
  setAuthCookie();
  return NextResponse.json({ ok: true });
}