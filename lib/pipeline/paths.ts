import path from "path";

export function jobsRoot(): string {
  return path.join(process.cwd(), ".pipeline-jobs");
}

export function jobDir(jobId: string): string {
  return path.join(jobsRoot(), jobId);
}
