import { site } from '../config/site';
import { isFilled } from './placeholders';
import { withBase } from './url';

export type NavKey = 'about' | 'projects' | 'skills' | 'experience' | 'education' | 'contact' | 'cv' | 'blog';

export interface NavItem {
  key: NavKey;
  label: string;
  href: string;
  external?: boolean;
}

/** Main navigation, built from the feature flags in site.ts. */
export function getNavItems(): NavItem[] {
  const { features } = site;
  const items: (NavItem | false)[] = [
    { key: 'about', label: 'About', href: withBase('/#about') },
    { key: 'projects', label: 'Projects', href: withBase('/#projects') },
    { key: 'skills', label: 'Skills', href: withBase('/#skills') },
    features.showExperience && { key: 'experience', label: 'Experience', href: withBase('/#experience') },
    features.showEducation && { key: 'education', label: 'Education', href: withBase('/#education') },
    { key: 'contact', label: 'Contact', href: withBase('/#contact') },
    { key: 'cv', label: 'CV', href: withBase('/cv/') },
    features.showBlog &&
      isFilled(site.socials.blog) && { key: 'blog', label: 'Blog', href: site.socials.blog, external: true },
  ];
  return items.filter((item): item is NavItem => item !== false);
}
