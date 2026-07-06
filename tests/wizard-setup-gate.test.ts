import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  evaluateProceedToImageGate,
  isContentResearchImagePath,
} from "../lib/wizard-setup-gate";

describe("wizard setup → image gate", () => {
  const base = {
    promotionMode: "concept" as const,
    workflowMode: "image-only" as const,
    promptExtra:
      "Style reference (小紅書). Borrow ONLY: layout rhythm. Do NOT copy reference subject matter, zodiac/星座/時事/其他品牌, or on-image text from the reference",
    effectivePromoteName: "男生戴水晶",
    hasReferenceImage: true,
    referenceAnalyzeBusy: false,
    imageCreativeMode: "reference-concept" as const,
    headline: "男生戴水晶",
    visualStyleId: "info-poster" as const,
    hasProductPhoto: false,
    isStoryboardOutput: false,
  };

  it("detects content research image path", () => {
    assert.ok(isContentResearchImagePath(base.promptExtra, "image-only"));
    assert.ok(!isContentResearchImagePath("plain extra", "image-only"));
  });

  it("blocks when research reference image missing", () => {
    assert.equal(
      evaluateProceedToImageGate({ ...base, hasReferenceImage: false }),
      "need_reference_image",
    );
  });

  it("blocks while reference is analyzing", () => {
    assert.equal(
      evaluateProceedToImageGate({ ...base, referenceAnalyzeBusy: true }),
      "reference_analyzing",
    );
  });

  it("blocks when headline missing on research path", () => {
    assert.equal(
      evaluateProceedToImageGate({
        ...base,
        effectivePromoteName: "",
        headline: "",
      }),
      "need_headline",
    );
  });

  it("allows ready concept research image path", () => {
    assert.equal(evaluateProceedToImageGate(base), null);
  });

  it("allows physical reference-concept without product photo on setup (upload on image step)", () => {
    assert.equal(
      evaluateProceedToImageGate({
        ...base,
        promotionMode: "physical",
        hasProductPhoto: false,
      }),
      null,
    );
  });
});
