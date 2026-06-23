import { ApiError, fal } from "@fal-ai/client";
import { NextResponse } from "next/server";
import { defaultEditEndpoint, defaultTextEndpoint } from "@/lib/image-endpoints";
import { buildPromptVariables, type PromptMarket, type SubjectFraming } from "@/lib/prompt-variables";
import { planTeachingCarousel } from "@/lib/teaching-carousel-plan";
import type { VisualStyleId } from "@/lib/visual-styles";

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
  return "Teaching carousel generation failed";
}

function aspectRatioForApi(ratio: string): string {
  const map: Record<string, string> = { "9:16": "9:16", "1:1": "1:1", "4:5": "4:5" };
  return map[ratio] ?? "4:5";
}

export async function POST(request: Request) {
  const key = process.env.FAL_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      { error: "Teaching carousel generation is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }
  fal.config({ credentials: key });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const visualStyle = ((formData.get("visual_style") as string | null)?.trim() ||
    "info-poster") as VisualStyleId;
  const product = (formData.get("product_name") as string | null)?.trim() || "";
  const business = (formData.get("business") as string | null)?.trim() || "";
  const headline = (formData.get("headline") as string | null)?.trim() || "";
  const subline = (formData.get("subline") as string | null)?.trim() || "";
  const offer = (formData.get("offer") as string | null)?.trim() || "";
  const promptExtra = (formData.get("prompt_extra") as string | null)?.trim() || "";
  const promptMarket = ((formData.get("prompt_market") as string | null)?.trim() ||
    "hk") as PromptMarket;
  const subjectFraming = ((formData.get("subject_framing") as string | null)?.trim() ||
    "auto") as SubjectFraming;
  const aspectRatio = aspectRatioForApi(
    (formData.get("aspect_ratio") as string | null)?.trim() || "4:5",
  );
  const reference = formData.get("reference_image");
  const hasReference = reference instanceof File && reference.size > 0;
  const endpoint = (formData.get("endpoint") as string | null)?.trim() ||
    (hasReference ? defaultEditEndpoint() : defaultTextEndpoint());
  const slideCount = Math.min(6, Math.max(4, Number(formData.get("slide_count") || 4)));

  try {
    const plan = await planTeachingCarousel({
      visualStyleId: visualStyle,
      product,
      business,
      headline,
      subline,
      offer,
      promptExtra,
      slideCount,
    });
    const vars = buildPromptVariables({
      product,
      business,
      headline,
      subline,
      offer,
      market: promptMarket,
      framing: subjectFraming,
      extra: promptExtra,
    });
    const referenceUrl = hasReference ? await fal.storage.upload(reference as File) : null;
    const slides: Array<{
      role: string;
      title: string;
      headline: string;
      subline: string;
      imageUrl: string;
    }> = [];

    for (const slide of plan.slides) {
      const prompt = [
        `Create one page of an educational carousel (${slide.index}/${plan.slides.length}).`,
        `Theme: ${plan.theme}.`,
        `Shared visual DNA: ${plan.visualDna}.`,
        `Slide role: ${slide.role}.`,
        `Slide title: ${slide.title}.`,
        `Slide body: ${slide.body}.`,
        `Takeaway line: ${slide.takeaway}.`,
        `Composition: ${slide.composition}.`,
        `Audience market style: ${vars.market}.`,
        "Traditional Chinese typography, high readability, no watermark.",
      ].join(" ");

      const result = await fal.subscribe(endpoint, {
        input: {
          prompt,
          ...(referenceUrl ? { image_urls: [referenceUrl] } : {}),
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
          { error: `Image URL missing for slide ${slide.index}.`, raw: result.data },
          { status: 502 },
        );
      }
      slides.push({
        role: slide.role,
        title: slide.title,
        headline: slide.title,
        subline: slide.body,
        imageUrl: outUrls[0],
      });
    }

    return NextResponse.json({
      plan,
      slides,
      imageUrl: slides[0]?.imageUrl,
      imageUrls: slides.map((s) => s.imageUrl),
      endpoint,
      mode: "teaching-carousel",
      slideCount: slides.length,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : formatFalError(e);
    const status =
      message.includes("DEEPSEEK_API_KEY") || message.includes("DeepSeek API") || message.includes("balance")
        ? 503
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

