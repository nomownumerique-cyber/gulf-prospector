"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
export default function ProspectDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [p, setP] = useState<any>(null);
  const [audits, setAudits] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  async function load() {
    const r = await fetch(`/api/prospects/${id}`);
    const d = await r.json();
    setP(d); setAudits(d.audits || []); setDrafts(d.emailDrafts || []);
  }
  useEffect(() => { if (id) load(); }, [id]);
  async function analyze() {
    setMsg("Analyse...");
    const r = await fetch(`/api/prospects/${id}/analyze`, { method: "POST" });
    const d = await r.json();
    if (r.ok) { setMsg("Audit prêt"); load(); } else setMsg("Erreur: " + d.error);
  }
  async function email() {
    setMsg("Rédaction...");
    const r = await fetch(`/api/prospects/${id}/email`, { method: "POST" });
    const d = await r.json();
    if (r.ok) { setMsg("Email prêt"); load(); } else setMsg("Erreur: " + d.error);
  }
  async function updateStatus(s: string) {
    await fetch(`/api/prospects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: s }) });
    load();
  }
  if (!p) return <div>Chargement...</div>;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{p.name}</h1>
      <div className="card mb-4">
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <div>Ville: {p.city}, {p.country}</div>
          <div>Catégorie: {p.category}</div>
          <div>Téléphone: {p.phone || "-"}</div>
          <div>Site: {p.website || "Aucun"}</div>
          <div>Instagram: {p.instagram || "-"}</div>
          <div>Facebook: {p.facebook || "-"}</div>
          <div>TikTok: {p.tiktok || "-"}</div>
          <div>Note: {p.rating ?? "-"} ({p.reviewsCount ?? 0} avis)</div>
          <div>Score faiblesse: {p.weaknessScore}</div>
          <div>Score paiement: {p.payAbilityScore}</div>
        </div>
        <div className="mt-3">
          <label className="text-sm mr-2">Statut:</label>
          <select value={p.status} onChange={(e) => updateStatus(e.target.value)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">
            {["new","contacted","replied","won","lost"].map((s)=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3 mb-4">
        <button onClick={analyze} className="btn btn-gold">Générer audit</button>
        <button onClick={email} className="btn btn-teal">Générer email</button>
      </div>
      {msg && <p className="text-sm mb-4">{msg}</p>}
      {audits.map((a:any)=>(
        <div key={a.id} className="card mb-4">
          <h3 className="font-semibold mb-2">Audit</h3>
          <div className="text-sm"><strong>Constats:</strong><ul className="list-disc ms-5">{JSON.parse(a.findings).map((f:string,i:number)=><li key={i}>{f}</li>)}</ul></div>
          <div className="text-sm mt-2"><strong>Recommandations:</strong><ul className="list-disc ms-5">{JSON.parse(a.recommendations).map((r:string,i:number)=><li key={i}>{r}</li>)}</ul></div>
          {a.competitorGap && <div className="text-sm mt-2"><strong>Écart concurrentiel:</strong> {a.competitorGap}</div>}
        </div>
      ))}
      {drafts.map((d:any)=>(
        <div key={d.id} className="card mb-4">
          <h3 className="font-semibold mb-2">Sujet: {d.subject}</h3>
          <div className="text-sm mb-2"><strong>Arabe:</strong><pre className="whitespace-pre-wrap">{d.bodyAr}</pre></div>
          <div className="text-sm"><strong>Anglais:</strong><pre className="whitespace-pre-wrap">{d.bodyEn}</pre></div>
        </div>
      ))}
    </div>
  );
}