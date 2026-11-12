"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function ProspectsPage() {
  const [list, setList] = useState<any[]>([]);
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [minScore, setMinScore] = useState("");
  useEffect(() => {
    const params = new URLSearchParams();
    if (country) params.set("country", country);
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (minScore) params.set("minScore", minScore);
    fetch("/api/prospects?" + params.toString()).then((r) => r.json()).then(setList);
  }, [country, category, status, minScore]);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Prospects</h1>
      <div className="card mb-4 flex flex-wrap gap-3">
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"><option value="">Tous pays</option>{["UAE","KSA","Qatar","Kuwait","Bahrain","Oman"].map((c)=><option key={c}>{c}</option>)}</select>
        <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Catégorie" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" />
        <select value={status} onChange={(e)=>setStatus(e.target.value)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"><option value="">Tous statuts</option>{["new","contacted","replied","won","lost"].map((s)=><option key={s}>{s}</option>)}</select>
        <input value={minScore} onChange={(e)=>setMinScore(e.target.value)} placeholder="Score min" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" />
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="opacity-60"><th className="text-start">Nom</th><th>Ville</th><th>Pays</th><th>Catégorie</th><th>Faiblesse</th><th>Paiement</th><th>Statut</th></tr></thead>
          <tbody>
            {list.map((p:any)=>(
              <tr key={p.id} className="border-t border-white/5">
                <td className="py-2"><Link href={`/prospects/${p.id}`} className="text-[#D4AF37]">{p.name}</Link></td>
                <td>{p.city}</td><td>{p.country}</td><td>{p.category}</td><td>{p.weaknessScore}</td><td>{p.payAbilityScore}</td><td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}