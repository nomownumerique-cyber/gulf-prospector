import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { chatJSON } from "@/lib/openai";
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const p = await prisma.prospect.findUnique({ where: { id: params.id } });
  if (!p) return NextResponse.json({ error: "not found" }, { status: 404 });
  try {
    const data = await chatJSON(
      "You are a B2B email copywriter for a Gulf e-marketing agency (Sahm). Write a professional email to this merchant. Subject line + body in Arabic (Gulf-friendly MSA) and English. Structure: permission hook (not surveillance), their specific gap in line 1, one revenue-focused insight, soft CTA. Sender: sahm@growthed.online. Never mention follower counts as an attack. Never fabricate stats. Return JSON: {subject, bodyAr, bodyEn}.",
      JSON.stringify(p)
    );
    const draft = await prisma.emailDraft.create({
      data: { prospectId: p.id, subject: data.subject, bodyAr: data.bodyAr, bodyEn: data.bodyEn },
    });
    return NextResponse.json({ draft, ...data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}