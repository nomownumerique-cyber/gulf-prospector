import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const country = url.searchParams.get("country");
  const category = url.searchParams.get("category");
  const status = url.searchParams.get("status");
  const minScore = url.searchParams.get("minScore");
  const search = url.searchParams.get("search");
  const where: any = {};
  if (country) where.country = country;
  if (category) where.category = category;
  if (status) where.status = status;
  if (minScore) where.weaknessScore = { gte: Number(minScore) };
  if (search) where.name = { contains: search };
  const prospects = await prisma.prospect.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(prospects);
}