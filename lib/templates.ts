import type { ImageInputMode } from "@/lib/image-input-mode";
import { getTemplateConfig } from "@/lib/template-slots";

export type TemplateId =
  | "paper-sticker-reel"
  | "product-reel"
  | "crystal-promo"
  | "shop-promo"
  | "info-poster"
  | "brand-fit"
  | "brand-campaign"
  | "brand-video"
  | "creative-video"
  | "testimonial"
  | "custom";

export type MarketingTemplate = {
  id: TemplateId;
  name: string;
  description: string;
  icon: string;
  aspectRatio: string;
  duration: string;
  fast: boolean;
  resolution: string;
  motionStrength: number;
  camera: string;
  avoidOnScreenText: boolean;
  generateAudio: boolean;
  imagePromptTemplate: string;
  imageEditPromptTemplate: string;
  videoPromptTemplate: string;
  negativePrompt: string;
};

export const VIDEO_BGM_HINT =
  ", soft instrumental background music only, no voiceover, no speech, no lyrics";

export const TEMPLATES: MarketingTemplate[] = [
  {
    id: "paper-sticker-reel",
    name: "Paper + sticker reel",
    description: "IG-style paper note, product sticker, cozy background — headline from your text.",
    icon: "📄",
    aspectRatio: "9:16",
    duration: "6",
    fast: true,
    resolution: "480p",
    motionStrength: 28,
    camera: "Slow Push In",
    avoidOnScreenText: false,
    generateAudio: true,
    imagePromptTemplate:
      "Vertical social ad, torn paper note collage style, cozy lifestyle background with book and warm bokeh. Headline theme: {{headline}}. {{subline}}. Product {{product}} as hero sticker with white outline, sparkles, no real human faces, 9:16",
    imageEditPromptTemplate:
      "Create a vertical IG-style ad: torn paper note layout, cozy background. Keep exact {{product}} from reference as sticker with white outline. Visual theme for text area: {{headline}} — {{subline}}. Match style reference if provided. No photorealistic faces. 9:16",
    videoPromptTemplate:
      "Gentle motion on {{product}} sticker ad, subtle paper float, sparkle twinkle, cozy background, stable camera, no new people or faces",
    negativePrompt:
      "real human face, portrait, celebrity, blurry, low quality, watermark, speech, voiceover",
  },
  {
    id: "product-reel",
    name: "Product showcase",
    description: "9:16 reel — hero product shot with gentle motion.",
    icon: "📦",
    aspectRatio: "9:16",
    duration: "6",
    fast: true,
    resolution: "480p",
    motionStrength: 30,
    camera: "Slow Push In",
    avoidOnScreenText: true,
    generateAudio: true,
    imagePromptTemplate:
      "Professional product photography of {{product}}, centered composition, soft studio lighting, clean background, high-end commercial look, no text, no watermark, 9:16 vertical framing",
    imageEditPromptTemplate:
      "Enhance this photo into a premium vertical social ad. Keep the exact same {{product}} from the reference — same shape, colors, and materials. Do not replace it with a person or a different object. Clean studio background, soft lighting, commercial look, no text, no watermark, 9:16 vertical framing",
    videoPromptTemplate:
      "Slow cinematic push-in on {{product}}, subtle light shimmer, stable camera, premium commercial feel, no on-screen text, no subtitles, no logos",
    negativePrompt:
      "text, subtitles, logo, watermark, speech, voiceover, dialogue, lyrics, blurry, distorted hands, low quality, jitter",
  },
  {
    id: "crystal-promo",
    name: "Crystal / dark mood",
    description: "Dark luxury look — gold accents, bokeh, ideal for crystals and spiritual SMB.",
    icon: "💎",
    aspectRatio: "9:16",
    duration: "6",
    fast: true,
    resolution: "480p",
    motionStrength: 26,
    camera: "Slow Push In",
    avoidOnScreenText: true,
    generateAudio: true,
    imagePromptTemplate:
      "Dark luxury product ad for {{product}}, black background with soft gold bokeh, crystal sparkle highlights, minimal text space, premium HK boutique aesthetic, 9:16 vertical",
    imageEditPromptTemplate:
      "Enhance for dark luxury crystal ad. Keep exact {{product}} from reference. Black/dark gradient background, gold accent lighting, subtle sparkle, premium mood. Theme: {{headline}}. No faces. 9:16 vertical",
    videoPromptTemplate:
      "Slow push-in on {{product}}, subtle sparkle shimmer, dark luxury mood, stable camera, no on-screen text",
    negativePrompt:
      "bright white background, cartoon, face, speech, voiceover, blurry, low quality",
  },
  {
    id: "shop-promo",
    name: "Shop / offer promo",
    description: "Vertical promo for a local business or limited-time offer.",
    icon: "🏪",
    aspectRatio: "9:16",
    duration: "8",
    fast: true,
    resolution: "480p",
    motionStrength: 28,
    camera: "Slow Pull Out",
    avoidOnScreenText: true,
    generateAudio: true,
    imagePromptTemplate:
      "Welcoming storefront or service scene for {{business}}, warm inviting atmosphere, {{offer}} mood, professional marketing photo, no text on image, vertical 9:16",
    imageEditPromptTemplate:
      "Enhance this photo for a local business promo. Keep the same storefront, product, or scene from the reference — do not add people unless they are already in the photo. Warm inviting atmosphere for {{business}}, {{offer}} mood, no text on image, 9:16 vertical",
    videoPromptTemplate:
      "Gentle pull-out revealing {{business}} scene, warm lighting, calm promotional vibe, no text overlays, no subtitles",
    negativePrompt:
      "text, subtitles, watermark, speech, voiceover, dialogue, lyrics, chaotic motion, horror, low resolution",
  },
  {
    id: "info-poster",
    name: "Premium info poster",
    description:
      "White-background IG info graphic — single theme, simplified copy, category visuals (anti-generic-AI layout).",
    icon: "📋",
    aspectRatio: "9:16",
    duration: "6",
    fast: true,
    resolution: "480p",
    motionStrength: 24,
    camera: "Slow Push In",
    avoidOnScreenText: false,
    generateAudio: true,
    imagePromptTemplate:
      "Premium white-background vertical info poster for {{product}}. Single theme: {{headline}}. Selling points: {{subline}}. Clean hierarchy, airy layout, category-appropriate accents, not overcrowded.",
    imageEditPromptTemplate:
      "Create a premium white/off-white info poster. Keep exact {{product}} from reference. ONE headline theme: {{headline}}. Bullets: {{subline}}. Editorial IG carousel style, generous whitespace, accurate Chinese typography.",
    videoPromptTemplate:
      "Gentle push-in on {{product}} info poster, subtle sparkle, stable camera, preserve on-screen text legibility",
    negativePrompt:
      "cluttered layout, overcrowded text blocks, dark muddy background, neon gradients, generic AI template frame, watermark, social media UI, blurry illegible text, misspelled characters, cartoon, low quality, speech, voiceover",
  },
  {
    id: "brand-fit",
    name: "Brand-fit ad",
    description: "Match analyzed website/social brand DNA — mood, colors, copy tone.",
    icon: "🔗",
    aspectRatio: "9:16",
    duration: "6",
    fast: true,
    resolution: "480p",
    motionStrength: 28,
    camera: "Slow Push In",
    avoidOnScreenText: false,
    generateAudio: true,
    imagePromptTemplate:
      "Vertical ad matching {{business}} brand style for {{product}}. Theme: {{headline}}. {{subline}}. Same visual DNA as their existing marketing.",
    imageEditPromptTemplate:
      "Create ad matching this brand's style. Keep exact {{product}} from reference. Headline: {{headline}}. Bullets: {{subline}}. Cohesive with brand colors and mood.",
    videoPromptTemplate:
      "Gentle motion on brand-fit {{product}} ad, stable camera, preserve legibility",
    negativePrompt:
      "generic AI template, off-brand colors, wrong tone, cluttered layout, watermark, social UI, blurry text, low quality, speech, voiceover",
  },
  {
    id: "brand-video",
    name: "Brand-fit video",
    description: "DeepSeek plans Seedance motion prompt from analyzed brand DNA.",
    icon: "🎬",
    aspectRatio: "9:16",
    duration: "6",
    fast: true,
    resolution: "480p",
    motionStrength: 28,
    camera: "Slow Push In",
    avoidOnScreenText: true,
    generateAudio: true,
    imagePromptTemplate:
      "Product keyframe for {{product}} — {{business}} brand mood, {{headline}}",
    imageEditPromptTemplate:
      "Keep exact {{product}} from reference. Brand mood for {{business}}.",
    videoPromptTemplate:
      "Gentle cinematic motion on {{product}} for {{business}}, brand-matched lighting and pacing, stable camera, no on-screen text",
    negativePrompt:
      "on-screen text, subtitles, logo, watermark, speech, voiceover, dialogue, lyrics, chaotic motion, blurry, low quality",
  },
  {
    id: "creative-video",
    name: "Creative video prompt",
    description: "Describe your Reel idea — DeepSeek writes Seedance motion prompt for your product.",
    icon: "✨",
    aspectRatio: "9:16",
    duration: "8",
    fast: true,
    resolution: "480p",
    motionStrength: 32,
    camera: "Orbit Around Subject",
    avoidOnScreenText: true,
    generateAudio: true,
    imagePromptTemplate: "Product keyframe for {{product}} — {{headline}}",
    imageEditPromptTemplate: "Keep exact {{product}} from reference.",
    videoPromptTemplate:
      "Cinematic motion on {{product}}, creative commercial pacing, dynamic but stable camera, no on-screen text",
    negativePrompt:
      "on-screen text, subtitles, logo, watermark, speech, voiceover, dialogue, lyrics, chaotic jitter, blurry, low quality",
  },
  {
    id: "brand-campaign",
    name: "Brand campaign set",
    description: "Analyze brand → generate 3 linked posts (hero, selling points, offer).",
    icon: "🎯",
    aspectRatio: "9:16",
    duration: "6",
    fast: true,
    resolution: "480p",
    motionStrength: 28,
    camera: "Slow Push In",
    avoidOnScreenText: false,
    generateAudio: true,
    imagePromptTemplate:
      "Linked brand campaign for {{business}} — {{product}}. Slide theme: {{headline}}. {{subline}}. Cohesive 3-post series.",
    imageEditPromptTemplate:
      "Brand campaign slide. Keep exact {{product}} from reference. Headline: {{headline}}. {{subline}}. Match analyzed brand DNA across the set.",
    videoPromptTemplate:
      "Gentle motion on brand campaign {{product}} ad, stable camera, preserve legibility",
    negativePrompt:
      "generic AI template, off-brand colors, inconsistent series style, cluttered layout, watermark, social UI, blurry text, low quality, speech, voiceover",
  },
  {
    id: "testimonial",
    name: "Customer story",
    description: "Product on a desk — warm lifestyle look for reviews.",
    icon: "💬",
    aspectRatio: "9:16",
    duration: "6",
    fast: true,
    resolution: "480p",
    motionStrength: 25,
    camera: "Static Locked Shot",
    avoidOnScreenText: true,
    generateAudio: true,
    imagePromptTemplate:
      "Authentic customer-style photo of {{product}} on a natural surface, soft daylight, trustworthy and warm, lifestyle marketing, no text, vertical frame",
    imageEditPromptTemplate:
      "Enhance this lifestyle product photo for a testimonial-style ad. Keep the exact same {{product}} from the reference. Soft natural daylight, trustworthy and warm, no text, 9:16 vertical",
    videoPromptTemplate:
      "Very subtle motion on {{product}}, almost static, authentic testimonial feel, no generated text on screen",
    negativePrompt:
      "text, subtitles, logo, speech, voiceover, dialogue, lyrics, exaggerated motion, artificial look",
  },
  {
    id: "custom",
    name: "Custom",
    description: "All components optional — you control prompts in Advanced.",
    icon: "✨",
    aspectRatio: "9:16",
    duration: "auto",
    fast: true,
    resolution: "480p",
    motionStrength: 30,
    camera: "Slow Push In",
    avoidOnScreenText: true,
    generateAudio: true,
    imagePromptTemplate: "{{headline}} {{subline}} {{product}}",
    imageEditPromptTemplate:
      "Enhance this reference photo for a vertical social ad. Keep the same subject and composition from the reference. {{headline}} {{subline}} Clean professional look, no watermark, 9:16",
    videoPromptTemplate: "Cinematic motion on {{product}}, stable, no on-screen text",
    negativePrompt:
      "text, subtitles, logo, watermark, speech, voiceover, dialogue, lyrics, blurry, distorted, low quality",
  },
];

export function applyTemplate(
  template: string,
  vars: {
    product: string;
    business?: string;
    offer?: string;
    headline?: string;
    subline?: string;
  },
): string {
  return template
    .replace(/\{\{product\}\}/g, vars.product || "the product")
    .replace(/\{\{business\}\}/g, vars.business || vars.product || "the business")
    .replace(/\{\{offer\}\}/g, vars.offer || "special offer")
    .replace(/\{\{headline\}\}/g, vars.headline || vars.product || "special offer")
    .replace(/\{\{subline\}\}/g, vars.subline || "");
}

export function getTemplate(id: TemplateId): MarketingTemplate {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export function defaultImageInputModeForTemplate(id: TemplateId): ImageInputMode {
  return getTemplateConfig(id).defaultImageInputMode;
}
