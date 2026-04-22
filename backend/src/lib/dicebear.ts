/**
 * DiceBear Utility Library
 */

// Available styles: lorelei, adventurer, avataaars, bottts, initials, etc.
export type DiceBearStyle =
  | "lorelei"
  | "adventurer"
  | "avataaars"
  | "bottts"
  | "initials"
  | "pixel-art";

const DEFAULT_STYLE: DiceBearStyle = "lorelei";

/**
 * Generates a DiceBear CDN URL for a given seed and style.
 * @param seed - Unique identifier for the avatar (e.g. user ID or random string)
 * @param style - The visual style of the avatar
 * @returns URL to the SVG avatar
 */
export function generateAvatarUrl(
  seed: string,
  style: DiceBearStyle = DEFAULT_STYLE,
): string {
  // We use the 9.x API version for modern features
  const encodedSeed = encodeURIComponent(seed);
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodedSeed}`;
}

export function generateRandomAvatarUrl(): string {
  const randomSeed = Math.random().toString(36).substring(2, 11);
  return generateAvatarUrl(randomSeed);
}
