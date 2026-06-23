"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocale } from "@/components/LocaleProvider";

export function LandingPageClient() {
  const { m } = useLocale();
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/alchemy-logo.png"
              alt="alchemy.ai logo"
              className="h-10 w-10 rounded-xl object-contain"
            />
            <p className="text-lg font-semibold tracking-tight">alchemy.ai</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle variant="light" />
            <Link
              href="/start"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white"
            >
              {m.landing.openStudio}
            </Link>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {m.landing.badge}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{m.landing.title}</h1>
            <p className="mt-5 max-w-xl text-base text-slate-600">{m.landing.subtitle}</p>
            <div className="mt-8 flex gap-3">
              <Link
                href="/start"
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white"
              >
                {m.landing.startCreating}
              </Link>
              <a
                href="/how"
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700"
              >
                {m.landing.howItWorks}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {m.landing.demoItems.map((x) => (
                <div
                  key={x}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
                >
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 sm:grid-cols-3">
          {m.landing.steps.map((s) => (
            <div key={s.no} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold text-slate-400">{s.no}</p>
              <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
