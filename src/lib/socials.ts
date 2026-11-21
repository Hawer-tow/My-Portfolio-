import { site } from '../config/site';
import { isFilled } from './placeholders';
import type { IconName } from './icons';

export interface SocialLink {
  id: keyof typeof site.socials;
  label: string;
  href: string;
  icon: IconName;
}

const labels: Record<keyof typeof site.socials, { label: string; icon: IconName }> = {
  github: { label: 'GitHub', icon: 'github' },
  linkedin: { label: 'LinkedIn', icon: 'linkedin' },
  x: { label: 'X', icon: 'x-logo' },
  instagram: { label: 'Instagram', icon: 'instagram' },
  tiktok: { label: 'TikTok', icon: 'tiktok' },
  blog: { label: 'Blog', icon: 'rss' },
};

/** Social links that have been filled in, in display order. Unset ones are dropped. */
export function getSocialLinks(): SocialLink[] {
  return (Object.keys(labels) as (keyof typeof site.socials)[])
    .filter((id) => isFilled(site.socials[id]))
    .map((id) => ({ id, href: site.socials[id], ...labels[id] }));
}
