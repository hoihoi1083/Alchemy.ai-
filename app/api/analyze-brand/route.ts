import { analyzeBrandFromSources } from "@/lib/brand-analyze";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: { websiteUrl?: string; socialHint?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const { profile, sourceNote } = await analyzeBrandFromSources({
      websiteUrl: body.websiteUrl,
      socialHint: body.socialHint,
    });
    return NextResponse.json({ profile, sourceNote });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Brand analysis failed.";
    const status =
      message.includes("DEEPSEEK_API_KEY") || message.includes("DeepSeek API") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
