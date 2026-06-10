import type { TemplateId } from "@/lib/templates";

/** Beginner-facing look — maps to template tuning + auto style hints for AI prompts. */
export type VisualStyleId =
  | "product"
  | "dark-premium"
  | "warm-shop"
  | "info-poster"
  | "brand-fit"
  | "brand-campaign"
  | "paper-layout";

export function isBrandVisualStyle(id: VisualStyleId): boolean {
  return id === "brand-fit" || id === "brand-campaign";
}

export function isCampaignVisualStyle(id: VisualStyleId): boolean {
  return id === "brand-campaign";
}

export type VisualStyleDef = {
  id: VisualStyleId;
  icon: string;
  templateId: TemplateId;
  usesCompositor: boolean;
  /** Appended to image/video AI prompts (user extra requirements are added after). */
  promptHint: string;
};

export const VISUAL_STYLES: VisualStyleDef[] = [
  {
    id: "product",
    icon: "📦",
    templateId: "product-reel",
    usesCompositor: false,
    promptHint:
      "Clean premium product photography: soft studio or bright lifestyle scene, neutral commercial look — suitable for any physical product category.",
  },
  {
    id: "dark-premium",
    icon: "💎",
    templateId: "crystal-promo",
    usesCompositor: false,
    promptHint:
      "Dark luxury mood: deep gradient background, soft gold bokeh and subtle sparkle highlights. Premium boutique ad — jewelry, watches, skincare, gifts, home goods, not only crystals.",
  },
  {
    id: "warm-shop",
    icon: "🏪",
    templateId: "shop-promo",
    usesCompositor: false,
    promptHint:
      "Warm inviting local-shop promotional mood: cozy lighting, approachable retail atmosphere. Emphasize shop name and offer when provided.",
  },
  {
    id: "info-poster",
    icon: "📋",
    templateId: "info-poster",
    usesCompositor: false,
    promptHint: "",
  },
  {
    id: "brand-fit",
    icon: "🔗",
    templateId: "brand-fit",
    usesCompositor: false,
    promptHint: "",
  },
  {
    id: "brand-campaign",
    icon: "🎯",
    templateId: "brand-campaign",
    usesCompositor: false,
    promptHint: "",
  },
  {
    id: "paper-layout",
    icon: "📄",
    templateId: "paper-sticker-reel",
    usesCompositor: true,
    promptHint: "",
  },
];

export const DEFAULT_VISUAL_STYLE: VisualStyleId = "product";

export function getVisualStyle(id: VisualStyleId): VisualStyleDef {
  return VISUAL_STYLES.find((s) => s.id === id) ?? VISUAL_STYLES[0];
}

export function visualStylePromptHint(id: VisualStyleId): string {
  return getVisualStyle(id).promptHint.trim();
}

/** Merge auto style hint with optional user-written extra requirements. */
export function mergePromptExtra(styleId: VisualStyleId, userExtra: string): string {
  const hint = visualStylePromptHint(styleId);
  const user = userExtra.trim();
  if (hint && user) return `${hint}. ${user}`;
  return hint || user;
}
