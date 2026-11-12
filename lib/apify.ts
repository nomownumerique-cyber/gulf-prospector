const TOKEN = process.env.APIFY_TOKEN;
const BASE = "https://api.apify.com/v2";
export async function runGooglePlaces(searchStringsArray: string[], locationQuery: string, maxResults: number) {
  if (!TOKEN) throw new Error("APIFY_TOKEN missing");
  const res = await fetch(`${BASE}/acts/compass~crawler-google-places/runs?token=${TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      searchStringsArray,
      locationQuery,
      maxCrawledPlacesPerSearch: maxResults,
      language: "en",
      scrapePlaceDetailPage: true,
      scrapeSocialMediaProfiles: true,
    }),
  });
  if (!res.ok) throw new Error(`Apify run failed: ${res.status}`);
  return res.json();
}
export async function getRun(runId: string) {
  const res = await fetch(`${BASE}/actor-runs/${runId}?token=${TOKEN}`);
  if (!res.ok) throw new Error(`Apify getRun failed: ${res.status}`);
  return res.json();
}
export async function getDatasetItems(datasetId: string) {
  const res = await fetch(`${BASE}/datasets/${datasetId}/items?token=${TOKEN}&clean=true&format=json`);
  if (!res.ok) throw new Error(`Apify dataset failed: ${res.status}`);
  return res.json();
}