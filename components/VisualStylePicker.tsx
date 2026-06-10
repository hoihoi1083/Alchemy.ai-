"use client";

import { useLocale } from "@/components/LocaleProvider";
import { VISUAL_STYLES, type VisualStyleId } from "@/lib/visual-styles";

type Props = {
  value: VisualStyleId;
  onChange: (id: VisualStyleId) => void;
};

export function VisualStylePicker({ value, onChange }: Props) {
  const { m } = useLocale();

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-300">{m.wizard.visualStyleLabel}</p>
      <p className="text-xs text-slate-500">{m.wizard.visualStyleHint}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {VISUAL_STYLES.map((s) => {
          const copy = m.wizard.visualStyles[s.id];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              className={`rounded-xl border p-3 text-left transition ${
                value === s.id
                  ? "border-emerald-500/60 bg-emerald-950/40"
                  : "border-slate-800 bg-slate-900/40 hover:border-slate-600"
              }`}
            >
              <span className="text-lg">{s.icon}</span>
              <p className="mt-2 text-sm font-semibold text-white">{copy.title}</p>
              <p className="mt-1 text-xs text-slate-400">{copy.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
