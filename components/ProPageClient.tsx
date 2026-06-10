"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocale } from "@/components/LocaleProvider";

export function ProPageClient() {
  const { m } = useLocale();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex justify-end">
        <LanguageToggle />
      </div>
      <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300">
        {m.pro.back}
      </Link>
      <h1 className="mt-6 text-2xl font-semibold text-white">{m.pro.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{m.pro.body}</p>
      <p className="mt-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 font-mono text-sm text-slate-300">
        ~/Desktop/seadance-video
      </p>
      <p className="mt-4 text-sm text-slate-500">{m.pro.footnote}</p>
    </main>
  );
}
