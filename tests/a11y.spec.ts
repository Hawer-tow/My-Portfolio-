import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { builtPages } from './pages';

/**
 * Accessibility: zero axe violations (WCAG 2.0–2.2 A and AA, plus best practices)
 * on every page, in both themes. Also fails on console errors.
 */
const themes = ['light', 'dark'] as const;

for (const path of builtPages()) {
  for (const theme of themes) {
    test(`${path} has no accessibility violations (${theme})`, async ({ page }) => {
      test.setTimeout(60_000);
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(err.message));

      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme });
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
      await page.goto(path);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();

      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
      // The 404 page is requested directly, so its own status is expected; ignore that one message.
      expect(errors.filter((e) => !/404/.test(e))).toEqual([]);
    });
  }
}
