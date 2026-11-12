import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Dashboard() {
  const total = await prisma.prospect.count();
  const highWeak = await prisma.prospect.count({ where: { weaknessScore: { gte: 70 } } });
  const contacted = await prisma.prospect.count({ where: { status: "contacted" } });
  const won = await prisma.prospect.count({ where: { status: "won" } });
  const recent = await prisma.prospect.findMany({ orderBy: { createdAt: "desc" }, take: 10 });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card"><div className="text-sm opacity-70">Total prospects</div><div className="text-3xl font-bold">{total}</div></div>
        <div className="card"><div className="text-sm opacity-70">Haute faiblesse</div><div className="text-3xl font-bold text-red-400">{highWeak}</div></div>
        <div className="card"><div className="text-sm opacity-70">Contactés</div><div className="text-3xl font-bold text-amber-400">{contacted}</div></div>
        <div className="card"><div className="text-sm opacity-70">Gagnés</div><div className="text-3xl font-bold text-[#00C9A7]">{won}</div></div>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-3">Prospects récents</h2>
        <table className="w-full text-sm">
          <thead><tr className="opacity-60"><th className="text-start">Nom</th><th>Ville</th><th>Catégorie</th><th>Score faiblesse</th></tr></thead>
          <tbody>
            {recent.map((p) => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="py-2"><a href={`/prospects/${p.id}`} className="text-[#D4AF37]">{p.name}</a></td>
                <td>{p.city}</td><td>{p.category}</td><td>{p.weaknessScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4"><a href="/search" className="btn btn-teal inline-block">Nouvelle recherche</a></div>
    </div>
  );
}