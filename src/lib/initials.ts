/**
 * Initials for the monogram: first letter of the first and last words.
 * "{{YOUR_FULL_NAME}}" gives "YN" until the real name is filled in.
 * Kept free of imports so scripts/generate-images.mjs can import it directly.
 */
export function initials(name: string): string {
  const words = name.match(/\p{L}+/gu) ?? [];
  const first = words[0];
  if (first === undefined) return '?';
  const last = words.length > 1 ? words[words.length - 1] : undefined;
  return (first.charAt(0) + (last?.charAt(0) ?? '')).toUpperCase();
}
