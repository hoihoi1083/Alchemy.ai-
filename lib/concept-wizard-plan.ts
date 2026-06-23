import { callDeepSeekChat } from "@/lib/deepseek-client";
import { parseLlmJsonObject } from "@/lib/parse-llm-json";
import type { PromptMarket } from "@/lib/prompts";

export type ConceptWizardDraft = {
  audience: string;
  painPoint: string;
  promise: string;
  proof: string;
  cta: string;
  visualMetaphor: string;
};

type PlanConceptInput = {
  conceptIdea?: string;
  product?: string;
  business?: string;
  headline?: string;
  subline?: string;
  offer?: string;
  promptExtra?: string;
  visualStyleId?: string;
  workflowMode?: "image-only" | "video-only" | "combined";
  market?: PromptMarket;
  referenceImageVision?: string;
  hasReferenceImage?: boolean;
};

function normalizeDraft(parsed: Partial<ConceptWizardDraft>): ConceptWizardDraft {
  return {
    audience: String(parsed.audience ?? "").trim(),
    painPoint: String(parsed.painPoint ?? "").trim(),
    promise: String(parsed.promise ?? "").trim(),
    proof: String(parsed.proof ?? "").trim(),
    cta: String(parsed.cta ?? "").trim(),
    visualMetaphor: String(parsed.visualMetaphor ?? "").trim(),
  };
}

function buildConceptPrompt(input: PlanConceptInput): string {
  const appLikeSignals = [
    input.conceptIdea,
    input.product,
    input.business,
    input.headline,
    input.subline,
    input.offer,
    input.promptExtra,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const allowAppFraming =
    /\bapp\b|website|web site|saas|software|platform|landing page|url|download|signup|sign up|註冊|注册|網站|网站|應用程式|应用|小程序/.test(
      appLikeSignals,
    );
  return [
    "You are a direct-response marketing strategist for service/concept campaigns.",
    "Given the context, output one concise concept brief for social ad generation.",
    "Return valid JSON only. No markdown.",
    "",
    'Required JSON keys: {"audience":"","painPoint":"","promise":"","proof":"","cta":"","visualMetaphor":""}',
    "",
    "Rules:",
    "- Keep each field short and concrete (1-2 lines max).",
    "- No fake metrics, no invented legal claims, no medical guarantees.",
    "- Make CTA actionable and specific, but ONLY using user-provided facts.",
    "- Do NOT invent new mechanics such as pre-pay, lock-in, booking policy, membership, coupon, app flow, or payment method unless explicitly stated by user.",
    "- If the user only states a fee increase fact, keep CTA generic (e.g. check notice, plan parking today) and do not create extra policy details.",
    "- visualMetaphor should describe scene/mood objects the image/video model can render.",
    "- PRESERVE the user's creative hook (e.g. one-vs-many, mecha, metaphor) — do NOT replace it with unrelated generic stock imagery.",
    "- If user mentions anime/mecha/Gundam-style: describe as original anime-style giant mecha robot scene (no trademark names, no official logos).",
    "- If user wants an exciting setup but anti-violence message: visualMetaphor must be ONE frozen scene (standoff, lowered weapons, calm after tension) — not a full battle montage.",
    input.workflowMode === "video-only"
      ? "- Video-only: visualMetaphor must be a single 6–8s renderable shot Seedance can animate."
      : "",
    input.hasReferenceImage
      ? "- User uploaded a reference image. visualMetaphor must align with what is visible in that image; suggest motion that animates the still without changing its core message."
      : "",
    input.referenceImageVision
      ? `- Reference image analysis (must respect): ${input.referenceImageVision}`
      : "",
    allowAppFraming
      ? "- App/website framing is allowed when relevant to user intent."
      : "- Do NOT invent app/software/phone-UI framing. Keep concept grounded in physical scene cues unless user explicitly asked for app/website.",
    allowAppFraming
      ? ""
      : "- Avoid terms like app, download, interface, dashboard, signup, or mobile screen in promise/cta/metaphor.",
    "- Respect provided language market context.",
    "",
    `Market: ${input.market || "hk"}`,
    `Workflow: ${input.workflowMode || "image-only"}`,
    `Visual style: ${input.visualStyleId || "service-promo"}`,
    input.conceptIdea ? `User concept idea: ${input.conceptIdea}` : "",
    input.product ? `Service / product name: ${input.product}` : "",
    input.business ? `Brand / business: ${input.business}` : "",
    input.headline ? `Current headline hint: ${input.headline}` : "",
    input.subline ? `Current subline hint: ${input.subline}` : "",
    input.offer ? `Current offer hint: ${input.offer}` : "",
    input.promptExtra ? `Additional requirements: ${input.promptExtra}` : "",
    "",
    "Source facts (must not be expanded beyond these):",
    `- Headline: ${input.headline || "(none)"}`,
    `- Subline: ${input.subline || "(none)"}`,
    `- Offer: ${input.offer || "(none)"}`,
    `- Concept idea: ${input.conceptIdea || "(none)"}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function planConceptWizard(
  input: PlanConceptInput,
): Promise<ConceptWizardDraft> {
  const outputText = await callDeepSeekChat(
    [
      {
        role: "system",
        content:
          "You write practical concept briefs for SMB social ads. Output strict JSON only.",
      },
      { role: "user", content: buildConceptPrompt(input) },
    ],
    { temperature: 0.45, max_tokens: 1000, jsonObject: true },
  );

  return normalizeDraft(
    parseLlmJsonObject<Partial<ConceptWizardDraft>>(outputText, "Concept wizard plan"),
  );
}

