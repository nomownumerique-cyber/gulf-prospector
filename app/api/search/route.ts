import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runGooglePlaces } from "@/lib/apify";
export async function POST(req: Request) {
  const { country, city, category, maxResults } = await req.json();
  const search = await prisma.search.create({ data: { query: `${category} ${city} ${country}`, country, city, category, maxResults: maxResults || 50, status: "running" } });
  try {
    const r = await runGooglePlaces([category], `${city}, ${country}`, maxResults || 50);
    const runId = r?.data?.id;
    await prisma.search.update({ where: { id: search.id }, data: { apifyRunId: runId } });
    return NextResponse.json({ searchId: search.id, runId });
  } catch (e: any) {
    await prisma.search.update({ where: { id: search.id }, data: { status: "failed" } });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}