import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { bgmFilePath, DEFAULT_BGM_TRACK, type BgmTrackId } from "@/lib/bgm/tracks";
import {
  addBackgroundMusic,
  downloadToFile,
  ensureFfmpeg,
} from "@/lib/pipeline/ffmpeg";
import { jobDir } from "@/lib/pipeline/paths";

export const runtime = "nodejs";
export const maxDuration = 120;

const TRACK_IDS = new Set<BgmTrackId>(["calm", "upbeat", "warm"]);

export async function POST(request: Request) {
  let body: { video_url?: string; track?: string } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const videoUrl = body?.video_url?.trim();
  if (!videoUrl) {
    return NextResponse.json({ error: "video_url is required." }, { status: 400 });
  }

  const track = (body?.track?.trim() || DEFAULT_BGM_TRACK) as BgmTrackId;
  if (!TRACK_IDS.has(track)) {
    return NextResponse.json({ error: "Invalid track." }, { status: 400 });
  }

  const musicPath = bgmFilePath(track);
  try {
    await fs.access(musicPath);
  } catch {
    return NextResponse.json(
      {
        error:
          "Background music files missing. Run: npm run setup:bgm (see public/bgm/README.md).",
        code: "BGM_FILES_MISSING",
      },
      { status: 503 },
    );
  }

  const jobId = crypto.randomUUID();
  const dir = jobDir(jobId);
  await fs.mkdir(dir, { recursive: true });

  const inputPath = path.join(dir, "input.mp4");
  const outputPath = path.join(dir, "with-bgm.mp4");

  try {
    await ensureFfmpeg();
    await downloadToFile(videoUrl, inputPath);
    await addBackgroundMusic(inputPath, musicPath, outputPath);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to add background music.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return NextResponse.json({
    videoUrl: `${base}/api/pipeline-files/${jobId}/with-bgm.mp4`,
    jobId,
    track,
  });
}
