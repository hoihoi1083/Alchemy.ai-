import type { BrandProfile } from "@/lib/brand-profile";
import { planVideoPrompt } from "@/lib/video-prompt-plan";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: {
    brandProfile?: BrandProfile;
    product?: string;
    business?: string;
    headline?: string;
    subline?: string;
    offer?: string;
    duration?: string;
    hasReferenceVideo?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const profile = body.brandProfile;
  if (!profile?.businessName) {
    return NextResponse.json(
      { error: "Analyze the brand first (website or social hint)." },
      { status: 400 },
    );
  }

  try {
    const plan = await planVideoPrompt({
      brandProfile: profile,
      product: body.product,
      business: body.business,
      headline: body.headline,
      subline: body.subline,
      offer: body.offer,
      duration: body.duration,
      hasReferenceVideo: body.hasReferenceVideo,
    });
    return NextResponse.json({
      ...plan,
      sourceNote: "Seedance video prompt from brand analysis (DeepSeek)",
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Video prompt planning failed.";
    const status =
      message.includes("DEEPSEEK_API_KEY") ||
      message.includes("DeepSeek API") ||
      message.includes("balance")
        ? 503
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
