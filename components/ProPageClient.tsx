"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocale } from "@/components/LocaleProvider";

export function ProPageClient() {
  const { m } = useLocale();

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-[radial-gradient(circle_at_top,_#ecfeff_0%,_#f8fafc_35%,_#f1f5f9_100%)] px-4 py-10 text-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <img src="/alchemy-logo.png" alt="alchemy.ai logo" className="h-7 w-7 rounded-md object-contain" />
          <span className="text-sm font-semibold">alchemy.ai</span>
        </div>
        <LanguageToggle variant="light" />
      </div>
      <Link href="/studio" className="text-sm text-emerald-400 hover:text-emerald-300">
        {m.pro.back}
      </Link>
      <h1 className="mt-6 text-2xl font-semibold text-slate-900">{m.pro.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{m.pro.body}</p>
      <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-700">
        ~/Desktop/seadance-video
      </p>
      <p className="mt-4 text-sm text-slate-500">{m.pro.footnote}</p>
    </main>
  );
}
