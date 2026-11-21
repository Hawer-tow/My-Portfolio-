import { expect, test } from '@playwright/test';
import { builtPages } from './pages';

/**
 * Layout: no horizontal scrolling at any of the target widths, in both themes.
 * Set SCREENSHOTS=1 to also save full-page screenshots to test-results/screenshots.
 */
const widths = [320, 375, 768, 1024, 1440, 1920];
const themes = ['light', 'dark'] as const;

for (const path of builtPages()) {
  for (const theme of themes) {
    test(`${path} fits every width without horizontal scroll (${theme})`, async ({ page }) => {
      test.setTimeout(process.env.SCREENSHOTS ? 180_000 : 60_000);
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme });
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);

      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${path} overflows by ${overflow}px at ${width}px`).toBeLessThanOrEqual(0);

        if (process.env.SCREENSHOTS) {
          const name = path === '/' ? 'home' : path.replace(/[/.]+/g, '-').replace(/^-|-$/g, '');
          await page.screenshot({
            path: `test-results/screenshots/${name}-${width}-${theme}.png`,
            fullPage: true,
          });
        }
      }
    });
  }
}

test('content is complete without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  // Navigation links are reachable and nothing is hidden behind scripts.
  await expect(
    page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'CV' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
  await expect(page.locator('[data-filters]')).toBeHidden();
  const hiddenCards = await page.locator('[data-project-grid] > li[hidden]').count();
  expect(hiddenCards).toBe(0);
  await context.close();
});

test('theme toggle switches theme and remembers the choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Dark theme' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('mobile menu opens, closes and reports its state', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Skills' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('navigation links land on their sections', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main' });
  for (const name of ['Contact', 'Skills', 'Education', 'Projects', 'Experience', 'About']) {
    await nav.getByRole('link', { name, exact: true }).click();
    const heading = page.locator(`#${name.toLowerCase()}-title`);
    // Wait for smooth scrolling and any deferred sections to settle.
    await expect
      .poll(async () => (await heading.boundingBox())?.y ?? -1, { timeout: 5000 })
      .toBeGreaterThan(40);
    await page.waitForTimeout(800);
    const box = await heading.boundingBox();
    expect(box, `${name} heading not found`).not.toBeNull();
    // Heading sits just below the sticky header, comfortably inside the viewport.
    expect(box!.y, `${name} landed at ${box!.y}px`).toBeGreaterThan(40);
    expect(box!.y, `${name} landed at ${box!.y}px`).toBeLessThan(750);
  }
});
