import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
export const metadata: Metadata = { title: "Sahm Prospector" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <div className="flex min-h-screen">
          <aside className="w-56 border-e border-white/10 p-4 hidden md:block">
            <h1 className="text-xl font-bold text-[#D4AF37] mb-6">Sahm Prospector</h1>
            <nav className="space-y-2">
              <Link href="/" className="block px-3 py-2 rounded-lg hover:bg-white/5">Dashboard</Link>
              <Link href="/search" className="block px-3 py-2 rounded-lg hover:bg-white/5">Search</Link>
              <Link href="/prospects" className="block px-3 py-2 rounded-lg hover:bg-white/5">Prospects</Link>
            </nav>
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}