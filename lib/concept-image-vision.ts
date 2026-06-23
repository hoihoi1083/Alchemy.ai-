import { fal } from "@fal-ai/client";
import { parseLlmJsonObject } from "@/lib/parse-llm-json";

const VISION_ENDPOINT = "fal-ai/any-llm/vision";
const VISION_MODEL = "google/gemini-2.5-flash-lite";

export type ConceptImageVision = {
  sceneSummary: string;
  subjects: string;
  mood: string;
  motionHints: string;
};

function extractVisionText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const d = data as Record<string, unknown>;
  if (typeof d.output === "string") return d.output.trim();
  if (typeof d.text === "string") return d.text.trim();
  if (typeof d.response === "string") return d.response.trim();
  const choices = d.choices as Array<{ message?: { content?: string } }> | undefined;
  const content = choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  return "";
}

function normalizeVision(parsed: Partial<ConceptImageVision>): ConceptImageVision {
  return {
    sceneSummary: String(parsed.sceneSummary ?? "").trim(),
    subjects: String(parsed.subjects ?? "").trim(),
    mood: String(parsed.mood ?? "").trim(),
    motionHints: String(parsed.motionHints ?? "").trim(),
  };
}

export function conceptImageVisionBlock(vision: ConceptImageVision): string {
  return [
    vision.sceneSummary,
    vision.subjects ? `Subjects: ${vision.subjects}` : "",
    vision.mood ? `Mood: ${vision.mood}` : "",
    vision.motionHints ? `Motion hints: ${vision.motionHints}` : "",
  ]
    .filter(Boolean)
    .join(". ");
}

export async function analyzeConceptReferenceImage(input: {
  imageUrl: string;
  conceptIdea?: string;
}): Promise<ConceptImageVision> {
  const result = await fal.subscribe(VISION_ENDPOINT, {
    input: {
      model: VISION_MODEL,
      image_urls: [input.imageUrl],
      system_prompt:
        "You analyze reference images for short concept/PSA social video ads. Output valid JSON only.",
      prompt: [
        "Describe this image for a Seedance image-to-video ad prompt.",
        "Return JSON only:",
        '{"sceneSummary":"","subjects":"","mood":"","motionHints":""}',
        "",
        "Rules:",
        "- sceneSummary: one English sentence of what is visible",
        "- subjects: people/objects/symbols in frame (no invented elements)",
        "- mood: lighting, color, emotional tone",
        "- motionHints: subtle camera/motion that would suit THIS still (orbit, push-in, parallax…) without changing the scene identity",
        "- This may be a PSA, poster, logo, illustration, or lifestyle scene — not always a product packshot",
        "- Do NOT invent on-screen text or brands not visible",
        input.conceptIdea ? `User concept idea: ${input.conceptIdea}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    },
    logs: false,
  });

  const raw = extractVisionText(result.data);
  if (!raw) throw new Error("Vision model returned an empty analysis.");
  return normalizeVision(
    parseLlmJsonObject<Partial<ConceptImageVision>>(raw, "Concept image vision"),
  );
}
