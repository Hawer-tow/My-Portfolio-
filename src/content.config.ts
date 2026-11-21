import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { projectAreas } from './lib/areas';

/**
 * Projects: one Markdown/MDX file per project in src/content/projects.
 * The file name (or a `slug` in frontmatter) becomes the URL: /projects/<id>/.
 * Every project uses the same case-study template (src/layouts/CaseStudyLayout.astro).
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Short name for compact links, e.g. "Dateroem". Defaults to the title. */
      shortTitle: z.string().optional(),
      slug: z.string().optional(),
      summary: z.string(),
      role: z.string(),
      period: z.string(),
      team: z.string(),
      status: z.string(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      order: z.number().int().default(100),
      areas: z.array(z.enum(projectAreas)).min(1),
      /** 5–7 key technologies for cards. */
      stack: z.array(z.string()).min(1).max(8),
      /** Full stack for the case study, grouped. */
      stackGroups: z.array(z.object({ label: z.string(), items: z.array(z.string()).min(1) })).default([]),
      cover: image(),
      coverAlt: z.string(),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string(),
            /** Optional heading the image is grouped under, e.g. "Customer website". */
            group: z.string().optional(),
          }),
        )
        .default([]),
      /** A short screen recording, self-hosted in /public (e.g. "/media/demo.mp4"). */
      walkthrough: z
        .object({
          src: z.string(),
          poster: image(),
          /** Text alternative: what the video shows, scene by scene. */
          description: z.string(),
          /** WebVTT captions in /public (for a silent video: its on-screen text). */
          captions: z.string(),
          width: z.number().int().positive(),
          height: z.number().int().positive(),
        })
        .optional(),
      challenges: z
        .array(
          z.object({
            title: z.string(),
            problem: z.string(),
            approach: z.string(),
            outcome: z.string(),
          }),
        )
        .default([]),
      results: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      learned: z.array(z.string()).default([]),
      links: z
        .object({
          source: z.string().optional(),
          /** Private code: show "Source available on request" instead of a link. */
          sourceOnRequest: z.boolean().default(false),
          demo: z.string().optional(),
          /** Short note shown next to the live-site link, e.g. "under maintenance". */
          demoNote: z.string().optional(),
          video: z.string().optional(),
          docs: z.string().optional(),
          /** Link text for docs, e.g. "System overview (PDF)". Defaults to "Documentation". */
          docsLabel: z.string().optional(),
          docsNote: z.string().optional(),
        })
        .prefault({}),
    }),
});

export const collections = { projects };
