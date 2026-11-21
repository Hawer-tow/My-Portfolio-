/**
 * Experience timeline, newest first.
 * Entries with {{TOKENS}} are placeholders: replace them, or set `hidden: true` to leave one out.
 * Do not invent roles: only list work you have done.
 */

export interface ExperienceEntry {
  role: string;
  organisation: string;
  /** Free text, e.g. "Sep 2026 – present". */
  dates: string;
  location?: string;
  /** Two or three achievements, each starting with a verb. */
  highlights: string[];
  /** Optional link to a case study on this site, e.g. "/projects/dateroem/". */
  link?: { href: string; label: string };
  hidden?: boolean;
}

export const experience: ExperienceEntry[] = [
  {
    role: 'Software Developer (sole developer)',
    organisation: 'Dateroem Wood Sales, family timber business',
    // From the project records: work ran to the handover on 15 November 2026.
    dates: 'Jun 2026 – Nov 2026',
    highlights: [
      'Gathered requirements with the business owner and board, then designed and built a platform with a customer website, an Android staff app and a desktop admin console.',
      'Integrated Safaricom M-Pesa checkout, live in production, and verified every payment callback against Safaricom’s own transaction query.',
      'Wrote eighteen technical documents covering architecture, API, database and operations, so the system can be run and handed over.',
    ],
    link: { href: '/projects/dateroem/', label: 'Read the case study' },
  },
  {
    // TODO(owner): an internship, or set hidden: true.
    role: 'Software Engineering Intern',
    organisation: 'Lish AI Limited',
    dates: 'Jun 2026 – Aug 2026',
    highlights: [
      'Learnt to use Python for data analysis, and to connect backend and frontend applications through APIs.',
      'Worked with RESTful APIs, implemented authentication, and used Git to manage project versions properly.',
    ],
  },
  {
    // TODO(owner): a club, society or volunteer role, or set hidden: true.
    role: 'Club member',
    organisation: 'Computer Society of Kirinyaga University – Cyber Security Club',
    // TODO(owner): when you joined, e.g. "2025 – present" (reads better than a meeting day).
    dates: 'Weekly, on Wednesdays',
    highlights: [
      'Worked in a team to handle cyber security issues, such as protecting websites from vulnerabilities.',
      'Improved how I build software for security and reliability, so the systems I put into production are secure.',
    ],
  },
];
