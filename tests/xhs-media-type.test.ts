import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { inferXhsMediaType, mapRawPlatformPost } from "../lib/justoneapi-platform-search";
import { pickVideoUrl } from "../lib/justoneapi-client";
import { xhsShareHintsFromUrl } from "../lib/content-research-post-url";

describe("XHS media type inference", () => {
  it("xhsShareHintsFromUrl reads type=normal from discovery share link", () => {
    const hints = xhsShareHintsFromUrl(
      "https://www.xiaohongshu.com/discovery/item/6a48bd9d000000001603ce32?type=normal&xsec_token=abc",
    );
    assert.equal(hints.shareType, "normal");
    assert.equal(hints.xsecToken, "abc");
  });

  it("8-image carousel with video stream metadata stays image", () => {
    const videoUrl = pickVideoUrl({
      media: {
        stream: {
          h264: [{ master_url: "http://sns-video-v14.xhscdn.com/stream/110/259/foo.mp4" }],
        },
      },
    });
    assert.ok(videoUrl);
    assert.equal(inferXhsMediaType("normal", "normal", 8, videoUrl), "image");

    const post = mapRawPlatformPost(
      "xiaohongshu",
      {
        share_type: "normal",
        note: {
          type: "normal",
          display_title: "黑曜石攻略",
          images_list: Array.from({ length: 8 }, (_, i) => ({
            url: `https://ci.xiaohongshu.com/s${i}.jpg`,
          })),
          video: {
            media: {
              stream: {
                h264: [{ master_url: "http://sns-video-v14.xhscdn.com/stream/110/259/foo.mp4" }],
              },
            },
          },
        },
      },
      0,
    );
    assert.equal(post?.mediaType, "image");
    assert.equal(post?.imageUrls?.length, 8);
    assert.equal(post?.videoUrl, undefined);
  });

  it("true video note without carousel images is video", () => {
    assert.equal(inferXhsMediaType("video", undefined, 0, "http://v.mp4"), "video");
  });
});
