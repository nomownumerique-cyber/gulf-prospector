import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { chatJSON } from "@/lib/openai";
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const p = await prisma.prospect.findUnique({ where: { id: params.id } });
  if (!p) return NextResponse.json({ error: "not found" }, { status: 404 });
  try {
    const data = await chatJSON(
      "You are a digital marketing analyst for Gulf small businesses. Given this prospect's Google Maps data, produce a JSON audit: {findings: [string], recommendations: [string], competitorGap: string, estimatedRevenueLift: string}. Focus on revenue impact, not vanity metrics. Be specific to their category and city.",
      JSON.stringify(p)
    );
    const audit = await prisma.audit.create({
      data: {
        prospectId: p.id,
        findings: JSON.stringify(data.findings || []),
        recommendations: JSON.stringify(data.recommendations || []),
        competitorGap: data.competitorGap || null,
      },
    });
    return NextResponse.json({ audit, ...data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}