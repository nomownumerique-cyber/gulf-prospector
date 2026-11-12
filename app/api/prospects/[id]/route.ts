import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const p = await prisma.prospect.findUnique({ where: { id: params.id }, include: { audits: true, emailDrafts: true, search: true } });
  if (!p) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(p);
}
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const p = await prisma.prospect.update({ where: { id: params.id }, data: body });
  return NextResponse.json(p);
}