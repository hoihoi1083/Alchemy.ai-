import type { WorkflowMode } from "@/lib/workflow-mode";

/** Step 1 — what the user wants to export. */
export type OutputGoal = WorkflowMode;

/** Image step — AI creates a new promo shot vs inspired by a reference ad. */
export type ImageCreativeMode = "promo-ai" | "reference-concept";

/** Video step — how motion is created. */
export type VideoCreativeMode =
  | "product-promo"
  | "reference-concept"
  | "image-to-video";

export const IMAGE_CREATIVE_MODES: ImageCreativeMode[] = [
  "promo-ai",
  "reference-concept",
];

export const VIDEO_CREATIVE_MODES: VideoCreativeMode[] = [
  "product-promo",
  "reference-concept",
  "image-to-video",
];

export function defaultImageModeForGoal(goal: OutputGoal): ImageCreativeMode {
  if (goal === "image-only") return "reference-concept";
  return "promo-ai";
}

export function defaultVideoModeForGoal(goal: OutputGoal): VideoCreativeMode {
  if (goal === "combined") return "image-to-video";
  return "product-promo";
}

export function videoModesForGoal(goal: OutputGoal): VideoCreativeMode[] {
  if (goal === "combined") {
    return ["image-to-video", "reference-concept", "product-promo"];
  }
  if (goal === "video-only") {
    return ["product-promo", "reference-concept"];
  }
  return [];
}
