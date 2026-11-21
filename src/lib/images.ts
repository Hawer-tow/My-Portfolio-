import type { ImageMetadata } from 'astro';

/**
 * Resolve an image path from site config (e.g. "/images/profile/portrait.jpg") to an
 * optimisable asset in src/assets. Images in /public are never optimised by Astro,
 * so photos and screenshots live under src/assets/images instead.
 */
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpeg,jpg,png,webp,avif}',
);

export async function resolveImage(path: string): Promise<ImageMetadata> {
  const key = `/src/assets${path.startsWith('/') ? path : `/${path}`}`;
  const load = images[key];
  if (!load) {
    throw new Error(`Image "${path}" not found. Expected a file at ${key.slice(1)}.`);
  }
  return (await load()).default;
}
