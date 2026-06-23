"use client";

import { useLocale } from "@/components/LocaleProvider";
import { getTemplateConfig, type TemplateSlotId } from "@/lib/template-slots";
import type { TemplateId } from "@/lib/templates";

type Props = {
  templateId: TemplateId;
  filled: Partial<Record<TemplateSlotId, boolean>>;
};

export function TemplateSlotChecklist({ templateId, filled }: Props) {
  const { m } = useLocale();
  const slots = getTemplateConfig(templateId).slots;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium text-slate-700">{m.wizard.templateChecklistLabel}</p>
      <ul className="mt-2 space-y-1">
        {slots.map((slot) => {
          const ok = filled[slot.id] ?? false;
          return (
            <li key={slot.id} className="flex items-center gap-2 text-xs text-slate-600">
              <span className={ok ? "text-emerald-600" : slot.required ? "text-amber-600" : "text-slate-400"}>
                {ok ? "✓" : slot.required ? "!" : "○"}
              </span>
              {m.wizard.templateSlots[slot.id]}
              {slot.required && !ok && (
                <span className="text-amber-600">({m.wizard.templateSlotRequired})</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
