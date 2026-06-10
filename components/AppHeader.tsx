"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocale } from "@/components/LocaleProvider";

export function AppHeader() {
  const { m } = useLocale();

  return (
    <header className="mb-8 text-center">
      <div className="mb-4 flex justify-center">
        <LanguageToggle />
      </div>
      <p className="text-sm font-medium tracking-wide text-emerald-400/90">{m.header.badge}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {m.header.title}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-slate-400">
        {m.header.subtitle}
      </p>
      <p className="mt-4 text-xs text-slate-500">
        <Link href="/pro" className="text-emerald-400 underline hover:text-emerald-300">
          {m.header.proLink}
        </Link>
      </p>
    </header>
  );
}
