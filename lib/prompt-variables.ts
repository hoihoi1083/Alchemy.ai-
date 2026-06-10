import {
  applyTemplate,
  getTemplate,
  VIDEO_BGM_HINT,
  type MarketingTemplate,
  type TemplateId,
} from "@/lib/templates";
import {
  creativityMotionHint,
  type VideoCreativity,
} from "@/lib/video-creativity";

export type VideoPromptOpts = {
  creativity?: VideoCreativity;
  dualFrame?: boolean;
  multiAngle?: boolean;
};

/** Visual / cultural style for the ad (AI prompts stay in English). */
export type PromptMarket = "hk" | "tw" | "cn" | "en";

/** What (if any) human body parts may appear. */
export type SubjectFraming =
  | "auto"
  | "product-only"
  | "hands-only"
  | "legs-feet"
  | "torso-no-face"
  | "no-people";

export const PROMPT_MARKETS: PromptMarket[] = ["hk", "tw", "cn", "en"];

export const SUBJECT_FRAMINGS: SubjectFraming[] = [
  "auto",
  "product-only",
  "hands-only",
  "legs-feet",
  "torso-no-face",
  "no-people",
];

export type PromptVariables = {
  product: string;
  business?: string;
  offer?: string;
  headline?: string;
  subline?: string;
  market: PromptMarket;
  framing: SubjectFraming;
  extra?: string;
};

const MARKET_HINTS: Record<PromptMarket, string> = {
  hk: "Hong Kong local boutique aesthetic, modern Asian urban lifestyle, premium but approachable",
  tw: "Taiwan lifestyle aesthetic, soft natural tones, friendly local brand feel",
  cn: "Mainland China e-commerce product style, bright clean commercial look, popular on Douyin/Xiaohongshu",
  en: "International English-market commercial style, clean minimal western retail look",
};

const FRAMING_IMAGE: Record<SubjectFraming, string> = {
  auto: "",
  "product-only": "Product only as hero subject, no people in frame",
  "hands-only":
    "Only hands visible interacting with the product, cropped so face is never shown, elegant hand model",
  "legs-feet":
    "Only lower legs and feet visible, ideal for shoes or socks, cropped above the knee, no face or upper body",
  "torso-no-face":
    "Torso and arms may appear but face must be completely out of frame or obscured, no identifiable face",
  "no-people": "No people, no hands, no body parts — product and scene only",
};

const FRAMING_VIDEO: Record<SubjectFraming, string> = {
  auto: "",
  "product-only": "Animate product only, no people",
  "hands-only": "Subtle motion of hands holding the product, face never visible",
  "legs-feet": "Subtle motion on feet/legs wearing the product, no upper body or face",
  "torso-no-face": "Gentle motion on torso/hands, face never shown",
  "no-people": "Product-only motion, no human subjects",
};

const FRAMING_NEGATIVE: Record<SubjectFraming, string> = {
  auto: "",
  "product-only": "person, human, face, hands, body, model portrait",
  "hands-only": "face, eyes, nose, mouth, full portrait, identifiable person, celebrity",
  "legs-feet": "face, upper body, torso, arms, portrait, head",
  "torso-no-face": "face, eyes, identifiable face, portrait, head close-up",
  "no-people": "person, human, face, hands, legs, body, model",
};

export function buildPromptVariables(input: {
  product: string;
  business?: string;
  offer?: string;
  headline?: string;
  subline?: string;
  market: PromptMarket;
  framing: SubjectFraming;
  extra?: string;
}): PromptVariables {
  return {
    product: input.product.trim(),
    business: input.business?.trim(),
    offer: input.offer?.trim(),
    headline: input.headline?.trim(),
    subline: input.subline?.trim(),
    market: input.market,
    framing: input.framing,
    extra: input.extra?.trim(),
  };
}

function joinParts(...parts: (string | undefined)[]): string {
  return parts
    .filter((p): p is string => Boolean(p?.trim()))
    .join(". ")
    .replace(/\.\s*\./g, ".");
}

export function buildImageEditPrompt(
  template: MarketingTemplate,
  vars: PromptVariables,
): string {
  const base = applyTemplate(template.imageEditPromptTemplate, vars);
  return joinParts(
    base,
    MARKET_HINTS[vars.market],
    FRAMING_IMAGE[vars.framing],
    vars.extra,
  );
}

function promoAdCopyLines(vars: PromptVariables): string[] {
  const lines: string[] = [];
  if (vars.headline?.trim()) lines.push(vars.headline.trim());
  else if (vars.product?.trim()) lines.push(vars.product.trim());
  if (vars.subline?.trim()) lines.push(vars.subline.trim());
  if (vars.offer?.trim()) lines.push(vars.offer.trim());
  if (vars.business?.trim()) lines.push(vars.business.trim());
  return lines;
}

function promoArtDirectionHint(vars: PromptVariables): string {
  const cues = joinParts(vars.product, vars.headline, vars.subline, vars.offer, vars.business, vars.extra);
  if (cues) {
    return `Art direction: infer background, props, lighting, mood, and layout from the product and campaign brief — fit this specific item and message; do not default to a fixed template look (e.g. do not assume marble, testimonial collage, or studio box shot unless the brief implies it).`;
  }
  return `Art direction: infer a fitting ad style from the product in the photo — category-appropriate scene and mood, not a one-size-fits-all template.`;
}

function promoTypographyHint(vars: PromptVariables, copyFromReference?: boolean): string {
  const lines = promoAdCopyLines(vars);
  const isEn = vars.market === "en";
  const langHint = isEn
    ? "Use clean premium English ad typography."
    : "Use clean premium Traditional Chinese ad typography (繁體中文) — spell characters accurately.";
  const refNote = copyFromReference
    ? " Do not copy readable wording from IMAGE 1."
    : "";
  if (lines.length > 0) {
    return `${langHint} Integrate these marketing lines into the poster as readable ad copy — bold main headline, supporting sublines, optional offer badge or brand footer: ${lines.join(" · ")}.${refNote}`;
  }
  const product = vars.product?.trim() || "the product";
  return `${langHint} Add short boutique ad headlines suited to ${product} — hook plus supporting line, woven into the layout.${refNote}`;
}

/** Nano Banana: new promotional image from product photo + brief (not a template paste). */
export function buildPromoImagePrompt(vars: PromptVariables): string {
  const product = vars.product?.trim() || "the product";
  const theme = joinParts(vars.headline, vars.subline, vars.offer);
  return joinParts(
    `Create a brand-new vertical social media advertisement for ${product}.`,
    vars.business ? `Brand / shop: ${vars.business}.` : "",
    theme ? `Campaign message: ${theme}.` : "",
    `Use IMAGE 1 only as the real product reference — keep the exact item, colors, materials, and bead pattern. Remove any old text overlays from the input; replace with fresh designed copy.`,
    promoArtDirectionHint(vars),
    `Design a complete social ad: product hero, intentional scene, lighting, props, color grade, AND integrated marketing typography.`,
    promoTypographyHint(vars),
    `The result must be a finished social ad with readable copy — not a plain product-only beauty shot.`,
    `Do NOT paste the product onto a generic template frame. Do NOT add watermarks, @handles, or third-party logos.`,
    MARKET_HINTS[vars.market],
    FRAMING_IMAGE[vars.framing],
    vars.extra,
    "Single 9:16 marketing still.",
  );
}

/** Nano Banana: reference ad concept → new image with IMAGE 2 product in IMAGE 1's scene idea. */
export function buildReferenceConceptImagePrompt(vars: PromptVariables): string {
  const product = vars.product?.trim() || "the product";
  const brief = joinParts(
    vars.business ? `Brand: ${vars.business}` : undefined,
    vars.product ? `Product: ${vars.product}` : undefined,
    vars.headline ? `Headline: ${vars.headline}` : undefined,
    vars.subline ? `Subline: ${vars.subline}` : undefined,
    vars.offer ? `Offer: ${vars.offer}` : undefined,
  );
  const copyHint = promoTypographyHint(vars, true);
  return joinParts(
    `Two images. Create ONE new 9:16 marketing still.`,
    `IMAGE 1 = concept reference ad. Extract and follow its visual concept ONLY — scene/setting (surface, room, props), product staging (in-hand, on wrist, flat lay, pedestal, box shot, etc.), camera angle and crop, lighting mood, color grade, and composition rhythm.`,
    `If IMAGE 1 is a lifestyle photo, keep that lifestyle concept. If IMAGE 1 is a graphic poster, keep that layout style. Do NOT clone IMAGE 1 pixel-for-pixel.`,
    `Do NOT use the product from IMAGE 1. Do NOT copy readable text, logos, watermarks, social UI, or @handles from IMAGE 1.`,
    `IMAGE 2 = the real ${product}. Preserve this exact item — bead colors, inclusions, materials, shape, and size.`,
    `Ignore IMAGE 2's background, packaging scene, and any text on IMAGE 2; extract only the product itself.`,
    `TASK: Place IMAGE 2's product into a new polished version of IMAGE 1's concept — same idea and staging, different product, upgraded execution.`,
    brief ? `Campaign brief: ${brief}.` : "",
    copyHint,
    `The output must clearly resemble IMAGE 1's concept (a viewer should recognize the same scene idea) while showing IMAGE 2's product and the campaign copy above — not a generic unrelated poster.`,
    MARKET_HINTS[vars.market],
    FRAMING_IMAGE[vars.framing],
    vars.extra,
    "9:16 vertical social ad still, sharp focus, no watermark.",
  );
}

/**
 * When user uploads product (image 1) + style reference ad (image 2).
 * Must NOT mention studio/clean background — that overrides the reference.
 */
/** @deprecated Prefer buildReferenceConceptImagePrompt — kept for API compatibility. */
export function buildProductWithStyleRefPrompt(vars: PromptVariables): string {
  return buildReferenceConceptImagePrompt(vars);
}

export function buildVideoPrompt(template: MarketingTemplate, vars: PromptVariables): string {
  const base = applyTemplate(template.videoPromptTemplate, vars);
  return joinParts(base, MARKET_HINTS[vars.market], FRAMING_VIDEO[vars.framing], vars.extra) + VIDEO_BGM_HINT;
}

/** Seedance image-to-video: product promo from generated keyframe. */
export function buildProductPromoVideoPrompt(
  vars: PromptVariables,
  opts: VideoPromptOpts = {},
): string {
  const product = vars.product?.trim() || "the product";
  const creativity = opts.creativity ?? "lively";
  const motion = creativityMotionHint(creativity, Boolean(opts.dualFrame));
  const frameNote = opts.dualFrame
    ? "Start frame = opening composition, end frame = closing composition — animate a smooth journey between them."
    : "Animate the hero product with varied commercial motion.";
  const multiNote = opts.multiAngle
    ? "Use all reference images as the same product from different angles; cut-like energy between angles while keeping identity consistent."
    : "";
  return (
    joinParts(
      `Premium social ad motion for ${product}.`,
      vars.headline ? `Theme: ${vars.headline}.` : "",
      frameNote,
      motion,
      multiNote,
      `Keep the same product identity — do not morph into a different item.`,
      MARKET_HINTS[vars.market],
      FRAMING_VIDEO[vars.framing],
      "No on-screen text, subtitles, logos, or watermarks",
      vars.extra,
    ) + VIDEO_BGM_HINT
  );
}

/** Seedance image-to-video after Nano Banana step in combined workflow. */
export function buildImageToVideoPrompt(
  vars: PromptVariables,
  opts: VideoPromptOpts = {},
): string {
  return buildProductPromoVideoPrompt(vars, opts);
}

/** Second still for start→end image-to-video (Nano Banana). */
export function buildEndFrameImagePrompt(vars: PromptVariables): string {
  const product = vars.product?.trim() || "the product";
  return joinParts(
    `Create a second vertical ad frame for ${product} — must be a DIFFERENT composition from IMAGE 1.`,
    `Prefer: bracelet worn on wrist with elegant hand (no face), or dramatic macro close-up of beads with warm gold sparkle.`,
    `Preserve exact product from IMAGE 1. New angle, lighting accent, and background mood.`,
    MARKET_HINTS[vars.market],
    FRAMING_IMAGE[vars.framing],
    vars.extra,
    "9:16, no readable text, no watermark.",
  );
}

/** Reference-to-video with multiple product photos, no MP4 clone. */
export function buildMultiAngleVideoPrompt(
  vars: PromptVariables,
  opts: VideoPromptOpts = {},
): string {
  const creativity = opts.creativity ?? "lively";
  return joinParts(
    buildProductPromoVideoPrompt(vars, { ...opts, multiAngle: true, creativity }),
    "Reference images show the same product from different angles — create dynamic motion that showcases multiple views with commercial pacing, not a single slow zoom.",
  );
}

export function buildNegativePrompt(template: MarketingTemplate, framing: SubjectFraming): string {
  const extra = FRAMING_NEGATIVE[framing];
  if (!extra) return template.negativePrompt;
  return `${template.negativePrompt}, ${extra}`;
}

export function rebuildPromptsForTemplate(
  templateId: TemplateId,
  vars: PromptVariables,
): { image: string; video: string; negative: string } {
  const template = getTemplate(templateId);
  return {
    image: buildImageEditPrompt(template, vars),
    video: buildVideoPrompt(template, vars),
    negative: buildNegativePrompt(template, vars.framing),
  };
}

/** Reference-to-video — @Video1 drives motion/scene; @Image1 is product identity only (fal pattern). */
export function buildReferenceVideoPrompt(vars: PromptVariables): string {
  return (
    joinParts(
      "Reference-to-video. @Video1 is the PRIMARY reference: copy its camera angles, shot composition, hand movements, table/scene layout, pacing, and edit rhythm.",
      "@Image1 performs the same actions and scene structure as @Video1 — only swap the bracelet/beads to match @Image1 colors, materials, and bead pattern.",
      "If @Video1 shows hands stringing or holding beads, show natural hands with @Image1's product — do NOT collapse into a product-only macro or slow push-in unless @Video1 does that.",
      "Keep the same background type, lighting direction, and framing as @Video1 (e.g. white tabletop, top-down craft shot if that is what @Video1 shows).",
      "Do not copy identifiable faces, brand logos, social UI, or readable on-screen text from @Video1.",
      vars.headline ? `Campaign theme: ${vars.headline}.` : "",
      MARKET_HINTS[vars.market],
      vars.framing === "hands-only"
        ? "Hands may appear; face never visible."
        : vars.framing === "no-people" || vars.framing === "product-only"
          ? ""
          : FRAMING_VIDEO[vars.framing],
      "No generated subtitles, watermarks, or logos",
      vars.extra,
    ) + VIDEO_BGM_HINT
  );
}

/** Negative prompt for reference-to-video — do not block hands when matching @Video1. */
export function buildReferenceVideoNegative(template: MarketingTemplate): string {
  return `${template.negativePrompt.replace(/,?\s*distorted hands/gi, "")}, identifiable face close-up, celebrity portrait, social media UI overlay, screen recording chrome, watermark, logo, on-screen text, subtitles, speech, voiceover`;
}
