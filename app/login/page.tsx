"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (res.ok) router.push("/"); else setErr("Mot de passe incorrect");
  }
  return (
    <div className="max-w-sm mx-auto mt-24 card">
      <h1 className="text-2xl font-bold mb-4 text-[#D4AF37]">Sahm Prospector</h1>
      <form onSubmit={submit} className="space-y-3">
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Mot de passe" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" />
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button className="btn btn-teal w-full">Se connecter</button>
      </form>
    </div>
  );
}