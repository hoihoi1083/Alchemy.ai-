"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { ImageOutputMode } from "@/lib/image-output-mode";

type Props = {
  value: ImageOutputMode;
  onChange: (mode: ImageOutputMode) => void;
  lockedCampaign?: boolean;
};

export function ImageOutputModePicker({ value, onChange, lockedCampaign }: Props) {
  const { m } = useLocale();
  const options: ImageOutputMode[] = lockedCampaign
    ? ["campaign"]
    : ["single", "ab", "campaign"];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-300">{m.wizard.imageOutputModeLabel}</p>
      <p className="text-xs text-slate-500">{m.wizard.imageOutputModeHint}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((mode) => {
          const copy = m.wizard.imageOutputModes[mode];
          return (
            <button
              key={mode}
              type="button"
              onClick={() => !lockedCampaign && onChange(mode)}
              disabled={lockedCampaign && mode !== "campaign"}
              className={`rounded-xl border p-3 text-left transition ${
                value === mode
                  ? "border-emerald-500/60 bg-emerald-950/40"
                  : "border-slate-800 bg-slate-900/40 hover:border-slate-600"
              } ${lockedCampaign ? "cursor-default" : ""}`}
            >
              <p className="text-sm font-semibold text-white">{copy.title}</p>
              <p className="mt-1 text-xs text-slate-400">{copy.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
