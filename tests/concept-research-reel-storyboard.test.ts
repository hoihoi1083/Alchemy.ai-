import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildContentAngleHandoff } from "../lib/content-research-apply";
import { resolveVideoGenerationKind } from "../lib/video-generation-path";
import { visualStyleAllowedForPromotion } from "../lib/promotion-styles";
import { isVisualStyleAllowedForWorkflow } from "../lib/visual-styles";
import { reelAngle, xhsPlan } from "./fixtures/content-research";

/** Parity checklist: concept research reel storyboard vs physical — same path, no product photo. */
describe("concept research reel storyboard parity", () => {
  it("concept and physical reel handoffs both use storyboard-video + video-only", () => {
    const concept = buildContentAngleHandoff(reelAngle, xhsPlan, "concept");
    const physical = buildContentAngleHandoff(reelAngle, xhsPlan, "physical", "Crystal bracelet");
    assert.equal(concept.visualStyleId, "storyboard-video");
    assert.equal(physical.visualStyleId, "storyboard-video");
    assert.equal(concept.workflowMode, "video-only");
    assert.equal(physical.workflowMode, "video-only");
    assert.equal(concept.product, undefined);
    assert.ok(physical.product);
  });

  it("storyboard-video is allowed in concept mode and video-only workflow", () => {
    assert.equal(visualStyleAllowedForPromotion("storyboard-video", "concept"), true);
    assert.equal(isVisualStyleAllowedForWorkflow("storyboard-video", "video-only"), true);
  });

  it("storyboard generation kind when reference MP4 + storyboard style (not R2V)", () => {
    assert.equal(
      resolveVideoGenerationKind({
        usesCompositor: false,
        isStoryboardOutput: true,
        shouldCinematicStitch: false,
        isConceptCinematicSingleOutput: false,
        cinematicSceneCount: 0,
        cinematicScenesLength: 0,
        usesProductAssistant: false,
        conceptTextVideoReady: false,
        videoCreativeMode: "reference-concept",
        useReferenceVideo: true,
        hasReferenceAd: true,
        useMultiAngleVideo: false,
      }),
      "storyboard",
    );
  });
});
