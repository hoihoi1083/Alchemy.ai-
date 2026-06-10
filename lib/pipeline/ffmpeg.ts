import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";

function run(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${cmd} exited ${code}: ${stderr}`));
      }
    });
  });
}

export async function ensureFfmpeg(): Promise<void> {
  try {
    await run("ffmpeg", ["-version"]);
    await run("ffprobe", ["-version"]);
  } catch {
    throw new Error(
      "ffmpeg/ffprobe not found. Install with `brew install ffmpeg` and retry.",
    );
  }
}

export async function downloadToFile(url: string, outPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download video: ${res.status} ${res.statusText}`);
  }
  const data = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(outPath, data);
}

export async function extractAudioWav(
  inputVideo: string,
  outputWav: string,
): Promise<void> {
  await run("ffmpeg", [
    "-y",
    "-i",
    inputVideo,
    "-vn",
    "-ac",
    "1",
    "-ar",
    "16000",
    "-c:a",
    "pcm_s16le",
    outputWav,
  ]);
}

export async function mergeAudioIntoVideo(
  inputVideo: string,
  inputAudio: string,
  outputVideo: string,
): Promise<void> {
  await run("ffmpeg", [
    "-y",
    "-i",
    inputVideo,
    "-i",
    inputAudio,
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-shortest",
    outputVideo,
  ]);
}

function runCapture(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(`${cmd} exited ${code}: ${stderr}`));
    });
  });
}

export async function getMediaDurationSeconds(filePath: string): Promise<number> {
  const out = await runCapture("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath,
  ]);
  const n = parseFloat(out);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error("Could not read video duration.");
  }
  return n;
}

export async function videoHasAudioStream(filePath: string): Promise<boolean> {
  const out = await runCapture("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "a",
    "-show_entries",
    "stream=index",
    "-of",
    "csv=p=0",
    filePath,
  ]);
  return out.length > 0;
}

/** Loop background music to video length; mix with existing audio if present. */
export async function addBackgroundMusic(
  inputVideo: string,
  musicPath: string,
  outputVideo: string,
  volume = 0.28,
): Promise<void> {
  const duration = await getMediaDurationSeconds(inputVideo);
  const hasAudio = await videoHasAudioStream(inputVideo);
  const dur = duration.toFixed(3);

  if (hasAudio) {
    await run("ffmpeg", [
      "-y",
      "-i",
      inputVideo,
      "-stream_loop",
      "-1",
      "-i",
      musicPath,
      "-filter_complex",
      `[1:a]volume=${volume},atrim=0:${dur},asetpts=PTS-STARTPTS[bgm];[0:a]volume=0.9[vid];[vid][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]`,
      "-map",
      "0:v:0",
      "-map",
      "[aout]",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-t",
      dur,
      outputVideo,
    ]);
    return;
  }

  await run("ffmpeg", [
    "-y",
    "-i",
    inputVideo,
    "-stream_loop",
    "-1",
    "-i",
    musicPath,
    "-filter_complex",
    `[1:a]volume=${volume},atrim=0:${dur},asetpts=PTS-STARTPTS[aout]`,
    "-map",
    "0:v:0",
    "-map",
    "[aout]",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-t",
    dur,
    outputVideo,
  ]);
}

function escapeSubtitlePathForFilter(inputPath: string): string {
  const normalized = path.resolve(inputPath);
  return normalized.replace(/\\/g, "\\\\").replace(/:/g, "\\:").replace(/'/g, "\\'");
}

export async function burnSubtitles(
  inputVideo: string,
  inputSrt: string,
  outputVideo: string,
): Promise<void> {
  const subtitleArg = `subtitles='${escapeSubtitlePathForFilter(inputSrt)}'`;
  await run("ffmpeg", [
    "-y",
    "-i",
    inputVideo,
    "-vf",
    subtitleArg,
    "-c:a",
    "copy",
    outputVideo,
  ]);
}

export async function attachSoftSubtitleTrack(
  inputVideo: string,
  inputSrt: string,
  outputVideo: string,
): Promise<void> {
  await run("ffmpeg", [
    "-y",
    "-i",
    inputVideo,
    "-i",
    inputSrt,
    "-map",
    "0",
    "-map",
    "1:0",
    "-c",
    "copy",
    "-c:s",
    "mov_text",
    "-metadata:s:s:0",
    "language=zho",
    outputVideo,
  ]);
}

/** Encode PNG frame sequence (frame_0000.png …) to H.264 MP4. */
export async function encodeImageSequence(
  framesDir: string,
  outputVideo: string,
  fps: number,
  durationSec: number,
): Promise<void> {
  const pattern = path.join(framesDir, "frame_%04d.png");
  await run("ffmpeg", [
    "-y",
    "-framerate",
    String(fps),
    "-i",
    pattern,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-t",
    String(durationSec),
    outputVideo,
  ]);
}
