"use client";

import type { WorkflowStepKey } from "@/lib/workflow-mode";

type WizardMobileBarProps = {
  stepKey: WorkflowStepKey;
  continueSetupLabel: string;
  imageFinishLabel: string;
  backLabel: string;
  generateVideoLabel: string;
  phaseVideoLabel: string;
  imageNextDisabled: boolean;
  videoGenerateDisabled: boolean;
  videoBusy: boolean;
  onSetupNext: () => void;
  onImageBack: () => void;
  onImageNext: () => void;
  onVideoBack: () => void;
  onGenerateVideo: () => void;
};

export function WizardMobileBar({
  stepKey,
  continueSetupLabel,
  imageFinishLabel,
  backLabel,
  generateVideoLabel,
  phaseVideoLabel,
  imageNextDisabled,
  videoGenerateDisabled,
  videoBusy,
  onSetupNext,
  onImageBack,
  onImageNext,
  onVideoBack,
  onGenerateVideo,
}: WizardMobileBarProps) {
  if (stepKey !== "setup" && stepKey !== "image" && stepKey !== "video") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950/90 p-3 backdrop-blur md:hidden">
      {stepKey === "setup" && (
        <button
          type="button"
          onClick={onSetupNext}
          className="w-full rounded-xl bg-linear-to-r from-cyan-500 via-emerald-500 to-teal-500 py-3 text-sm font-semibold text-white shadow-[0_0_22px_rgba(16,185,129,0.35)]"
        >
          {continueSetupLabel}
        </button>
      )}
      {stepKey === "image" && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onImageBack}
            className="rounded-xl border border-slate-600 px-4 py-3 text-sm text-slate-200"
          >
            {backLabel}
          </button>
          <button
            type="button"
            disabled={imageNextDisabled}
            onClick={onImageNext}
            className="flex-1 rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 py-3 text-sm font-semibold text-white shadow-[0_0_22px_rgba(16,185,129,0.35)] disabled:opacity-40"
          >
            {imageFinishLabel}
          </button>
        </div>
      )}
      {stepKey === "video" && (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={videoBusy}
            onClick={onVideoBack}
            className="rounded-xl border border-slate-600 px-4 py-3 text-sm text-slate-200 disabled:opacity-50"
          >
            {backLabel}
          </button>
          <button
            type="button"
            disabled={videoGenerateDisabled}
            onClick={onGenerateVideo}
            className="flex-1 rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 py-3 text-sm font-semibold text-white shadow-[0_0_22px_rgba(16,185,129,0.35)] disabled:opacity-40"
          >
            {videoBusy ? phaseVideoLabel : generateVideoLabel}
          </button>
        </div>
      )}
    </div>
  );
}
