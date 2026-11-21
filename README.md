# Developer portfolio

A personal portfolio and CV site: a home page with About, Projects, Skills, Experience, Education and Contact sections, a full case study for each project, and a printable HTML CV. Built with [Astro](https://astro.build/), published on GitHub Pages.

- No client JavaScript framework, no analytics, no cookies, no third-party requests.
- Works without JavaScript. Small scripts only add the theme toggle, mobile menu, project filters, screenshot viewer and copy-email button.
- WCAG 2.2 AA: checked with axe on every page in light and dark themes.
- Every personal detail lives in a few data files, so you never need to touch layout code.

## Quick start

You need Node.js 22.22 or newer (24 recommended; see `.nvmrc`).

```bash
npm install        # install dependencies
npm run dev        # local site with live reload at http://localhost:4321
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

Draft projects (the two samples) appear in `npm run dev` with a "Draft" badge. They are left out of production builds.

## Where things live

```
src/
  config/site.ts          every {{TOKEN}}: name, contacts, links, SEO, feature switches
  data/profile.ts         hero summary, About paragraphs, motto, availability, reply time
  data/skills.ts          skill groups, "used in" evidence, currently learning
  data/experience.ts      timeline entries
  data/education.ts       degree, coursework, academic projects, awards, certifications
  content/projects/*.mdx  one file per project (frontmatter checked by src/content.config.ts)
  assets/images/          portrait and project screenshots (optimised by Astro)
  components/             Header, Footer, Hero, Section, ProjectCard, Skills, Timeline, Gallery, ...
  layouts/                BaseLayout (SEO, theme), CaseStudyLayout, PrintLayout
  pages/                  index, projects/[slug], cv, 404, robots.txt, manifest
  styles/                 tokens.css (colours, type scale), base.css, print.css
public/
  cv/                     the downloadable CV PDF
  og/default.png          social preview image
  favicon.*, icon-*.png   generated from your initials
scripts/                  image generator, CV PDF printer, placeholder checker
tests/                    accessibility and layout tests (Playwright + axe)
```

## Placeholders checklist

Every personal item is a visible placeholder in the form `{{TOKEN}}`. To see what is left:

```bash
npm run placeholders
```

This lists every token still in use (file and line) and counts the `TODO(owner)` notes. Fill tokens in with your editor's search and replace (in VS Code: Ctrl+Shift+H), so that tokens used in more than one file change everywhere at once.

How values behave:

- **Optional items are hidden until filled.** This covers the phone number, social links, contact form, source-code link and credential links. While a value is empty or still a `{{TOKEN}}`, it is not rendered, so there are no empty icons or broken links.
- **Everything else shows the token** as written until you replace it.

### Personal details: `src/config/site.ts`

| Token                                                                                                             | What to put there                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{YOUR_FULL_NAME}}`                                                                                              | Your name as shown on the site, CV and monogram. Then run `npm run images` to regenerate the favicon and social image.                                                                       |
| `{{YOUR_SHORT_NAME}}`                                                                                             | First name, used in "Hello, I'm …".                                                                                                                                                          |
| `{{YOUR_ROLE_TITLE}}`                                                                                             | The `roleTitle` line. Default: "Software Developer · {{DEGREE_NAME}} student".                                                                                                               |
| `{{DEGREE_NAME}}`                                                                                                 | e.g. "BSc Software Engineering".                                                                                                                                                             |
| `{{UNIVERSITY_NAME}}`                                                                                             | Your university.                                                                                                                                                                             |
| `{{GRADUATION_YEAR}}`                                                                                             | Expected graduation year.                                                                                                                                                                    |
| `{{LOCATION}}`                                                                                                    | City, country (text only).                                                                                                                                                                   |
| `{{EMAIL}}`                                                                                                       | Contact email (hero, contact section, CV, "on request" links).                                                                                                                               |
| `{{PHONE_OPTIONAL}}`                                                                                              | Optional. Shown only if filled in **and** `features.showPhone` is `true`.                                                                                                                    |
| `{{GITHUB_URL}}`, `{{LINKEDIN_URL}}`, `{{X_URL}}`, `{{INSTAGRAM_URL}}`, `{{TIKTOK_URL}}`, `{{PERSONAL_BLOG_URL}}` | Full URLs. Leave any empty to hide it. `{{GITHUB_URL}}` also appears in `sourceRepoUrl` (footer source link).                                                                                |
| `{{CV_PDF_PATH}}`                                                                                                 | The `cvPdfPath` value. Put your PDF in `public/cv/` (e.g. `public/cv/Jane-Doe-CV.pdf`) and update the path.                                                                                  |
| `{{PROFILE_PHOTO}}`                                                                                               | The `profilePhoto` value, a path inside `src/assets`. Replace `src/assets/images/profile/portrait.jpg`, then change `profilePhotoAlt` from "Your photo here" to e.g. "Portrait of Jane Doe". |
| `{{SITE_URL}}`                                                                                                    | e.g. `https://your-username.github.io`. Optional: the deploy workflow supplies the address automatically. Set it for a custom domain.                                                        |
| `{{CONTACT_FORM_ENDPOINT}}`                                                                                       | Optional form service URL (e.g. Formspree). Until set, the form is replaced by an email button.                                                                                              |

Also in this file: `languages` (currently a guess: English, Kiswahili) and the `seo.description`.

### Wording: `src/data/profile.ts`

Hero summary, availability line, the three About paragraphs, your interests (the "Outside work" part of About and the Interests line on the CV), footer motto, reply time and the contact introduction. Each block is sample wording marked `TODO(owner)`; rewrite it in your own voice.

### Flagship case study: `src/content/projects/dateroem.mdx`

| Token                                                                                            | What to put there                                                                                                               |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `{{PROJECT_DISPLAY_NAME}}`                                                                       | The `title` (default "Dateroem Wood Sales"). **Confirm the business owner is happy for the name and screenshots to be public.** |
| `{{PROJECT_DATES}}`                                                                              | e.g. "September 2026 – present". Also used in `src/data/experience.ts`.                                                         |
| `{{METRIC_ORDERS}}`, `{{METRIC_PAYMENTS}}`, `{{METRIC_STAFF_USERS}}`, `{{METRIC_RESPONSE_TIME}}` | Real figures only. Delete any line you cannot measure.                                                                          |
| `{{DEMO_VIDEO_URL}}`                                                                             | A short anonymised demo video, or delete the line.                                                                              |
| `{{DOCS_EXCERPT_URL}}`                                                                           | Public documentation excerpts, or delete the line to keep the "available on request" note.                                      |

Never add API keys, server or tunnel addresses, M-Pesa till or shortcode numbers, staff or customer phone numbers, or customer data.

### Experience and education

| File                     | Tokens                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/experience.ts` | `{{INTERNSHIP_ORGANISATION}}`, `{{INTERNSHIP_DATES}}`, `{{CLUB_ROLE}}`, `{{CLUB_NAME}}`, `{{CLUB_DATES}}`. Set `hidden: true` on any entry you do not need.                                                                                                                                                                                                                                                             |
| `src/data/education.ts`  | `{{ACADEMIC_PROJECT_TITLE}}`, `{{AWARD_TITLE}}`, `{{AWARD_YEAR}}`, `{{CERTIFICATION_NAME}}`, `{{CERTIFICATION_ISSUER}}`, `{{CERTIFICATION_DATE}}`, `{{CERTIFICATION_URL}}`. Empty a list (`[]`) to hide that block. Also update `coursework`. A certification can have `issuerUrl` (links the issuer's name), `reference` (shown as text, e.g. a letter's reference number) and `url` (an online credential to verify). |

### Sample projects

`src/content/projects/sample-web-project.mdx` and `sample-fullstack-project.mdx` hold the `{{SAMPLE_…}}` tokens. Replace each with one of your own projects (see below), or delete them.

### Images

| Image              | File                                                                                                   | Size                            |
| ------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------- |
| Portrait           | `src/assets/images/profile/portrait.jpg`                                                               | 800 × 800, square, face centred |
| Project cover      | `src/assets/images/projects/<slug>/cover.jpg`                                                          | 1600 × 1000                     |
| Desktop screenshot | `src/assets/images/projects/<slug>/*.jpg`                                                              | 1600 × 1000                     |
| Phone screenshot   | `src/assets/images/projects/<slug>/*.jpg`                                                              | 1080 × 2400                     |
| Social preview     | `public/og/default.png`                                                                                | 1200 × 630 (generated)          |
| Favicons           | `public/favicon.svg`, `favicon.ico` (32), `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` | generated                       |

The Dateroem case study uses real screenshots. Their untouched originals are kept in `incoming-screenshots/`, which is git-ignored so they are never published; drop new screenshots there too. JPG or PNG both work. Astro produces AVIF and WebP versions at several sizes during the build. Keep the same file names, or update the paths in the project's frontmatter.

`npm run images` regenerates the monogram favicons and the social preview from your name. It never overwrites a photo or screenshot you have added; `npm run images -- --force` recreates the neutral placeholders as well.

### CV PDF

`public/cv/Your-Full-Name-CV.pdf` is a placeholder printed from the HTML CV at `/cv/`. Either:

- add your own PDF and point `cvPdfPath` at it, or
- run `npm run build && npm run cv:pdf -- --force` to print a fresh one from your data.

The `/cv/` page also prints cleanly from the browser (A4, black on white, no navigation).

## Adding a project

1. Copy `src/content/projects/sample-web-project.mdx` to `src/content/projects/my-project.mdx`. The file name becomes the URL: `/projects/my-project/`.
2. Put a cover and screenshots in `src/assets/images/projects/my-project/` and update the paths in the frontmatter.
3. Fill in the frontmatter. The schema in `src/content.config.ts` checks it when you run `npm run dev` or `npm run build`, and explains any mistake. Useful fields:
   - `areas` (Web, Mobile, Desktop, Backend, Data) drives the filter chips.
   - `stack` is the 5–7 tags shown on cards. `stackGroups` is the full grouped list on the case study.
   - `links.demo` adds "Visit the live site" to the card. `links.source` links the code; `links.sourceOnRequest: true` says "available on request" instead.
   - `order` sets the position (lower first). `featured: true` puts it in the large card; only one project should be featured.
4. Write the body in Markdown: problem and context, goals, architecture, key features. Challenges, results, what you learned and links come from the frontmatter.
5. Set `draft: false` to publish it.

To link a skill to the project, add its id to `usedIn` in `src/data/skills.ts`.

## Switching sections on and off

In `src/config/site.ts`, under `features`:

| Switch                                                                             | Effect                                                                                     |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `showExperience`, `showEducation`                                                  | Whole home-page sections (and their navigation links).                                     |
| `showCertifications`, `showCurrentlyLearning`, `showAvailability`, `showInterests` | Smaller blocks. `showInterests` covers "Outside work" under About and Interests on the CV. |
| `showProjectFilters`                                                               | Filter chips above the projects grid (needs projects in at least two areas).               |
| `showContactForm`                                                                  | Contact form, once `contactFormEndpoint` is set. Otherwise an email button.                |
| `showPhone`                                                                        | Phone number, once `phone` is set.                                                         |
| `showBlog`                                                                         | Adds a "Blog" navigation link to `socials.blog`. No blog is built into this site.          |

## Quality checks

```bash
npm run verify           # type check, lint, formatting, build, link check, accessibility and layout tests
npm run test:lighthouse  # Lighthouse CI (run after a build)
```

| Command                   | What it checks                                                                                                                                                                                                                                                 |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`           | TypeScript (strict) and Astro templates.                                                                                                                                                                                                                       |
| `npm run lint`            | ESLint, including accessibility rules for templates.                                                                                                                                                                                                           |
| `npm run format:check`    | Prettier (`npm run format` fixes it).                                                                                                                                                                                                                          |
| `npm run test:links`      | Every internal link, image and anchor in `dist/`.                                                                                                                                                                                                              |
| `npm run test:a11y`       | axe (WCAG 2.2 AA) on every page in both themes, no console errors, no horizontal scrolling at 320–1920 px, no-JS content, theme toggle, mobile menu and anchor links. `SCREENSHOTS=1 npm run test:a11y` also saves screenshots to `test-results/screenshots/`. |
| `npm run test:lighthouse` | Lighthouse on mobile, 3 runs per page. Fails below 95 in any category, above 15 KB of JavaScript, on any third-party request, or on layout shift.                                                                                                              |

The same checks run in GitHub Actions on every push and pull request, and must pass before a deployment.

Notes for running locally:

- The browser tests use your installed Chrome. In CI, Playwright downloads its own.
- If Lighthouse reports "Chrome installation not found", point it at Chrome, e.g. in Git Bash: `CHROME_PATH="$LOCALAPPDATA/Google/Chrome/Application/chrome.exe" npm run test:lighthouse`.
- Lighthouse performance scores vary on slower laptops. Lighthouse assumes a desktop-class machine, and reports a lower "benchmark index" on low-power CPUs, which inflates blocking time. The GitHub Actions run is the reference.

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes the site on every push to `main`, after CI passes.

1. Create a repository on GitHub:
   - **User site:** name it `<your-username>.github.io`. The site will be at `https://<your-username>.github.io/`.
   - **Project site:** any other name, e.g. `portfolio`. The site will be at `https://<your-username>.github.io/portfolio/`.
2. Push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
3. On GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Watch the **Actions** tab. When "Deploy to GitHub Pages" finishes, the site is live.

The address and base path are worked out automatically by `actions/configure-pages`, so both kinds of site work without changes. All internal links go through `withBase()` (`src/lib/url.ts`) for this reason. For a project site, search engines ignore a `robots.txt` that is not at the domain root; the sitemap is still linked from every page.

### Custom domain and HTTPS

1. In **Settings → Pages → Custom domain**, enter your domain (e.g. `www.example.com`) and save. No `CNAME` file is needed when deploying with Actions.
2. At your DNS provider:
   - for `www.example.com`, add a `CNAME` record pointing to `<your-username>.github.io`;
   - for an apex domain (`example.com`), add `A` records for `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
3. Once GitHub has issued the certificate (up to an hour or so), tick **Enforce HTTPS**.
4. Set `siteUrl` in `src/config/site.ts` to `https://www.example.com`, so canonical links and social previews use your domain.

## Privacy

No analytics, trackers, cookies or third-party embeds. Fonts and icons are self-hosted. The only outside request is the optional contact form, and only when someone submits it. If you add analytics later, choose a privacy-friendly, cookie-free service and mention it on the site.

## Decisions made while building

- **Images live in `src/assets/images/`, not `public/images/`.** Astro only optimises images under `src/`, which is needed for AVIF/WebP and the performance target. `{{PROFILE_PHOTO}}` is therefore a path inside `src/assets`.
- **CV file name.** The placeholder is `Your-Full-Name-CV.pdf`, because `{{…}}` in a URL would need escaping.
- **Versions.** Astro 7.3.8 (7.4.1 was a day old) and TypeScript 6.0.3 (`astro check` and typescript-eslint do not support TypeScript 7 yet). All versions are pinned exactly.
- **Accent colour.** Forest green `#1F5A43` (light) / `#7CC4A0` (dark). All text meets 4.5:1, and UI meets 3:1, in both themes.
- **Fonts.** Source Serif 4, Source Sans 3 and JetBrains Mono, variable, Latin subset, all preloaded so they never cause a second layout. The static `@fontsource` packages are dev dependencies used only by the image generator.
- **Extra data file.** Longer wording sits in `src/data/profile.ts`, so `site.ts` stays a list of settings.
- **Experience.** The Dateroem work is listed as real experience; the internship and club entries are token placeholders. No employers, awards or metrics were invented.
- **Placeholder visibility.** Required text shows the token; optional links stay hidden until filled.
- **Astro 7 settings.** `compressHTML: true` keeps spaces between inline elements, which Astro 7's new default would remove.
- **Rendering.** Case-study sections below the fold use `content-visibility: auto` to cut layout work. The home page does not, because it would break the navigation's jump links.
- **Contact form honeypot.** The hidden field is named `_gotcha`, which Formspree and similar services recognise.
- **MDX formatting.** `.mdx` files are excluded from Prettier, whose MDX support predates MDX 3.
- **Node warnings.** Two ESLint packages ask for Node 24.16 or newer; on older 24.x releases npm prints a harmless engine warning.
