/**
 * Lighthouse CI: mobile emulation (the default), three runs per page, budgets enforced.
 * Run after `npm run build`:  npm run test:lighthouse
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['http://localhost/', 'http://localhost/projects/dateroem/', 'http://localhost/cv/'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        // Budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 15 * 1024 }],
        'resource-summary:third-party:count': ['error', { maxNumericValue: 0 }],
        'resource-summary:font:size': ['error', { maxNumericValue: 130 * 1024 }],
        'resource-summary:total:size': ['warn', { maxNumericValue: 500 * 1024 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
};
