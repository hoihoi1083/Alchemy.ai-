import type { BrandProfile } from "@/lib/brand-profile";
import { brandProfilePromptBlock } from "@/lib/brand-profile";
import { callDeepSeekChat } from "@/lib/deepseek-client";
import { parseLlmJsonObject } from "@/lib/parse-llm-json";
import { VIDEO_BGM_HINT } from "@/lib/templates";

export type VideoPromptPlan = {
  videoPrompt: string;
  motionSummary: string;
  suggestedHeadline: string;
  /** How to achieve multi-beat stories (CapCut, ref MP4, dual frame) — user-facing. */
  productionNotes: string;
};

function normalizeVideoPromptPlan(parsed: Partial<VideoPromptPlan>): VideoPromptPlan {
  const videoPrompt = String(parsed.videoPrompt ?? "").trim();
  if (!videoPrompt) throw new Error("DeepSeek returned an empty video prompt.");
  return {
    videoPrompt,
    motionSummary: String(parsed.motionSummary ?? "").trim(),
    suggestedHeadline: String(parsed.suggestedHeadline ?? "").trim(),
    productionNotes: String(parsed.productionNotes ?? "").trim(),
  };
}

function finishVideoPrompt(videoPrompt: string): string {
  if (!videoPrompt.includes("no on-screen") && !videoPrompt.includes("No on-screen")) {
    return `${videoPrompt} No on-screen text, subtitles, logos, or watermarks.${VIDEO_BGM_HINT}`;
  }
  if (!videoPrompt.includes("instrumental")) {
    return `${videoPrompt}${VIDEO_BGM_HINT}`;
  }
  return videoPrompt;
}

function buildBrandPlanPrompt(input: {
  brandProfile: BrandProfile;
  product: string;
  business: string;
  headline: string;
  subline: string;
  offer: string;
  duration: string;
  hasReferenceVideo: boolean;
}): string {
  return [
    "Write a Seedance image-to-video prompt for a small-business social Reel ad.",
    "Return JSON only — no markdown fences.",
    '{"videoPrompt":"","motionSummary":"","suggestedHeadline":"","productionNotes":""}',
    "",
    "Rules for videoPrompt:",
    "- English prompt for Seedance API (model understands English best).",
    "- Describe MOTION and CAMERA only — slow push-in, gentle sparkle, stable commercial pacing.",
    "- Match brand mood, colors, and product category from brand DNA below.",
    "- The user's product photo will be @Image1 — keep same product identity, do not morph item.",
    "- NO on-screen text, subtitles, logos, watermarks, speech, or lyrics.",
    "- 6–10 second commercial reel feel, smooth and stable (not chaotic).",
    input.hasReferenceVideo
      ? "- User will also attach a reference MP4 — mention matching @Video1 pacing if natural, but product stays @Image1."
      : "- Single keyframe image-to-video — animate the hero product/scene subtly.",
    "- Do NOT describe static poster layout or typography — this is VIDEO motion.",
    "",
    "- motionSummary: one line for the user in Traditional Chinese if HK/TW brand, else English.",
    "- suggestedHeadline: optional hook line for the ad (match brand tone).",
    "- productionNotes: empty string unless multi-step advice is needed.",
    "",
    `Target duration hint: ${input.duration} seconds.`,
    input.product ? `Product: ${input.product}` : "",
    input.business ? `Business: ${input.business}` : "",
    input.headline ? `User headline: ${input.headline}` : "",
    input.subline ? `Selling points: ${input.subline}` : "",
    input.offer ? `Offer: ${input.offer}` : "",
    brandProfilePromptBlock(input.brandProfile),
  ]
    .filter(Boolean)
    .join("\n");
}

function buildCreativePlanPrompt(input: {
  creativeBrief: string;
  product: string;
  business: string;
  headline: string;
  subline: string;
  offer: string;
  duration: string;
  hasReferenceVideo: boolean;
}): string {
  return [
    "Write a Seedance video prompt from the user's CREATIVE brief for a product Reel.",
    "Return JSON only — no markdown fences.",
    '{"videoPrompt":"","motionSummary":"","suggestedHeadline":"","productionNotes":""}',
    "",
    "IMPORTANT LIMITS (honest):",
    "- Seedance makes ONE short clip (~4–15s), not a full movie.",
    "- @Image1 is the user's product/keyframe photo — product identity must stay consistent.",
    "- Complex multi-scene stories (e.g. fight many people THEN drink) cannot fit in one clip.",
    "- Pick the strongest SINGLE beat that fits the duration, OR describe motion that matches a reference MP4 if user will attach one.",
  "",
    "Rules for videoPrompt (English for Seedance):",
    "- Describe camera movement, action mood, pacing, lighting shifts, and how the product appears/moves.",
    "- If the brief is action-heavy, use cinematic motion words (dynamic orbit, whip pan, slow-mo hero beat) but stay achievable in one clip.",
    "- If user will attach @Video1, write prompt to align with reference pacing and scene structure; product from @Image1.",
    "- Avoid identifiable celebrity faces; silhouettes, back view, or hands-only are OK if brief needs people.",
    "- NO on-screen text, subtitles, logos, watermarks, speech, or lyrics.",
    "",
    "productionNotes (Traditional Chinese for HK/TW users, else English):",
    "- If the brief has MULTIPLE story beats, explain clearly:",
    "  (1) this prompt covers which single beat;",
    "  (2) for full story: use reference MP4 for action, or generate start+end images and dual-frame mode, or edit clips in CapCut;",
    "  (3) be practical, not overpromising.",
    "",
    "- motionSummary: one line what this clip will feel like.",
    "- suggestedHeadline: optional ad hook matching the creative idea.",
    "",
    `Target duration: ${input.duration} seconds.`,
    `Creative brief: ${input.creativeBrief}`,
    input.product ? `Product: ${input.product}` : "",
    input.business ? `Business: ${input.business}` : "",
    input.headline ? `User headline: ${input.headline}` : "",
    input.subline ? `Selling points: ${input.subline}` : "",
    input.offer ? `Offer: ${input.offer}` : "",
    input.hasReferenceVideo
      ? "User WILL attach a reference MP4 (@Video1)."
      : "User will NOT attach a reference MP4 — single keyframe image-to-video.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function planVideoPrompt(input: {
  brandProfile: BrandProfile;
  product?: string;
  business?: string;
  headline?: string;
  subline?: string;
  offer?: string;
  duration?: string;
  hasReferenceVideo?: boolean;
}): Promise<VideoPromptPlan> {
  const outputText = await callDeepSeekChat(
    [
      {
        role: "system",
        content:
          "You are a Seedance video prompt engineer for HK/TW/CN SMB marketing Reels. Output valid JSON only.",
      },
      {
        role: "user",
        content: buildBrandPlanPrompt({
          brandProfile: input.brandProfile,
          product: input.product?.trim() || "",
          business: input.business?.trim() || "",
          headline: input.headline?.trim() || "",
          subline: input.subline?.trim() || "",
          offer: input.offer?.trim() || "",
          duration: input.duration?.trim() || "6",
          hasReferenceVideo: Boolean(input.hasReferenceVideo),
        }),
      },
    ],
    { temperature: 0.45, max_tokens: 900, jsonObject: true },
  );

  const plan = normalizeVideoPromptPlan(
    parseLlmJsonObject<Partial<VideoPromptPlan>>(outputText, "Video prompt plan"),
  );
  plan.videoPrompt = finishVideoPrompt(plan.videoPrompt);
  return plan;
}

export async function planCreativeVideoPrompt(input: {
  creativeBrief: string;
  product?: string;
  business?: string;
  headline?: string;
  subline?: string;
  offer?: string;
  duration?: string;
  hasReferenceVideo?: boolean;
}): Promise<VideoPromptPlan> {
  const brief = input.creativeBrief?.trim() || "";
  if (!brief) throw new Error("Describe your creative video idea first.");

  const outputText = await callDeepSeekChat(
    [
      {
        role: "system",
        content:
          "You are a Seedance creative video prompt engineer. Output valid JSON only. Be honest about single-clip limits; help users achieve ambitious ideas via practical production notes.",
      },
      {
        role: "user",
        content: buildCreativePlanPrompt({
          creativeBrief: brief,
          product: input.product?.trim() || "",
          business: input.business?.trim() || "",
          headline: input.headline?.trim() || "",
          subline: input.subline?.trim() || "",
          offer: input.offer?.trim() || "",
          duration: input.duration?.trim() || "6",
          hasReferenceVideo: Boolean(input.hasReferenceVideo),
        }),
      },
    ],
    { temperature: 0.55, max_tokens: 1200, jsonObject: true },
  );

  const plan = normalizeVideoPromptPlan(
    parseLlmJsonObject<Partial<VideoPromptPlan>>(outputText, "Creative video plan"),
  );
  plan.videoPrompt = finishVideoPrompt(plan.videoPrompt);
  return plan;
}
