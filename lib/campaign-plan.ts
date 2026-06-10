import type { BrandProfile } from "@/lib/brand-profile";
import { brandProfilePromptBlock } from "@/lib/brand-profile";
import type { CampaignPlan, CampaignSlidePlan } from "@/lib/campaign-types";
import { CAMPAIGN_SLIDE_COUNT } from "@/lib/campaign-types";
import { callDeepSeekChat } from "@/lib/deepseek-client";
import { getVisualStyle, type VisualStyleId } from "@/lib/visual-styles";

function extractJsonObject(raw: string): CampaignPlan {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Campaign plan returned invalid JSON.");
  const parsed = JSON.parse(raw.slice(start, end + 1)) as Partial<CampaignPlan>;
  const slides = Array.isArray(parsed.slides) ? parsed.slides : [];
  const normalized: CampaignSlidePlan[] = slides
    .slice(0, CAMPAIGN_SLIDE_COUNT)
    .map((s, i) => {
      const role =
        s.role === "hero" || s.role === "selling-points" || s.role === "offer"
          ? s.role
          : (["hero", "selling-points", "offer"] as const)[i];
      return {
        role,
        title: String(s.title ?? "").trim() || defaultSlideTitle(role),
        headline: String(s.headline ?? "").trim(),
        subline: String(s.subline ?? "").trim(),
        composition: String(s.composition ?? "").trim(),
      };
    });

  while (normalized.length < CAMPAIGN_SLIDE_COUNT) {
    const role = (["hero", "selling-points", "offer"] as const)[normalized.length];
    normalized.push({
      role,
      title: defaultSlideTitle(role),
      headline: "",
      subline: "",
      composition: "",
    });
  }

  return {
    theme: String(parsed.theme ?? "").trim(),
    visualDna: String(parsed.visualDna ?? "").trim(),
    slides: normalized,
  };
}

function defaultSlideTitle(role: CampaignSlidePlan["role"]): string {
  if (role === "hero") return "Hero";
  if (role === "selling-points") return "Selling points";
  return "Offer";
}

function buildPlanPrompt(input: {
  visualStyleId: VisualStyleId;
  campaignTheme: string;
  product: string;
  business: string;
  headline: string;
  subline: string;
  offer: string;
  brandProfile?: BrandProfile | null;
}): string {
  const style = getVisualStyle(input.visualStyleId);
  const brandBlock = input.brandProfile?.businessName
    ? brandProfilePromptBlock(input.brandProfile)
    : "";

  return [
    "Plan a 3-image social ad CAMPAIGN for a small business. Return JSON only — no markdown.",
    "All 3 images must feel like ONE coordinated series: same colors, typography energy, and brand mood.",
    "Each slide has a different message role but shared visual DNA.",
    "",
    "Required JSON:",
    '{"theme":"","visualDna":"","slides":[{"role":"hero","title":"","headline":"","subline":"","composition":""},{"role":"selling-points","title":"","headline":"","subline":"","composition":""},{"role":"offer","title":"","headline":"","subline":"","composition":""}]}',
    "",
    "- theme: one-line campaign theme",
    "- visualDna: paragraph of shared art direction (palette, lighting, typography, layout rhythm)",
    "- slides[0] hero: product hero, main hook headline",
    "- slides[1] selling-points: 2-3 bullets as subline, educational/social proof angle",
    "- slides[2] offer: CTA / limited offer / shop now mood",
    "- composition: per-slide layout/camera note for image AI",
    "- Use Traditional Chinese copy if HK/TW brand; Simplified if mainland cues",
    "",
    `Visual style preset: ${style.id} — ${style.promptHint || "general product ad"}`,
    input.campaignTheme ? `User campaign brief: ${input.campaignTheme}` : "",
    input.product ? `Product: ${input.product}` : "",
    input.business ? `Business: ${input.business}` : "",
    input.headline ? `Seed headline: ${input.headline}` : "",
    input.subline ? `Seed selling points: ${input.subline}` : "",
    input.offer ? `Offer: ${input.offer}` : "",
    brandBlock,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function planCampaign(input: {
  visualStyleId: VisualStyleId;
  campaignTheme?: string;
  product?: string;
  business?: string;
  headline?: string;
  subline?: string;
  offer?: string;
  brandProfile?: BrandProfile | null;
}): Promise<CampaignPlan> {
  const outputText = await callDeepSeekChat(
    [
      {
        role: "system",
        content:
          "You are a social ad campaign planner for Hong Kong / Taiwan / China SMB marketing. Respond with valid JSON only.",
      },
      {
        role: "user",
        content: buildPlanPrompt({
          visualStyleId: input.visualStyleId,
          campaignTheme: input.campaignTheme?.trim() || "",
          product: input.product?.trim() || "",
          business: input.business?.trim() || "",
          headline: input.headline?.trim() || "",
          subline: input.subline?.trim() || "",
          offer: input.offer?.trim() || "",
          brandProfile: input.brandProfile,
        }),
      },
    ],
    { temperature: 0.5, max_tokens: 1400 },
  );

  const plan = extractJsonObject(outputText);
  if (!plan.slides.some((s) => s.headline)) {
    throw new Error("Could not plan campaign slides. Try adding a headline or campaign theme.");
  }
  return plan;
}
