/**
 * Prints the built HTML CV (/cv/) to an A4 PDF at site.cvPdfPath inside /public.
 * This is the placeholder PDF until you add your own.
 *
 *   npm run build && npm run cv:pdf            refuses to overwrite an existing PDF
 *   npm run build && npm run cv:pdf -- --force replace it
 */
import { createServer } from 'node:http';
import { access, mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { site } from '../src/config/site.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const output = path.join(root, 'public', site.cvPdfPath.replace(/^\/+/, ''));
const force = process.argv.includes('--force');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

try {
  await access(path.join(dist, 'cv', 'index.html'));
} catch {
  console.error('dist/cv/index.html not found. Run `npm run build` first.');
  process.exit(1);
}

if (!force) {
  try {
    await access(output);
    console.error(`${path.relative(root, output)} already exists. Pass --force to replace it.`);
    process.exit(1);
  } catch {
    // Not there yet: carry on.
  }
}

// Minimal static server for dist/ (the build uses base "/" locally).
const server = createServer(async (req, res) => {
  try {
    let file = path.join(dist, decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname));
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, resolve));
const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());

// Use Playwright's Chromium if installed, otherwise the system Chrome.
const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
try {
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await page.goto(`http://localhost:${port}/cv/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await mkdir(path.dirname(output), { recursive: true });
  await page.pdf({ path: output, format: 'A4', preferCSSPageSize: true, printBackground: true });
  console.log(`Wrote ${path.relative(root, output)}`);
} finally {
  await browser.close();
  server.close();
}
