"use client";

import { useState } from "react";
import { useWizard } from "@/components/studio/WizardContext";

type QuickFixImagePanelProps = {
  variant?: "light" | "dark";
};

export function QuickFixImagePanel({ variant = "dark" }: QuickFixImagePanelProps) {
  const {
    imageBusy,
    m,
    quickFixCredits,
    quickFixImage,
    refineGeneratedImage,
  } = useWizard();
  const [customNote, setCustomNote] = useState("");

  const isDark = variant === "dark";
  const presetClass = isDark
    ? "rounded-lg border border-slate-600 px-3 py-2 text-xs text-slate-200 disabled:opacity-40"
    : "rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 disabled:opacity-40";
  const inputClass = isDark
    ? "w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
    : "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400";
  const applyClass = isDark
    ? "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
    : "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40";
  const panelClass = isDark
    ? "rounded-xl border border-slate-700 bg-slate-900/40 p-4"
    : "rounded-xl border border-emerald-200 bg-emerald-50/60 p-4";
  const titleClass = isDark ? "text-sm font-semibold text-white" : "text-sm font-semibold text-slate-900";
  const hintClass = isDark ? "mt-1 text-xs text-slate-400" : "mt-1 text-xs text-slate-600";
  const creditClass = isDark ? "mt-1 text-xs text-slate-500" : "mt-1 text-xs text-slate-500";

  async function applyCustomFix() {
    const note = customNote.trim();
    if (!note || imageBusy) return;
    await refineGeneratedImage(note);
    setCustomNote("");
  }

  return (
    <div className={panelClass}>
      <p className={titleClass}>{m.wizard.quickFixTitle}</p>
      <p className={hintClass}>{m.wizard.quickFixImageHint}</p>
      <p className={creditClass}>
        {quickFixCredits > 0
          ? m.wizard.quickFixCreditReady.replace("{count}", String(quickFixCredits))
          : m.wizard.quickFixCreditUsed}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          disabled={imageBusy}
          onClick={() => quickFixImage("Improve skin and material realism only.")}
          className={presetClass}
        >
          {m.wizard.quickFixRealism}
        </button>
        <button
          type="button"
          disabled={imageBusy}
          onClick={() => quickFixImage("Remove all on-image text and logos.")}
          className={presetClass}
        >
          {m.wizard.quickFixText}
        </button>
        <button
          type="button"
          disabled={imageBusy}
          onClick={() => quickFixImage("Make the lighting warmer and softer.")}
          className={presetClass}
        >
          {m.wizard.quickFixLighting}
        </button>
      </div>
      <label className={`mt-4 block text-xs font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
        {m.wizard.quickFixCustomLabel}
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void applyCustomFix();
          }}
          placeholder={m.wizard.quickFixCustomPlaceholder}
          className={inputClass}
        />
        <button
          type="button"
          disabled={imageBusy || !customNote.trim()}
          onClick={() => void applyCustomFix()}
          className={`${applyClass} shrink-0`}
        >
          {imageBusy ? m.wizard.quickFixRefining : m.wizard.quickFixApplyBtn}
        </button>
      </div>
    </div>
  );
}
