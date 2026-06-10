import { ApiError, fal } from "@fal-ai/client";
import { NextResponse } from "next/server";
import type { BrandProfile } from "@/lib/brand-profile";
import {
  buildPromptVariables,
  buildWizardImagePrompt,
  resolveImagePromptMode,
} from "@/lib/prompt-variables";
import type { PromptMarket, SubjectFraming } from "@/lib/prompt-variables";
import { defaultEditEndpoint, defaultTextEndpoint } from "@/lib/image-endpoints";
import type { VisualStyleId } from "@/lib/visual-styles";

export const runtime = "nodejs";
export const maxDuration = 180;

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
  if ("url" in resultData) {
    const url = (resultData as { url?: unknown }).url;
    if (typeof url === "string") return [url];
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
  return "Image generation failed";
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

function parseNumImages(raw: string | null): number {
  const n = parseInt(raw ?? "1", 10);
  if (Number.isNaN(n)) return 1;
  return Math.min(4, Math.max(1, n));
}

function banana2Input(
  prompt: string,
  imageUrls: string[],
  aspectRatio: string,
  numImages: number,
): Record<string, unknown> {
  return {
    prompt,
    image_urls: imageUrls,
    aspect_ratio: aspectRatio,
    num_images: numImages,
    resolution: "1K" as const,
    limit_generations: true,
  };
}

export async function POST(request: Request) {
  const key = process.env.FAL_KEY?.trim();
  if (!key) {
    return NextResponse.json({ error: "Missing FAL_KEY in .env.local." }, { status: 500 });
  }
  fal.config({ credentials: key });

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    const imageMode = (formData.get("image_mode") as string | null)?.trim() || "product-ad";
    const creativeMode =
      (formData.get("image_creative_mode") as string | null)?.trim() || "promo-ai";
    const reference = formData.get("reference_image");
    const styleRef = formData.get("style_reference_image");
    const hasProduct = reference instanceof File && reference.size > 0;
    const hasStyle = styleRef instanceof File && styleRef.size > 0;

    if (!hasProduct && !hasStyle) {
      return NextResponse.json(
        {
          error:
            imageMode === "reference"
              ? "Upload a reference image to guide the look."
              : "Upload a product photo to polish it with AI.",
        },
        { status: 400 },
      );
    }

    const productName = (formData.get("product_name") as string | null)?.trim() || "";
    const business = (formData.get("business") as string | null)?.trim() || "";
    const promptMarket = ((formData.get("prompt_market") as string | null)?.trim() ||
      "en") as PromptMarket;
    const subjectFraming = ((formData.get("subject_framing") as string | null)?.trim() ||
      "auto") as SubjectFraming;
    const promptExtra = (formData.get("prompt_extra") as string | null)?.trim() || "";
    const headline = (formData.get("headline") as string | null)?.trim() || "";
    const subline = (formData.get("subline") as string | null)?.trim() || "";
    const offer = (formData.get("offer") as string | null)?.trim() || "";
    const clientPrompt = (formData.get("prompt") as string | null)?.trim() || "";

    const aspectRatio = aspectRatioForApi(
      (formData.get("aspect_ratio") as string | null)?.trim() || "9:16",
    );
    const numImages = parseNumImages((formData.get("num_images") as string | null)?.trim() ?? "1");

    const useReferenceConcept =
      creativeMode === "reference-concept" || (hasProduct && hasStyle);
    const dualImage = hasProduct && hasStyle;

    if (creativeMode === "reference-concept" && !dualImage) {
      return NextResponse.json(
        {
          error:
            "Reference concept needs both a product photo and a reference ad image (JPG/PNG).",
        },
        { status: 400 },
      );
    }

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

    const visualStyle = (formData.get("visual_style") as string | null)?.trim() || "product";
    const brandProfileRaw = (formData.get("brand_profile") as string | null)?.trim() || "";
    let brandProfile: BrandProfile | null = null;
    if (brandProfileRaw) {
      try {
        brandProfile = JSON.parse(brandProfileRaw) as BrandProfile;
      } catch {
        return NextResponse.json({ error: "Invalid brand profile data." }, { status: 400 });
      }
    }
    const promptMode = resolveImagePromptMode(
      visualStyle,
      useReferenceConcept ? "reference-concept" : creativeMode,
    );
    if (
      (promptMode === "brand-fit" || visualStyle === "brand-campaign") &&
      !brandProfile?.businessName
    ) {
      return NextResponse.json(
        { error: "Analyze the brand first (website or social hint)." },
        { status: 400 },
      );
    }
    const builtPrompt = buildWizardImagePrompt(
      vars,
      promptMode,
      brandProfile,
      visualStyle as VisualStyleId,
    );
    const finalPrompt = clientPrompt || builtPrompt;

    try {
      const imageUrls: string[] = [];
      // Reference concept: concept ref first (IMAGE 1), product second (IMAGE 2).
      if (useReferenceConcept && dualImage) {
        if (hasStyle) imageUrls.push(await fal.storage.upload(styleRef as File));
        if (hasProduct) imageUrls.push(await fal.storage.upload(reference as File));
      } else {
        if (hasProduct) imageUrls.push(await fal.storage.upload(reference as File));
        if (hasStyle) imageUrls.push(await fal.storage.upload(styleRef as File));
      }

      const result = await fal.subscribe(endpoint, {
        input: banana2Input(finalPrompt, imageUrls, aspectRatio, numImages),
        logs: true,
      });
      const outUrls = extractImageUrls(result.data);
      if (!outUrls.length) {
        return NextResponse.json(
          {
            error: "Image URL missing in model response.",
            raw: result.data,
          },
          { status: 502 },
        );
      }

      return NextResponse.json({
        imageUrl: outUrls[0],
        imageUrls: outUrls,
        requestId: result.requestId,
        endpoint,
        mode: "edit",
        creativeMode: useReferenceConcept ? "reference-concept" : "promo-ai",
        imageCount: imageUrls.length,
        variantCount: outUrls.length,
      });
    } catch (e: unknown) {
      return NextResponse.json({ error: formatFalError(e) }, { status: 502 });
    }
  }

  const body = (await request.json().catch(() => null)) as
    | { prompt?: string; endpoint?: string; aspect_ratio?: string; num_images?: number }
    | null;
  const prompt = body?.prompt?.trim() || "";
  const endpoint = body?.endpoint?.trim() || defaultTextEndpoint();
  const aspectRatio = aspectRatioForApi(body?.aspect_ratio?.trim() || "9:16");
  const numImages = Math.min(4, Math.max(1, body?.num_images ?? 1));

  if (!prompt) {
    return NextResponse.json(
      { error: "Describe your product, or upload a photo on step 2." },
      { status: 400 },
    );
  }

  try {
    const result = await fal.subscribe(endpoint, {
      input: { prompt, aspect_ratio: aspectRatio, num_images: numImages },
      logs: true,
    });
    const outUrls = extractImageUrls(result.data);
    if (!outUrls.length) {
      return NextResponse.json(
        {
          error:
            "Image URL missing in model response. Check endpoint and schema on fal.ai model page.",
          raw: result.data,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      imageUrl: outUrls[0],
      imageUrls: outUrls,
      requestId: result.requestId,
      endpoint,
      mode: "text",
      variantCount: outUrls.length,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: formatFalError(e) }, { status: 502 });
  }
}
