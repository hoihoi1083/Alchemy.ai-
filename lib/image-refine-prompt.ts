/** Targeted edit prompt for nano-banana-2/edit (plain language, not @Image1 tags). */
export function buildImageRefinePrompt(userNote: string): string {
  const note = userNote.trim();
  return [
    note,
    "Edit the attached image in place.",
    "Keep the same layout, product, colors, and framing unless the change above requires otherwise.",
  ].join(" ");
}

export function normalizeImageSourceUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("v");
    return parsed.toString();
  } catch {
    return url.split("?")[0] ?? url;
  }
}

export function isSameImageAsset(a: string, b: string): boolean {
  try {
    const ua = new URL(a);
    const ub = new URL(b);
    return ua.origin === ub.origin && ua.pathname === ub.pathname;
  } catch {
    return a === b;
  }
}
