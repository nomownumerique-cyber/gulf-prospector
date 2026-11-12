export function weaknessScore(p: any): number {
  let s = 0;
  if (!p.hasWebsite && !p.website) s += 40;
  if (!p.hasSocial && !p.instagram && !p.facebook && !p.tiktok) s += 20;
  const rc = p.reviewsCount ?? 0;
  if (rc >= 20 && rc <= 500) s += 20;
  if ((p.rating ?? 0) >= 4.0) s += 10;
  if (!p.phone) s += 5;
  // no email field; assume no email unless website? add 5 if no website
  if (!p.website) s += 5;
  return Math.min(100, s);
}
export function payAbilityScore(p: any): number {
  let s = 0;
  const rc = p.reviewsCount ?? 0;
  if (rc > 100) s += 30; else if (rc > 50) s += 15;
  if ((p.rating ?? 0) > 4.5) s += 20;
  const cat = (p.category || "").toLowerCase();
  if (cat.includes("restaurant") || cat.includes("clinic") || cat.includes("dental")) s += 20;
  else if (cat.includes("boutique") || cat.includes("retail") || cat.includes("shop")) s += 10;
  if (p.website) s += 10;
  return Math.min(100, s);
}
export function combined(w: number, pa: number): number {
  return Math.round(w * 0.6 + pa * 0.4);
}