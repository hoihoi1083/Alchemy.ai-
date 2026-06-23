import { callDeepSeekChat } from "@/lib/deepseek-client";
import { parseLlmJsonObject } from "@/lib/parse-llm-json";
import type {
  TeachingCarouselPlan,
  TeachingCarouselSlide,
} from "@/lib/teaching-carousel-types";
import { DEFAULT_TEACHING_CAROUSEL_SLIDE_COUNT } from "@/lib/teaching-carousel-types";
import type { VisualStyleId } from "@/lib/visual-styles";

type PlanInput = {
  visualStyleId: VisualStyleId;
  product?: string;
  business?: string;
  headline?: string;
  subline?: string;
  offer?: string;
  promptExtra?: string;
  slideCount?: number;
};

function fallbackSlides(input: PlanInput, count: number): TeachingCarouselSlide[] {
  const h = input.headline?.trim() || input.product?.trim() || "主題重點";
  const lines = (input.subline || "")
    .split(/\||\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const slides: TeachingCarouselSlide[] = [];
  for (let i = 0; i < count; i++) {
    const role: TeachingCarouselSlide["role"] =
      i === 0 ? "cover" : i === count - 1 ? "summary" : "point";
    slides.push({
      index: i + 1,
      role,
      title: i === 0 ? h : `${i}. ${lines[i - 1] || h}`,
      body:
        i === 0
          ? input.subline?.trim() || "用幾個角度拆解主題重點"
          : lines[i - 1] || "補充說明重點，保持一句到兩句",
      takeaway:
        i === count - 1
          ? input.offer?.trim() || "收藏起來，慢慢對照"
          : "短句總結，方便記住重點",
      composition:
        role === "cover"
          ? "Editorial cover layout with strong headline hierarchy"
          : role === "summary"
            ? "Calm recap layout with closing takeaway box"
            : "Educational card layout with title + short explanation",
    });
  }
  return slides;
}

function normalizePlan(parsed: Partial<TeachingCarouselPlan>, input: PlanInput): TeachingCarouselPlan {
  const targetCount = Math.min(
    6,
    Math.max(4, Number(input.slideCount) || DEFAULT_TEACHING_CAROUSEL_SLIDE_COUNT),
  );
  const fallback = fallbackSlides(input, targetCount);
  const rawSlides = Array.isArray(parsed.slides) ? parsed.slides : [];
  const slides = rawSlides
    .slice(0, targetCount)
    .map((s, i) => {
      const fb = fallback[i];
      const role =
        s.role === "cover" || s.role === "point" || s.role === "summary" ? s.role : fb.role;
      return {
        index: i + 1,
        role,
        title: String(s.title ?? "").trim() || fb.title,
        body: String(s.body ?? "").trim() || fb.body,
        takeaway: String(s.takeaway ?? "").trim() || fb.takeaway,
        composition: String(s.composition ?? "").trim() || fb.composition,
      };
    });
  while (slides.length < targetCount) {
    slides.push(fallback[slides.length]);
  }
  return {
    theme: String(parsed.theme ?? "").trim() || (input.headline?.trim() || input.product?.trim() || "教學主題"),
    visualDna:
      String(parsed.visualDna ?? "").trim() ||
      "Clean educational carousel, consistent typography hierarchy, high readability",
    slides,
  };
}

function buildPlanPrompt(input: PlanInput): string {
  const slideCount = Math.min(
    6,
    Math.max(4, Number(input.slideCount) || DEFAULT_TEACHING_CAROUSEL_SLIDE_COUNT),
  );
  return [
    "Create a teaching carousel plan for social media (NOT sales campaign).",
    "Return JSON only, no markdown.",
    "",
    `Generate ${slideCount} slides.`,
    "Required JSON:",
    '{"theme":"","visualDna":"","slides":[{"role":"cover|point|summary","title":"","body":"","takeaway":"","composition":""}]}',
    "",
    "Rules:",
    "- Educational tone, no hard-sell discount language by default.",
    "- Keep each slide copy concise and readable.",
    "- Cover slide introduces topic; middle slides teach; final slide summarizes.",
    "- Do not invent pricing, promotion, or app mechanics unless explicitly provided.",
    "",
    `Visual style: ${input.visualStyleId}`,
    input.product ? `Topic/product: ${input.product}` : "",
    input.business ? `Brand: ${input.business}` : "",
    input.headline ? `Main headline: ${input.headline}` : "",
    input.subline ? `Supporting points: ${input.subline}` : "",
    input.offer ? `Optional CTA: ${input.offer}` : "",
    input.promptExtra ? `Extra requirements: ${input.promptExtra}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function planTeachingCarousel(input: PlanInput): Promise<TeachingCarouselPlan> {
  const output = await callDeepSeekChat(
    [
      {
        role: "system",
        content:
          "You plan educational social carousel content in Traditional Chinese for HK audiences unless context says otherwise. Output strict JSON only.",
      },
      { role: "user", content: buildPlanPrompt(input) },
    ],
    { temperature: 0.5, max_tokens: 1600, jsonObject: true },
  );
  const parsed = parseLlmJsonObject<Partial<TeachingCarouselPlan>>(
    output,
    "Teaching carousel plan",
  );
  return normalizePlan(parsed, input);
}

