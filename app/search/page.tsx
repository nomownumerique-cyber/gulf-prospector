"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SearchPage() {
  const [country, setCountry] = useState("UAE");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("restaurants");
  const [maxResults, setMaxResults] = useState(50);
  const [status, setStatus] = useState("");
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Lancement...");
    const res = await fetch("/api/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ country, city, category, maxResults }) });
    const data = await res.json();
    if (!res.ok) { setStatus("Erreur: " + data.error); return; }
    setStatus("En cours...");
    const poll = async () => {
      const r = await fetch(`/api/search/${data.searchId}`);
      const d = await r.json();
      if (d.search?.status === "completed") { setStatus(`Terminé: ${d.search.resultsCount} prospects`); router.push("/prospects"); }
      else if (d.search?.status === "failed") setStatus("Échec");
      else setTimeout(poll, 3000);
    };
    poll();
  }
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Nouvelle recherche</h1>
      <form onSubmit={submit} className="card space-y-4">
        <div>
          <label className="block text-sm mb-1">Pays</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            {["UAE","KSA","Qatar","Kuwait","Bahrain","Oman"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Ville</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Catégorie</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            {["restaurants","cafés","boutiques","beauty clinics","dental","any"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Max résultats</label>
          <select value={maxResults} onChange={(e) => setMaxResults(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            {[50,100,200].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <button className="btn btn-teal w-full">Lancer</button>
        {status && <p className="text-sm">{status}</p>}
      </form>
    </div>
  );
}