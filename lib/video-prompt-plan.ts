import type { BrandProfile } from "@/lib/brand-profile";
import { brandProfilePromptBlock } from "@/lib/brand-profile";
import { callDeepSeekChat } from "@/lib/deepseek-client";
import { VIDEO_BGM_HINT } from "@/lib/templates";

export type VideoPromptPlan = {
  videoPrompt: string;
  motionSummary: string;
  suggestedHeadline: string;
};

function extractJsonObject(raw: string): VideoPromptPlan {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Video prompt plan returned invalid JSON.");
  const parsed = JSON.parse(raw.slice(start, end + 1)) as Partial<VideoPromptPlan>;
  const videoPrompt = String(parsed.videoPrompt ?? "").trim();
  if (!videoPrompt) throw new Error("DeepSeek returned an empty video prompt.");
  return {
    videoPrompt,
    motionSummary: String(parsed.motionSummary ?? "").trim(),
    suggestedHeadline: String(parsed.suggestedHeadline ?? "").trim(),
  };
}

function buildPlanPrompt(input: {
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
    '{"videoPrompt":"","motionSummary":"","suggestedHeadline":""}',
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
        content: buildPlanPrompt({
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
    { temperature: 0.45, max_tokens: 900 },
  );

  const plan = extractJsonObject(outputText);
  if (!plan.videoPrompt.includes("no on-screen") && !plan.videoPrompt.includes("No on-screen")) {
    plan.videoPrompt = `${plan.videoPrompt} No on-screen text, subtitles, logos, or watermarks.${VIDEO_BGM_HINT}`;
  } else if (!plan.videoPrompt.includes("instrumental")) {
    plan.videoPrompt = `${plan.videoPrompt}${VIDEO_BGM_HINT}`;
  }
  return plan;
}
