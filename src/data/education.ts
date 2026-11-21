/**
 * Education, coursework, academic projects, awards and certifications.
 * Placeholders use {{TOKENS}}. Empty lists are not rendered.
 */
import { site } from '../config/site';

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  /** Link to the issuer's website; the issuer name becomes a link. */
  issuerUrl?: string;
  /** Reference or credential number, shown as text (e.g. on a letter). */
  reference?: string;
  /** Online credential-verification URL. Shown as "View credential" once filled in. */
  url?: string;
}

export interface Award {
  title: string;
  year: string;
  detail?: string;
}

export interface AcademicProject {
  title: string;
  summary: string;
}

export const education = {
  degree: site.degreeName,
  university: site.universityName,
  graduation: site.graduationYear,
  // TODO(owner): optional, e.g. "Second Class Honours (Upper Division) expected". Leave empty to hide.
  standing: '',

  // TODO(owner): replace with the units you have taken or are taking.
  coursework: [
    'Data Structures and Algorithms',
    'Object-Oriented Programming',
    'Database Systems',
    'Software Engineering',
    'Computer Networks',
    'Operating Systems',
    'Web Development',
    'Mobile Application Development',
  ],

  // TODO(owner): coursework or final-year projects. Remove an entry you do not need.
  academicProjects: [
    {
      title: 'Microservices-based e-commerce platform',
      summary:
        'A system that makes it easier to move money between East African countries, by linking local payment systems and retailers to the networks and banks of each customer’s home country.',
    },
  ] satisfies AcademicProject[],

  // TODO(owner): scholarships, prizes or competitions. Leave the list empty to hide it.
  awards: [] as Award[],
};

// TODO(owner): certifications with issuer, date and credential link. Leave the list empty to hide it.
export const certifications: Certification[] = [
  {
    name: 'Letter of Recommendation from the CEO of Lish AI Limited',
    issuer: 'Lish AI Limited',
    issuerUrl: 'https://www.lishailabs.com',
    date: '1 September 2026',
    reference: 'LISHAILABS/RECOMM/VOL. 1/040',
  },
];
