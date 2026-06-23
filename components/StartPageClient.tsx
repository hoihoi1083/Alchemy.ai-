"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocale } from "@/components/LocaleProvider";
import { studioHref, type PromotionMode } from "@/lib/promotion-mode";

export function StartPageClient() {
  const { m } = useLocale();

  const cards: Array<{
    mode: PromotionMode;
    title: string;
    description: string;
    examples: string;
    icon: string;
  }> = [
    {
      mode: "physical",
      icon: "📦",
      title: m.start.physicalTitle,
      description: m.start.physicalDesc,
      examples: m.start.physicalExamples,
    },
    {
      mode: "concept",
      icon: "💡",
      title: m.start.conceptTitle,
      description: m.start.conceptDesc,
      examples: m.start.conceptExamples,
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/alchemy-logo.png"
              alt="alchemy.ai logo"
              className="h-9 w-9 rounded-xl object-contain"
            />
            <span className="text-base font-semibold">alchemy.ai</span>
          </Link>
          <LanguageToggle variant="light" />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{m.start.title}</h1>
        <p className="mt-3 text-base text-slate-600">{m.start.subtitle}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.mode}
              href={studioHref(card.mode)}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-emerald-400 hover:bg-emerald-50/40 hover:shadow-md"
            >
              <p className="text-2xl">{card.icon}</p>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
              <p className="mt-3 text-xs text-slate-500">{card.examples}</p>
              <p className="mt-4 text-sm font-semibold text-emerald-700 group-hover:text-emerald-800">
                {m.start.continueLabel} →
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">{m.start.switchLaterHint}</p>
      </section>
    </main>
  );
}
