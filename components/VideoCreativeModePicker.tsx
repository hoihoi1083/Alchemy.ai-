"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { VideoCreativeMode } from "@/lib/creative-workflow";
import { videoModesForGoal } from "@/lib/creative-workflow";
import type { OutputGoal } from "@/lib/creative-workflow";

type Props = {
  goal: OutputGoal;
  value: VideoCreativeMode;
  onChange: (mode: VideoCreativeMode) => void;
};

const ICONS: Record<VideoCreativeMode, string> = {
  "product-promo": "📦",
  "reference-concept": "🎬",
  "image-to-video": "📷→🎬",
};

export function VideoCreativeModePicker({ goal, value, onChange }: Props) {
  const { m } = useLocale();
  const modes = videoModesForGoal(goal);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-300">{m.wizard.videoCreativeLabel}</p>
      <div className="grid gap-2">
        {modes.map((id) => {
          const copy = m.wizard.videoCreativeModes[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`rounded-xl border p-4 text-left transition ${
                value === id
                  ? "border-emerald-500/60 bg-emerald-950/40"
                  : "border-slate-800 bg-slate-900/40 hover:border-slate-600"
              }`}
            >
              <span className="mr-2 text-xl">{ICONS[id]}</span>
              <span className="text-sm font-semibold text-white">{copy.title}</span>
              <p className="mt-1 text-xs text-slate-400">{copy.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
