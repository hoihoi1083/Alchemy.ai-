"use client";

import { useLocale } from "@/components/LocaleProvider";
import {
  visualStylesForWorkflow,
  type VisualStyleId,
} from "@/lib/visual-styles";
import type { WorkflowMode } from "@/lib/workflow-mode";

type Props = {
  value: VisualStyleId;
  onChange: (id: VisualStyleId) => void;
  workflowMode: WorkflowMode;
};

export function VisualStylePicker({ value, onChange, workflowMode }: Props) {
  const { m } = useLocale();
  const styles = visualStylesForWorkflow(workflowMode);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-300">{m.wizard.visualStyleLabel}</p>
      <p className="text-xs text-slate-500">
        {workflowMode === "video-only"
          ? m.wizard.visualStyleHintVideoOnly
          : m.wizard.visualStyleHint}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {styles.map((s) => {
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
