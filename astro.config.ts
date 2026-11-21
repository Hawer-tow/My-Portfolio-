import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site';

/**
 * Site address and base path.
 * - siteUrl in src/config/site.ts wins once you fill it in (e.g. a custom domain).
 * - Otherwise the GitHub Pages workflow passes SITE_URL and BASE_PATH from actions/configure-pages,
 *   which handles both user sites (https://name.github.io/) and project sites (/repo-name/).
 * - Locally everything runs at http://localhost:4321/.
 */
const filled = (value: string | undefined) => Boolean(value && value.trim() && !value.includes('{{'));
const SITE_URL = filled(site.siteUrl) ? site.siteUrl : process.env.SITE_URL || 'http://localhost:4321';
const BASE_PATH = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  // Keep whitespace between inline elements (Astro 7's default 'jsx' mode removes it).
  compressHTML: true,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !/\/404\/?$/.test(page),
    }),
  ],
  image: {
    responsiveStyles: false,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
