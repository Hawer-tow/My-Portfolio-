/**
 * Site configuration: every personal detail and switch lives here.
 * Longer wording (hero summary, About text, motto) lives in src/data/profile.ts.
 *
 * Placeholders use the {{TOKEN}} format so you can find them:  npm run placeholders
 *
 * How values are treated:
 * - A value that is empty or still contains "{{" counts as "not set".
 * - Optional items (phone, social links, contact form, source link) are hidden while not set.
 * - Required text (name, degree, university...) is shown as written, so an unfilled token
 *   stays visible on the page until you replace it.
 *
 * Keep this file free of imports: astro.config.ts and the scripts in /scripts read it directly.
 */

export interface SiteConfig {
  fullName: string;
  shortName: string;
  roleTitle: string;
  degreeName: string;
  universityName: string;
  graduationYear: string;
  location: string;
  email: string;
  phone: string;
  languages: string[];
  socials: {
    github: string;
    linkedin: string;
    x: string;
    instagram: string;
    tiktok: string;
    blog: string;
  };
  sourceRepoUrl: string;
  cvPdfPath: string;
  profilePhoto: string;
  profilePhotoAlt: string;
  siteUrl: string;
  contactFormEndpoint: string;
  seo: {
    description: string;
    ogImage: string;
    ogImageAlt: string;
    locale: string;
  };
  features: {
    showBlog: boolean;
    showContactForm: boolean;
    showPhone: boolean;
    showProjectFilters: boolean;
    showExperience: boolean;
    showEducation: boolean;
    showCertifications: boolean;
    showCurrentlyLearning: boolean;
    showAvailability: boolean;
    showInterests: boolean;
  };
}

// TODO(owner): your name exactly as it should appear on the site, the CV and the monogram.
const fullName = 'Tenet Gathu Mwangi';
// TODO(owner): e.g. "BSc Software Engineering".
const degreeName = 'BSc Software Engineering';

export const site: SiteConfig = {
  fullName,

  // TODO(owner): first name, used in greetings ("Hello, I'm ...").
  shortName: 'Tenet',

  // {{YOUR_ROLE_TITLE}}: shown under your name in the hero and on the CV.
  // TODO(owner): change the wording if you prefer, e.g. "Full-stack developer".
  roleTitle: `Software Developer · ${degreeName} student`,

  degreeName,
  universityName: 'Kirinyaga University',
  graduationYear: '2028',
  location: 'Kirinyaga, Kenya', // Shown as text only.
  email: 'Tnthawer1@gmail.com',

  // Optional. Shown only when filled in AND features.showPhone is true.
  phone: '+254700878260',

  // TODO(owner): languages you speak, shown in the About facts and on the CV.
  languages: ['English', 'Kiswahili'],

  // Social links. Any left empty (or still a {{TOKEN}}) is not rendered anywhere.
  // TODO(owner): paste full URLs, e.g. "https://github.com/your-username".
  socials: {
    github: 'https://github.com/Hawer-tow',
    linkedin: '{{LINKEDIN_URL}}',
    x: 'https://x.com/tnthawer1',
    instagram: 'https://www.instagram.com/oma.hawer?mdxt=MW9hY3RrczJxOWIzdg==',
    tiktok: 'https://www.tiktok.com/@winter.h6?_r=1&_t=ZS-9AionR2SUAG',
    blog: '{{PERSONAL_BLOG_URL}}',
  },

  // Link to this site's source code, shown in the footer once filled in.
  // TODO(owner): replace with the repository URL, e.g. "https://github.com/your-username/portfolio".
  sourceRepoUrl: 'https://github.com/Hawer-tow/My-Portfolio-',

  // {{CV_PDF_PATH}}: path of the downloadable CV inside /public.
  // TODO(owner): put your PDF at public/cv/<Your-Full-Name>-CV.pdf and update this path.
  // Until then, `npm run cv:pdf` prints the HTML CV at /cv/ to this file as a placeholder.
  cvPdfPath: '/cv/Tenet-Gathu-Mwangi-CV.pdf',

  // {{PROFILE_PHOTO}}: path inside src/assets (so Astro can optimise it), 800 × 800, face centred.
  // TODO(owner): replace src/assets/images/profile/portrait.jpg with your photo.
  profilePhoto: '/images/profile/portrait.jpg',
  // TODO(owner): once your photo is in, change this to e.g. "Portrait of Jane Wanjiru".
  profilePhotoAlt: 'Your photo here',

  // {{SITE_URL}}: e.g. "https://your-username.github.io". While not set, the GitHub Pages
  // workflow supplies the correct address automatically, so deployment still works.
  siteUrl: 'https://hawer-tow.github.io',

  // Optional form service URL (e.g. a Formspree or Getform endpoint).
  // While not set, the contact form is replaced by an email link.
  contactFormEndpoint: '{{CONTACT_FORM_ENDPOINT}}',

  seo: {
    // TODO(owner): one or two sentences shown in search results and link previews.
    description: `Portfolio of ${fullName}, a software developer studying ${degreeName}. Case studies, skills, experience and CV.`,
    // Social preview image in /public, 1200 × 630. Regenerate with `npm run images`.
    ogImage: '/og/default.png',
    ogImageAlt: `${fullName}, Software Developer`,
    locale: 'en_GB',
  },

  // Switch whole sections on and off without editing components.
  features: {
    // No blog is built into this site. When true, a "Blog" link to socials.blog is added
    // to the navigation (only if that URL is filled in).
    showBlog: false,
    // Shows the contact form when contactFormEndpoint is set; otherwise an email button.
    showContactForm: true,
    showPhone: true,
    // Filter chips above the projects grid (needs projects in at least two areas).
    showProjectFilters: true,
    showExperience: true,
    showEducation: true,
    showCertifications: true,
    showCurrentlyLearning: true,
    // The one-line availability note under the hero buttons.
    showAvailability: true,
    // "Outside work" interests under About, and the Interests line on the CV.
    showInterests: true,
  },
};
