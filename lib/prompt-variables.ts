import type { BrandProfile } from "@/lib/brand-profile";
import { brandProfilePromptBlock } from "@/lib/brand-profile";
import {
  applyTemplate,
  getTemplate,
  VIDEO_BGM_HINT,
  type MarketingTemplate,
  type TemplateId,
} from "@/lib/templates";
import {
  buildModelWearPresentationHint,
  buildSecondFrameSceneHint,
} from "@/lib/product-scene-hints";
import {
  creativityMotionHint,
  type VideoCreativity,
} from "@/lib/video-creativity";
import type {
  StoryboardScenePlan,
  VideoStoryboardPlan,
} from "@/lib/video-storyboard-types";

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

/** Strong anchor so edit models keep the uploaded reference as the hero — not brand-template stock scenes. */
function imageReferenceAnchorBlock(vars: PromptVariables): string {
  const label = vars.product?.trim() || "the uploaded reference";
  return joinParts(
    "CRITICAL — IMAGE 1 IS MANDATORY",
    `IMAGE 1 is the user's uploaded reference for "${label}". The output MUST clearly show recognizable content from IMAGE 1 as the hero subject.`,
    "Do NOT replace IMAGE 1 with an unrelated stock scene, lifestyle flat lay, or a different product category.",
    "If IMAGE 1 is a graphic, poster, or app/UI screenshot: keep the same visual content and layout as the hero — polish lighting and integrate campaign copy; do not swap in unrelated products or props.",
    "If IMAGE 1 is a physical product photo: preserve the exact item — colors, materials, shape, packaging.",
    "Brand or campaign art direction may only change background mood, color grade, and typography — never the subject from IMAGE 1.",
  );
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
  const noInventedPricing =
    " Do NOT add price tags, currency amounts (e.g. HK$, ¥), discount percentages (e.g. 88折), or limited-time sale claims unless the brief explicitly includes an Offer line.";
  if (lines.length > 0) {
    const hasOffer = Boolean(vars.offer?.trim());
    const offerNote = hasOffer
      ? " Use only the provided Offer text for any promotion badge — do not invent extra prices or discounts."
      : noInventedPricing;
    return `${langHint} Integrate these marketing lines into the poster as readable ad copy — bold main headline, supporting sublines${hasOffer ? ", optional offer badge" : ""}, optional brand footer: ${lines.join(" · ")}.${offerNote}${refNote}`;
  }
  const product = vars.product?.trim() || "the product";
  return `${langHint} Add short boutique ad headlines suited to ${product} — hook plus supporting line, woven into the layout.${noInventedPricing}${refNote}`;
}

function parseSellingPointBullets(subline?: string): string[] {
  if (!subline?.trim()) return [];
  return subline
    .split(/\n/)
    .map((line) => line.replace(/^[\s•\-–]+/, "").trim())
    .filter(Boolean)
    .slice(0, 4);
}

/**
 * IG info-poster technique (gptsavyy workflow):
 * category → selling points → simplified copy → single theme → category visuals → premium white → quality check.
 * Avoids generic overcrowded AI poster look.
 */
export function buildInfoPosterImagePrompt(vars: PromptVariables): string {
  const product = vars.product?.trim() || "the product";
  const headline = vars.headline?.trim() || product;
  const bullets = parseSellingPointBullets(vars.subline);
  const bulletText = bullets.length
    ? `Supporting bullets (max ${bullets.length}, keep short): ${bullets.join(" · ")}.`
    : "Add 2–3 very short supporting bullets derived from the product category.";
  const isEn = vars.market === "en";
  const langHint = isEn
    ? "Use clean modern English typography with clear hierarchy."
    : "Use clean modern Traditional Chinese typography (繁體中文) — spell every character accurately.";

  return joinParts(
    `Create a premium vertical INFO POSTER for ${product} — NOT a generic AI collage, NOT a dark moody ad.`,
    `WORKFLOW (follow in order):`,
    `1) Product category: infer from product name and IMAGE 1 (beauty/skincare, jewelry, food, fashion, wellness, etc.).`,
    `2) Selling points: use only the most relevant points for THIS single image — do not list everything.`,
    `3) Copy simplification: ONE main headline theme only; short bullets; generous whitespace — never cram all text into one block.`,
    `4) Single topic: this image covers one theme — "${headline}". Other points stay as small bullets only.`,
    bulletText,
    `5) Category visualization: subtle props/colors that match the category on a clean white backdrop (beauty = minimal botanical accent; jewelry = soft pedestal; food = fresh ingredient hint).`,
    `6) Premium white style: bright white or soft off-white studio background, soft natural light, editorial e-commerce info graphic like premium IG carousel edu content.`,
    `7) Quality check: avoid obvious AI poster tells — no overcrowded text, no Canva-style frames, no neon gradients, no watermark, no social UI.`,
    imageReferenceAnchorBlock(vars),
    `Remove outdated marketing text from IMAGE 1 only where new slide copy replaces it.`,
    `Layout: product hero ~35% of frame, headline prominent, 2–4 bullet lines with airy negative space, professional IG info-post composition.`,
    langHint,
    vars.business ? `Brand footer: ${vars.business}.` : "",
    vars.offer ? `Optional offer badge: ${vars.offer}.` : "",
    MARKET_HINTS[vars.market],
    FRAMING_IMAGE[vars.framing],
    vars.extra,
    "Single 9:16 marketing still.",
  );
}

import type { CampaignSlidePlan } from "@/lib/campaign-types";
import { getVisualStyle, type VisualStyleId } from "@/lib/visual-styles";

export type ImagePromptMode =
  | "promo-ai"
  | "reference-concept"
  | "info-poster"
  | "brand-fit"
  | "model-wear"
  | "service-promo"
  | "pricing-offer"
  | "website-launch";

/** Lifestyle model wearing / using the product — photorealistic ad still from product photo. */
export function buildModelWearImagePrompt(vars: PromptVariables): string {
  const product = vars.product?.trim() || "the product";
  const theme = joinParts(vars.headline, vars.subline, vars.offer);
  return joinParts(
    imageReferenceAnchorBlock(vars),
    `Create a photorealistic vertical LIFESTYLE ADVERTISEMENT for ${product}.`,
    buildModelWearPresentationHint(product, vars.framing),
    `Keep the exact product from IMAGE 1 — same item, colors, materials, charm details. Do NOT replace with a different product.`,
    vars.business ? `Brand mood: ${vars.business}.` : "",
    theme ? `Ad copy theme (integrate as subtle vertical sidebar typography if appropriate): ${theme}.` : promoTypographyHint(vars),
    `Photorealistic editorial commercial — natural skin, realistic lighting, shallow DOF, NOT cartoon, NOT plastic AI skin.`,
    `Do NOT invent prices, HK$, or discount % unless offer is in the brief.`,
    MARKET_HINTS[vars.market],
    vars.extra,
    "9:16 vertical, no watermark, no social UI chrome.",
  );
}

/** Brand-fit: ad styled to match analyzed website/social brand DNA. */
export function buildBrandFitImagePrompt(
  vars: PromptVariables,
  profile: BrandProfile,
): string {
  const product = vars.product?.trim() || profile.productCategory || "the product";
  const theme = joinParts(vars.headline, vars.subline, vars.offer);
  return joinParts(
    imageReferenceAnchorBlock(vars),
    `Create a vertical social ad for ${product} — IMAGE 1 stays the hero; brand DNA below styles colors, typography, and mood only.`,
    brandProfilePromptBlock(profile),
    vars.business ? `Shop name on ad: ${vars.business}.` : "",
    theme ? `Campaign copy for this ad: ${theme}.` : "",
    `Match brand palette and typography energy from the DNA — but do NOT substitute IMAGE 1 with generic category stock shots (e.g. crystals, marble, flat lays) unless IMAGE 1 already shows them.`,
    promoTypographyHint(vars),
    `Do NOT look like a one-size-fits-all AI poster. Do NOT ignore IMAGE 1.`,
    MARKET_HINTS[vars.market],
    FRAMING_IMAGE[vars.framing],
    vars.extra,
    "Single 9:16 marketing still.",
  );
}

export function buildServicePromoImagePrompt(vars: PromptVariables): string {
  const name = vars.business?.trim() || vars.product?.trim() || "the service";
  return joinParts(
    `Create a premium vertical social ad promoting a SERVICE for ${name}.`,
    vars.headline ? `Main headline: ${vars.headline}.` : "",
    vars.subline ? `Supporting points: ${vars.subline}.` : "",
    vars.offer ? `Offer / CTA: ${vars.offer}.` : "",
    "Professional trustworthy design — consulting, coaching, course, membership, wellness, B2C service.",
    "Typography-led layout with intentional hierarchy — NOT a physical product packshot or warehouse scene.",
    promoTypographyHint(vars),
    `Do NOT invent prices, HK$, or discount % unless offer is in the brief.`,
    MARKET_HINTS[vars.market],
    vars.extra,
    "Vertical social feed ad, sharp focus, no watermark, no social UI chrome.",
  );
}

export function buildPricingOfferImagePrompt(vars: PromptVariables): string {
  const name = vars.business?.trim() || vars.product?.trim() || "the brand";
  return joinParts(
    `Create a vertical pricing / limited-offer promo graphic for ${name}.`,
    vars.headline ? `Offer theme: ${vars.headline}.` : "",
    vars.subline ? `Benefit bullets: ${vars.subline}.` : "",
    vars.offer ? `CTA / offer line: ${vars.offer}.` : "",
    "Clean pricing-card or promo-banner layout with clear CTA button area — IG/FB feed friendly.",
    "Premium but approachable SMB aesthetic. Generous whitespace, readable type.",
    `Do NOT invent specific prices, HK$, or discount % unless the user offer field includes them.`,
    MARKET_HINTS[vars.market],
    vars.extra,
    "Vertical marketing still, no watermark, no platform UI overlay.",
  );
}

export function buildWebsiteLaunchImagePrompt(vars: PromptVariables): string {
  const name = vars.business?.trim() || vars.product?.trim() || "the brand";
  return joinParts(
    `Create a vertical website or app LAUNCH promo for ${name}.`,
    vars.headline ? `Launch hook: ${vars.headline}.` : "",
    vars.subline ? `Supporting copy: ${vars.subline}.` : "",
    "Modern device frame or browser mockup mood — polished tech/SMB marketing, soft gradient background.",
    "Optional subtle logo placement. Focus on driving visits or sign-ups — not a product unboxing photo.",
    promoTypographyHint(vars),
    MARKET_HINTS[vars.market],
    vars.extra,
    "Vertical launch ad, no Instagram/FB UI chrome, no watermark.",
  );
}

export function buildWizardImagePrompt(
  vars: PromptVariables,
  mode: ImagePromptMode,
  brandProfile?: BrandProfile | null,
  visualStyleId?: VisualStyleId,
): string {
  if (mode === "reference-concept") {
    const shopHint = visualStyleId ? getVisualStyle(visualStyleId).promptHint : "";
    return buildReferenceConceptImagePrompt(vars, { shopStyleHint: shopHint, brandProfile });
  }
  if (mode === "info-poster") return buildInfoPosterImagePrompt(vars);
  if (mode === "model-wear") return buildModelWearImagePrompt(vars);
  if (mode === "service-promo") return buildServicePromoImagePrompt(vars);
  if (mode === "pricing-offer") return buildPricingOfferImagePrompt(vars);
  if (mode === "website-launch") return buildWebsiteLaunchImagePrompt(vars);
  if (mode === "brand-fit" && brandProfile?.businessName) {
    return buildBrandFitImagePrompt(vars, brandProfile);
  }
  return buildPromoImagePrompt(vars, brandProfile);
}

export function resolveImagePromptMode(
  visualStyleId: string,
  creativeMode: string,
): ImagePromptMode {
  if (creativeMode === "reference-concept") return "reference-concept";
  if (visualStyleId === "info-poster") return "info-poster";
  if (visualStyleId === "model-wear") return "model-wear";
  if (visualStyleId === "service-promo") return "service-promo";
  if (visualStyleId === "pricing-offer") return "pricing-offer";
  if (visualStyleId === "website-launch") return "website-launch";
  if (visualStyleId === "brand-fit" || visualStyleId === "brand-campaign") return "brand-fit";
  return "promo-ai";
}

/** One slide in a linked campaign — shared DNA, per-slide headline/composition. */
export function buildCampaignSlideImagePrompt(
  vars: PromptVariables,
  slide: CampaignSlidePlan,
  plan: { theme: string; visualDna: string },
  mode: ImagePromptMode,
  brandProfile: BrandProfile | null | undefined,
  slideIndex: number,
  totalSlides: number,
  hasReferenceImage = true,
): string {
  const slideVars: PromptVariables = {
    ...vars,
    headline: slide.headline || vars.headline,
    subline: slide.subline || vars.subline,
  };
  const campaignBlock = joinParts(
    hasReferenceImage ? imageReferenceAnchorBlock(slideVars) : "",
    `LINKED CAMPAIGN (${totalSlides} posts — image ${slideIndex + 1}/${totalSlides}).`,
    plan.theme ? `Campaign theme: ${plan.theme}.` : "",
    `This slide: ${slide.title} [${slide.role}].`,
    slide.composition
      ? `Layout note (secondary to IMAGE 1): ${slide.composition}.`
      : "",
    `Shared series styling (colors, typography, mood — same on every slide): ${plan.visualDna}.`,
    hasReferenceImage
      ? "Each slide varies headline/message and layout role only — IMAGE 1 subject must stay recognizable on every slide."
      : "Each slide varies headline/message and layout role only — keep one consistent campaign art direction across all slides.",
    slide.role === "offer" && !vars.offer?.trim()
      ? "Offer slide: CTA / shop-now mood only — do NOT invent prices, HK$, discount %, or fake promotions."
      : "",
  );
  const base =
    mode === "brand-fit" && brandProfile?.businessName
      ? buildBrandFitImagePrompt(slideVars, brandProfile)
      : mode === "info-poster"
        ? buildInfoPosterImagePrompt(slideVars)
        : mode === "service-promo"
          ? buildServicePromoImagePrompt(slideVars)
          : mode === "pricing-offer"
            ? buildPricingOfferImagePrompt(slideVars)
            : mode === "website-launch"
              ? buildWebsiteLaunchImagePrompt(slideVars)
              : buildPromoImagePrompt(slideVars, brandProfile);
  return joinParts(campaignBlock, base);
}

/** Nano Banana: new promotional image from product photo + brief (not a template paste). */
export function buildPromoImagePrompt(
  vars: PromptVariables,
  brandProfile?: BrandProfile | null,
): string {
  const product = vars.product?.trim() || "the product";
  const theme = joinParts(vars.headline, vars.subline, vars.offer);
  return joinParts(
    imageReferenceAnchorBlock(vars),
    `Create a brand-new vertical social media advertisement for ${product}.`,
    brandProfile?.businessName
      ? joinParts(
          "Apply this brand DNA in art direction, palette, and typography tone.",
          brandProfilePromptBlock(brandProfile),
        )
      : "",
    vars.business ? `Brand / shop: ${vars.business}.` : "",
    theme ? `Campaign message: ${theme}.` : "",
    `Remove outdated marketing text from IMAGE 1 where new copy replaces it.`,
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

/** Nano Banana: reference ad → new image keeping design language, adapting venue/lighting to product/shop. */
export function buildReferenceConceptImagePrompt(
  vars: PromptVariables,
  options?: { shopStyleHint?: string; brandProfile?: BrandProfile | null },
): string {
  const product = vars.product?.trim() || "the product";
  const brief = joinParts(
    vars.business ? `Brand: ${vars.business}` : undefined,
    vars.product ? `Product: ${vars.product}` : undefined,
    vars.headline ? `Headline: ${vars.headline}` : undefined,
    vars.subline ? `Subline: ${vars.subline}` : undefined,
    vars.offer ? `Offer: ${vars.offer}` : undefined,
  );
  const copyHint = promoTypographyHint(vars, true);
  const framingHint =
    vars.framing === "auto"
      ? "Keep the same product interaction type as IMAGE 1 (in hand, on wrist, flat lay, circle hero, on pedestal). Use natural hands with IMAGE 2's product when IMAGE 1 shows hands — face out of frame."
      : FRAMING_IMAGE[vars.framing];
  const shopBlock = joinParts(
    options?.brandProfile?.businessName
      ? brandProfilePromptBlock(options.brandProfile)
      : "",
    options?.shopStyleHint
      ? `Shop visual style hint (for background and lighting only): ${options.shopStyleHint}.`
      : "",
    vars.business ? `Shop: ${vars.business}.` : "",
  );
  return joinParts(
    `Two images. Create ONE new 9:16 marketing still for ${product}.`,
    `HOW TO USE IMAGE 1 (reference ad) — three layers:`,
    `LAYER A — KEEP (design language): layout structure, composition rhythm, graphic component types (badges, frames, accent shapes, hand-drawn or elegant decoration style), typography hierarchy style, and product staging pose (hand / wrist / flat lay / circle hero). A viewer should recognize the same ad design family as IMAGE 1.`,
    `LAYER B — ADAPT (venue and light): background, venue, surface, and lighting should suit IMAGE 2's product colors and the shop/campaign mood — they may differ from IMAGE 1. Do not clone IMAGE 1's exact location or lighting if it clashes with the new product; make the environment feel native to this product and shop.`,
    `LAYER C — REPLACE (content): use IMAGE 2's exact product (colors, materials, shape). All readable headlines and body copy must come from the campaign brief below — never reuse IMAGE 1 product names or selling lines. Do not copy logos, watermarks, or social UI from IMAGE 1.`,
    `IMAGE 2 = the real ${product}. Always show this item, not the product from IMAGE 1.`,
    shopBlock,
    brief ? `Campaign copy (all on-image text): ${brief}.` : "",
    copyHint,
    MARKET_HINTS[vars.market],
    framingHint,
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

function buildVideoMotionBlock(opts: VideoPromptOpts): string {
  const creativity = opts.creativity ?? "lively";
  const motion = creativityMotionHint(creativity, Boolean(opts.dualFrame));
  const frameNote = opts.dualFrame
    ? "Start frame = opening composition, end frame = closing composition — prefer a subtle transition; avoid melting one scene into another."
    : "Animate the hero product with commercial motion.";
  const realismNote =
    creativity === "subtle"
      ? "Photorealistic commercial look: locked or near-static camera, very subtle motion only, natural lighting, no plastic skin, no finger morphing, no surreal sparkle trails."
      : "";
  const multiNote = opts.multiAngle
    ? "Use all reference images as the same product from different angles; cut-like energy between angles while keeping identity consistent."
    : "";
  return joinParts(
    frameNote,
    motion,
    realismNote,
    multiNote,
    "Keep the same product identity — do not morph into a different item.",
  );
}

/** Template-specific Seedance prompt — style from videoPromptTemplate + motion layer. */
export function buildVideoPrompt(
  template: MarketingTemplate,
  vars: PromptVariables,
  opts?: VideoPromptOpts,
): string {
  const styleBase = applyTemplate(template.videoPromptTemplate, vars);
  const motionBlock = opts ? buildVideoMotionBlock(opts) : "";
  return (
    joinParts(
      styleBase,
      vars.headline ? `Campaign theme: ${vars.headline}.` : "",
      motionBlock,
      MARKET_HINTS[vars.market],
      FRAMING_VIDEO[vars.framing],
      vars.extra,
      opts ? "No on-screen text, subtitles, logos, or watermarks" : "",
    ) + VIDEO_BGM_HINT
  );
}

/** Wizard video step — picks template from visual style / templateId. */
export function buildWizardVideoPrompt(
  templateId: TemplateId,
  vars: PromptVariables,
  opts: VideoPromptOpts = {},
): string {
  return buildVideoPrompt(getTemplate(templateId), vars, opts);
}

/** Seedance image-to-video: product promo from generated keyframe. */
export function buildProductPromoVideoPrompt(
  vars: PromptVariables,
  opts: VideoPromptOpts = {},
  templateId: TemplateId = "product-reel",
): string {
  return buildWizardVideoPrompt(templateId, vars, opts);
}

/** Seedance image-to-video after Nano Banana step in combined workflow. */
export function buildImageToVideoPrompt(
  vars: PromptVariables,
  opts: VideoPromptOpts = {},
  templateId: TemplateId = "product-reel",
): string {
  return buildWizardVideoPrompt(templateId, vars, opts);
}

/** Nano Banana still for one storyboard scene (product from IMAGE 1). */
export function buildStoryboardSceneImagePrompt(
  scene: StoryboardScenePlan,
  plan: VideoStoryboardPlan,
  vars: PromptVariables,
): string {
  return joinParts(
    `Storyboard still ${scene.imageIndex}/${plan.scenes.length} for a photorealistic product video.`,
    plan.visualDirection ? `Series look: ${plan.visualDirection}.` : "",
    plan.theme ? `Story theme: ${plan.theme}.` : "",
    `Scene role: ${scene.role}.`,
    scene.imagePrompt,
    imageReferenceAnchorBlock(vars),
    "Keep the exact product from IMAGE 1 — same item, colors, materials, and shape. Do not swap for a different product category.",
    MARKET_HINTS[vars.market],
    FRAMING_IMAGE[vars.framing],
    vars.extra,
    "9:16 vertical, photorealistic commercial photography, no readable text, no watermark, no social UI.",
  );
}

/** Second still for start→end image-to-video (Nano Banana). */
export function buildEndFrameImagePrompt(vars: PromptVariables): string {
  const product = vars.product?.trim() || "the product";
  return joinParts(
    `Create a second vertical ad frame for ${product} — must be a DIFFERENT composition from IMAGE 1.`,
    buildSecondFrameSceneHint(product, vars.framing),
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
  templateId: TemplateId = "product-reel",
): string {
  const creativity = opts.creativity ?? "lively";
  return joinParts(
    buildWizardVideoPrompt(templateId, vars, { ...opts, multiAngle: true, creativity }),
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
export function buildReferenceVideoPrompt(
  vars: PromptVariables,
  templateId?: TemplateId,
): string {
  const styleMood = templateId
    ? applyTemplate(getTemplate(templateId).videoPromptTemplate, vars)
    : "";
  return (
    joinParts(
      "Reference-to-video. @Video1 is the PRIMARY reference: copy its camera angles, shot composition, hand movements, table/scene layout, pacing, and edit rhythm.",
      "@Image1 performs the same actions and scene structure as @Video1 — only swap the bracelet/beads to match @Image1 colors, materials, and bead pattern.",
      "If @Video1 shows hands stringing or holding beads, show natural hands with @Image1's product — do NOT collapse into a product-only macro or slow push-in unless @Video1 does that.",
      "Keep the same background type, lighting direction, and framing as @Video1 (e.g. white tabletop, top-down craft shot if that is what @Video1 shows).",
      "Do not copy identifiable faces, brand logos, social UI, or readable on-screen text from @Video1.",
      styleMood
        ? `When not conflicting with @Video1, match this brand/style mood: ${styleMood}.`
        : "",
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
