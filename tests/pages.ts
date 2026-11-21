import { readFileSync } from 'node:fs';

/** Every page in the built sitemap, plus the 404 page, as paths. */
export function builtPages(): string[] {
  const xml = readFileSync(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1] ?? '/').pathname);
  return [...new Set([...paths, '/404.html'])];
}
