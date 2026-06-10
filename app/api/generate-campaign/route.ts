import { ApiError, fal } from "@fal-ai/client";
import { NextResponse } from "next/server";
import type { BrandProfile } from "@/lib/brand-profile";
import type { CampaignPlan } from "@/lib/campaign-types";
import { planCampaign } from "@/lib/campaign-plan";
import { defaultEditEndpoint } from "@/lib/image-endpoints";
import {
  buildCampaignSlideImagePrompt,
  buildPromptVariables,
  resolveImagePromptMode,
  type PromptMarket,
  type SubjectFraming,
} from "@/lib/prompt-variables";
import type { VisualStyleId } from "@/lib/visual-styles";
import { isBrandVisualStyle } from "@/lib/visual-styles";

export const runtime = "nodejs";
export const maxDuration = 300;

function extractImageUrls(resultData: unknown): string[] {
  if (!resultData || typeof resultData !== "object") return [];
  if ("images" in resultData) {
    const images = (resultData as { images?: Array<{ url?: unknown }> }).images;
    return (images ?? [])
      .map((img) => (typeof img?.url === "string" ? img.url : undefined))
      .filter((u): u is string => Boolean(u));
  }
  if ("image" in resultData) {
    const image = (resultData as { image?: { url?: unknown } }).image;
    if (image && typeof image.url === "string") return [image.url];
  }
  return [];
}

function formatFalError(e: unknown): string {
  if (e instanceof ApiError) {
    return `${e.message}${e.requestId ? ` (fal request: ${e.requestId})` : ""}`;
  }
  if (e && typeof e === "object" && "message" in e) {
    return String((e as { message: unknown }).message);
  }
  return "Campaign image generation failed";
}

function aspectRatioForApi(ratio: string): string {
  const map: Record<string, string> = {
    "9:16": "9:16",
    "16:9": "16:9",
    "1:1": "1:1",
    "4:5": "4:5",
  };
  return map[ratio] ?? "auto";
}

export async function POST(request: Request) {
  const key = process.env.FAL_KEY?.trim();
  if (!key) {
    return NextResponse.json({ error: "Missing FAL_KEY in .env.local." }, { status: 500 });
  }
  fal.config({ credentials: key });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const reference = formData.get("reference_image");
  const hasProduct = reference instanceof File && reference.size > 0;
  if (!hasProduct) {
    return NextResponse.json({ error: "Upload a product photo for campaign generation." }, { status: 400 });
  }

  const visualStyle = ((formData.get("visual_style") as string | null)?.trim() ||
    "product") as VisualStyleId;
  const brandProfileRaw = (formData.get("brand_profile") as string | null)?.trim() || "";
  let brandProfile: BrandProfile | null = null;
  if (brandProfileRaw) {
    try {
      brandProfile = JSON.parse(brandProfileRaw) as BrandProfile;
    } catch {
      return NextResponse.json({ error: "Invalid brand profile data." }, { status: 400 });
    }
  }

  if (isBrandVisualStyle(visualStyle) && !brandProfile?.businessName) {
    return NextResponse.json(
      { error: "Analyze the brand first (website or social hint)." },
      { status: 400 },
    );
  }

  const productName = (formData.get("product_name") as string | null)?.trim() || "";
  const business = (formData.get("business") as string | null)?.trim() || "";
  const headline = (formData.get("headline") as string | null)?.trim() || "";
  const subline = (formData.get("subline") as string | null)?.trim() || "";
  const offer = (formData.get("offer") as string | null)?.trim() || "";
  const campaignTheme = (formData.get("campaign_theme") as string | null)?.trim() || "";
  const promptMarket = ((formData.get("prompt_market") as string | null)?.trim() ||
    "en") as PromptMarket;
  const subjectFraming = ((formData.get("subject_framing") as string | null)?.trim() ||
    "auto") as SubjectFraming;
  const promptExtra = (formData.get("prompt_extra") as string | null)?.trim() || "";
  const aspectRatio = aspectRatioForApi(
    (formData.get("aspect_ratio") as string | null)?.trim() || "9:16",
  );
  const endpoint = (formData.get("endpoint") as string | null)?.trim() || defaultEditEndpoint();

  const vars = buildPromptVariables({
    product: productName,
    business,
    headline,
    subline,
    offer,
    market: promptMarket,
    framing: subjectFraming,
    extra: promptExtra,
  });

  const promptMode = resolveImagePromptMode(visualStyle, "promo-ai");

  let plan: CampaignPlan;
  try {
    plan = await planCampaign({
      visualStyleId: visualStyle,
      campaignTheme,
      product: productName,
      business,
      headline,
      subline,
      offer,
      brandProfile,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Campaign planning failed.";
    const status =
      message.includes("DEEPSEEK_API_KEY") ||
      message.includes("DeepSeek API") ||
      message.includes("balance")
        ? 503
        : 400;
    return NextResponse.json({ error: message }, { status });
  }

  try {
    const productUrl = await fal.storage.upload(reference as File);
    const slides: Array<{
      role: string;
      title: string;
      headline: string;
      subline: string;
      imageUrl: string;
    }> = [];

    for (let i = 0; i < plan.slides.length; i++) {
      const slide = plan.slides[i];
      const prompt = buildCampaignSlideImagePrompt(
        vars,
        slide,
        plan,
        promptMode,
        brandProfile,
        i,
        plan.slides.length,
      );

      const result = await fal.subscribe(endpoint, {
        input: {
          prompt,
          image_urls: [productUrl],
          aspect_ratio: aspectRatio,
          num_images: 1,
          resolution: "1K" as const,
          limit_generations: true,
        },
        logs: true,
      });

      const outUrls = extractImageUrls(result.data);
      if (!outUrls[0]) {
        return NextResponse.json(
          { error: `Image URL missing for slide ${i + 1}.`, raw: result.data },
          { status: 502 },
        );
      }

      slides.push({
        role: slide.role,
        title: slide.title,
        headline: slide.headline,
        subline: slide.subline,
        imageUrl: outUrls[0],
      });
    }

    const imageUrls = slides.map((s) => s.imageUrl);
    return NextResponse.json({
      plan,
      slides,
      imageUrl: imageUrls[0],
      imageUrls,
      endpoint,
      mode: "campaign",
      slideCount: slides.length,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: formatFalError(e) }, { status: 502 });
  }
}
