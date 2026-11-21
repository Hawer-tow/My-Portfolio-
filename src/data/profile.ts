/**
 * Longer personal wording used across the site: hero, About, footer and contact.
 * Every block is sample wording for you to rewrite in your own voice.
 */
import { site } from '../config/site';

export const profile = {
  // TODO(owner): two sentences. Who you are and what you build.
  heroSummary:
    'I build complete software systems, from the database and API to the web, mobile and desktop apps that people use at work. My most recent project is a sales and operations platform for an upcoming ecommerce timber business, with live M-Pesa payments.',

  // TODO(owner): adjust to what you are looking for.
  availability: `Open to internships and graduate roles from ${site.graduationYear}.`,

  // TODO(owner): three short paragraphs. Studying, building real systems, what you want next.
  about: [
    `I am studying for a ${site.degreeName} at ${site.universityName} and expect to graduate in ${site.graduationYear}. My course has given me a grounding in software design, data structures, databases and networks, and I try to put each of these into practice outside lectures.`,
    'Most of that practice comes from building real systems for my family’s timber business. I designed and built its sales and operations platform on my own: a customer website with M-Pesa checkout, an Android app for field staff and a desktop console for administrators, all sharing one Java backend. Working with the owner and the board taught me to turn everyday problems into clear requirements, and to build for people who rely on the system at work.',
    'Next, I want to join a team where I can learn from experienced engineers and work on software that people depend on. I am most interested in backend and full-stack roles, and in products where security, reliability and clear design matter.',
  ],

  // TODO(owner): one line for the footer.
  motto: 'Building dependable software for real businesses.',

  // TODO(owner): how quickly you usually reply.
  responseTime: 'I usually reply within three working days.',

  // TODO(owner): a sentence inviting contact.
  contactIntro:
    'I am happy to talk about internships, graduate roles or a project you have in mind. Email is the quickest way to reach me.',

  // Outside work: shown under About and as one line on the CV.
  // Hide it with features.showInterests in src/config/site.ts.
  interests: {
    intro:
      'Away from the keyboard, I like being outdoors. I go on nature walks and take drives out to remote areas to enjoy the views and the scenery. Next on my list is visiting game parks and national reserves.',
    items: [
      'Nature walks',
      'Scenic drives to remote areas',
      'Landscapes and scenery',
      'Game parks and reserves (next)',
    ],
  },
};
