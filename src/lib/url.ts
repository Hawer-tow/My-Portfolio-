/**
 * Base-aware URLs, so the site works both as a user site (https://name.github.io/)
 * and as a project site (https://name.github.io/portfolio/).
 */
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Prefix a site-relative path with the configured base. External and anchor links pass through. */
export function withBase(path: string): string {
  if (/^([a-z][a-z0-9+.-]*:|#)/i.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Absolute URL for canonical links, Open Graph tags and JSON-LD. */
export function absoluteUrl(path: string): string {
  return new URL(withBase(path), import.meta.env.SITE).href;
}
