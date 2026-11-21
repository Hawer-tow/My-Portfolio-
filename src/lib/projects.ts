import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './url';

export type Project = CollectionEntry<'projects'>;

/**
 * Drafts appear in `npm run dev` (with a "Draft" badge) and in builds run with
 * SHOW_DRAFTS=true. They are never part of a normal production build.
 */
export const showDrafts = import.meta.env.DEV || process.env.SHOW_DRAFTS === 'true';

/** Published projects (plus drafts when allowed), sorted by `order`. */
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects', ({ data }) => showDrafts || !data.draft);
  return entries.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export function projectHref(project: Project): string {
  return withBase(`/projects/${project.id}/`);
}

export function projectShortTitle(project: Project): string {
  return project.data.shortTitle ?? project.data.title;
}
