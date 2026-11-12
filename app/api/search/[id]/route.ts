import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRun, getDatasetItems } from "@/lib/apify";
import { weaknessScore, payAbilityScore } from "@/lib/scoring";
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const search = await prisma.search.findUnique({ where: { id: params.id } });
  if (!search) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (search.status === "completed" || search.status === "failed") {
    const prospects = await prisma.prospect.findMany({ where: { searchId: search.id } });
    return NextResponse.json({ search, prospects });
  }
  if (!search.apifyRunId) return NextResponse.json({ search, prospects: [] });
  try {
    const run = await getRun(search.apifyRunId);
    const status = run?.data?.status;
    if (status === "SUCCEEDED") {
      const datasetId = run?.data?.defaultDatasetId;
      const items = await getDatasetItems(datasetId);
      const prospects = [];
      for (const it of items) {
        const hasWebsite = !!it.website;
        const hasSocial = !!(it.instagram || it.facebook || it.tiktok);
        const p = await prisma.prospect.create({
          data: {
            name: it.title || it.name || "Unknown",
            category: search.category,
            city: search.city,
            country: search.country,
            address: it.address,
            phone: it.phone,
            website: it.website,
            instagram: it.instagram,
            facebook: it.facebook,
            tiktok: it.tiktok,
            rating: it.totalScore ?? it.rating,
            reviewsCount: it.reviewsCount,
            hasWebsite,
            hasSocial,
            searchId: search.id,
          },
        });
        const w = weaknessScore(p);
        const pa = payAbilityScore(p);
        await prisma.prospect.update({ where: { id: p.id }, data: { weaknessScore: w, payAbilityScore: pa } });
        prospects.push({ ...p, weaknessScore: w, payAbilityScore: pa });
      }
      await prisma.search.update({ where: { id: search.id }, data: { status: "completed", resultsCount: prospects.length } });
      return NextResponse.json({ search: { ...search, status: "completed", resultsCount: prospects.length }, prospects });
    }
    if (status === "FAILED" || status === "ABORTED") {
      await prisma.search.update({ where: { id: search.id }, data: { status: "failed" } });
      return NextResponse.json({ search: { ...search, status: "failed" }, prospects: [] });
    }
    return NextResponse.json({ search, prospects: [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, search, prospects: [] }, { status: 500 });
  }
}