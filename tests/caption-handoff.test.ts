import { describe, expect, it } from "vitest";
import { normalizeCaptionHandoffVideoUrl } from "@/lib/caption-studio-draft";

describe("normalizeCaptionHandoffVideoUrl", () => {
  it("keeps relative pipeline URLs", () => {
    const url = "/api/pipeline-files/abc-123/final.mp4";
    expect(normalizeCaptionHandoffVideoUrl(url)).toBe(url);
  });

  it("strips host from absolute pipeline URLs", () => {
    expect(
      normalizeCaptionHandoffVideoUrl(
        "https://alchemy.example.com/api/pipeline-files/job-id/with-voice.mp4",
      ),
    ).toBe("/api/pipeline-files/job-id/with-voice.mp4");
  });

  it("passes through remote fal URLs unchanged", () => {
    const fal = "https://v3.fal.media/files/clip.mp4";
    expect(normalizeCaptionHandoffVideoUrl(fal)).toBe(fal);
  });
});
