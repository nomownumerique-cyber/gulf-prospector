import OpenAI from "openai";
export function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
export async function chatJSON(system: string, user: string) {
  const client = getOpenAI();
  if (!client) throw new Error("OPENAI_API_KEY missing");
  const res = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: system }, { role: "user", content: user }],
    response_format: { type: "json_object" },
  });
  const txt = res.choices[0]?.message?.content || "{}";
  return JSON.parse(txt);
}