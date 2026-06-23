import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";
import {
  analyzeConceptReferenceImage,
  conceptImageVisionBlock,
} from "@/lib/concept-image-vision";
import { planConceptWizard } from "@/lib/concept-wizard-plan";
import type { PromptMarket } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

type ConceptRequest = {
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
};

function parseConceptBody(fd: FormData): ConceptRequest {
  return {
    conceptIdea: String(fd.get("conceptIdea") ?? "").trim() || undefined,
    product: String(fd.get("product") ?? "").trim() || undefined,
    business: String(fd.get("business") ?? "").trim() || undefined,
    headline: String(fd.get("headline") ?? "").trim() || undefined,
    subline: String(fd.get("subline") ?? "").trim() || undefined,
    offer: String(fd.get("offer") ?? "").trim() || undefined,
    promptExtra: String(fd.get("promptExtra") ?? "").trim() || undefined,
    visualStyleId: String(fd.get("visualStyleId") ?? "").trim() || undefined,
    workflowMode:
      fd.get("workflowMode") === "video-only" ||
      fd.get("workflowMode") === "combined" ||
      fd.get("workflowMode") === "image-only"
        ? (fd.get("workflowMode") as ConceptRequest["workflowMode"])
        : undefined,
    market:
      fd.get("market") === "hk" || fd.get("market") === "cn" || fd.get("market") === "en"
        ? (fd.get("market") as PromptMarket)
        : undefined,
  };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let body: ConceptRequest;
  let referenceImageVision: string | undefined;
  let hasReferenceImage = false;

  try {
    if (contentType.includes("multipart/form-data")) {
      const fd = await request.formData();
      body = parseConceptBody(fd);
      const ref = fd.get("reference_image") as File | null;
      if (ref && ref.size > 0) {
        hasReferenceImage = true;
        const imageUrl = await fal.storage.upload(ref);
        const vision = await analyzeConceptReferenceImage({
          imageUrl,
          conceptIdea: body.conceptIdea,
        });
        referenceImageVision = conceptImageVisionBlock(vision);
      }
    } else {
      body = await request.json();
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Invalid request body.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const draft = await planConceptWizard({
      ...body,
      hasReferenceImage,
      referenceImageVision,
    });
    return NextResponse.json({
      draft,
      imageVisionNote: referenceImageVision,
      hasReferenceImage,
      sourceNote: hasReferenceImage
        ? "Concept wizard brief with reference image (DeepSeek + vision)"
        : "Concept wizard brief (DeepSeek)",
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Concept planning failed.";
    const status =
      message.includes("DEEPSEEK_API_KEY") ||
      message.includes("DeepSeek API") ||
      message.includes("balance")
        ? 503
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
