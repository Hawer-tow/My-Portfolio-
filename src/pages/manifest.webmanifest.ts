import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { initials } from '../lib/initials';
import { withBase } from '../lib/url';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: site.fullName,
        short_name: initials(site.fullName),
        description: site.seo.description,
        start_url: withBase('/'),
        scope: withBase('/'),
        display: 'browser',
        background_color: '#faf8f4',
        theme_color: '#faf8f4',
        icons: [
          { src: withBase('/icon-192.png'), sizes: '192x192', type: 'image/png' },
          { src: withBase('/icon-512.png'), sizes: '512x512', type: 'image/png' },
          { src: withBase('/favicon.svg'), sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
