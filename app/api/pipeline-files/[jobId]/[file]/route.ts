import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { jobDir } from "@/lib/pipeline/paths";

const ALLOWED_FILES = new Set([
  "input.mp4",
  "corrected.srt",
  "dubbed.wav",
  "final.mp4",
  "subtitled.mp4",
  "with-bgm.mp4",
  "composed.png",
  "composed.mp4",
]);

function contentType(fileName: string): string {
  if (fileName.endsWith(".mp4")) return "video/mp4";
  if (fileName.endsWith(".png")) return "image/png";
  if (fileName.endsWith(".srt")) return "application/x-subrip";
  if (fileName.endsWith(".wav")) return "audio/wav";
  return "application/octet-stream";
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ jobId: string; file: string }> },
) {
  const { jobId, file } = await context.params;
  if (!ALLOWED_FILES.has(file)) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const fullPath = path.join(jobDir(jobId), file);

  try {
    const data = await fs.readFile(fullPath);
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType(file),
        "Cache-Control": "no-store",
        "Content-Disposition": `inline; filename="${file}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
