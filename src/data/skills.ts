/**
 * Skills, grouped. No percentages or ratings: each skill can point to the project(s) that prove it.
 *
 * `usedIn` lists project ids (the file name in src/content/projects, e.g. "dateroem").
 * Links to draft projects are left out automatically.
 */

export interface Skill {
  name: string;
  /** Short qualifier shown after the name, e.g. "JWT, roles". */
  detail?: string;
  usedIn?: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: Skill[];
}

const flagship = ['dateroem'];
const both = ['dateroem', 'dateroem-ai'];
const ai = ['dateroem-ai'];

export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    title: 'Languages',
    skills: [
      { name: 'Java', usedIn: flagship },
      { name: 'Kotlin', usedIn: flagship },
      { name: 'Python', usedIn: both },
      { name: 'JavaScript', detail: 'ES2022', usedIn: flagship },
      // TODO(owner): keep TypeScript only if you are comfortable with it (this site is written in it).
      { name: 'TypeScript', detail: 'this portfolio' },
      { name: 'SQL', detail: 'MySQL', usedIn: flagship },
      { name: 'HTML and CSS', usedIn: flagship },
      { name: 'Bash', usedIn: flagship },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    skills: [
      { name: 'Spring Boot REST APIs', usedIn: flagship },
      { name: 'FastAPI services', usedIn: flagship },
      { name: 'Backend-for-frontend architecture', usedIn: flagship },
      { name: 'Authentication and authorisation', detail: 'JWT, roles', usedIn: flagship },
      { name: 'Payment integration', detail: 'M-Pesa Daraja', usedIn: flagship },
      { name: 'SMS one-time codes, email, scheduled jobs', usedIn: flagship },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    skills: [
      { name: 'React, React Router, Vite', usedIn: flagship },
      { name: 'Responsive layouts', usedIn: flagship },
      { name: 'Accessibility', detail: 'reduced motion, screen-reader labels', usedIn: flagship },
      { name: 'Theming with CSS custom properties', usedIn: flagship },
      { name: 'Performance-minded media', usedIn: flagship },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    skills: [
      { name: 'Android with Kotlin and Jetpack Compose', detail: 'Material 3', usedIn: flagship },
      { name: 'Biometrics, camera and media, location', usedIn: flagship },
      { name: 'Offline-first patterns', usedIn: flagship },
      { name: 'Background SMS processing', usedIn: flagship },
    ],
  },
  {
    id: 'desktop',
    title: 'Desktop',
    skills: [
      {
        name: 'Python with PySide6 (Qt 6)',
        detail: 'custom painting, animation, data tables, process management',
        usedIn: both,
      },
    ],
  },
  {
    id: 'data',
    title: 'Data',
    skills: [
      { name: 'MySQL schema design', usedIn: flagship },
      { name: 'Versioned migrations', usedIn: flagship },
      { name: 'Stored procedures and functions', usedIn: flagship },
      { name: 'Indexing and backups', usedIn: flagship },
      { name: 'Geospatial and open data', detail: 'OpenStreetMap, GBIF, SQLite', usedIn: ai },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    skills: [
      { name: 'Password hashing and token sessions', usedIn: flagship },
      { name: 'Device and computer binding', usedIn: flagship },
      { name: 'Callback verification and rate limiting', usedIn: flagship },
      {
        name: 'Secrets handling and least privilege',
        detail: 'no stack traces exposed',
        usedIn: flagship,
      },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps and tools',
    skills: [
      { name: 'Linux, WSL2, systemd', usedIn: flagship },
      { name: 'Caddy reverse proxy and tunnelling', usedIn: flagship },
      { name: 'Git and GitHub', usedIn: flagship },
      { name: 'Gradle, Maven, npm', usedIn: flagship },
      { name: 'Android Studio, VS Code' },
    ],
  },
  {
    id: 'ai',
    title: 'AI integration',
    skills: [
      { name: 'LLM-powered assistants', detail: 'Anthropic API', usedIn: flagship },
      { name: 'Prompt design for role-aware help', usedIn: flagship },
      { name: 'On-device image matching', detail: 'ONNX Runtime', usedIn: ai },
    ],
  },
  {
    id: 'professional',
    title: 'Professional',
    skills: [
      { name: 'Requirements gathering with non-technical stakeholders', usedIn: flagship },
      { name: 'Technical writing', detail: '18-document set', usedIn: flagship },
      { name: 'Product thinking', usedIn: flagship },
      {
        name: 'Working to real business constraints',
        detail: 'live payments, field conditions',
        usedIn: flagship,
      },
    ],
  },
];

// TODO(owner): what you are learning now. Remove the list (or set
// features.showCurrentlyLearning to false) if you prefer not to show it.
export const currentlyLearning: string[] = [
  'Automated testing for Spring Boot and Android',
  'Docker and container-based deployment',
  'Cloud fundamentals',
];
