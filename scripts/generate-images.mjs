/**
 * Generates the monogram assets and neutral placeholder images.
 *
 *   npm run images            favicons + social preview (always), placeholders only where missing
 *   npm run images -- --force also overwrite placeholder photos and screenshots
 *
 * Text is converted to vector paths with the bundled Source fonts, so output is identical on
 * every machine. Placeholders use no stock photos and no generated faces.
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fontkit from 'fontkit';
import sharp from 'sharp';
import { site } from '../src/config/site.ts';
import { initials } from '../src/lib/initials.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');

const colours = {
  paper: '#faf8f4',
  ink: '#1c1f23',
  muted: '#525a65',
  accent: '#1f5a43',
  frame: '#fbfaf7',
  canvas: '#ece8e0',
  block: '#e3ded4',
  blockSoft: '#efebe4',
  label: '#4f5864',
};

// ---------------------------------------------------------------------------
// Fonts and text-to-path

const fontFile = (pkg, weight) =>
  path.join(root, 'node_modules', '@fontsource', pkg, 'files', `${pkg}-latin-${weight}-normal.woff`);

const fonts = {
  serif: fontkit.create(await readFile(fontFile('source-serif-4', 600))),
  sans: fontkit.create(await readFile(fontFile('source-sans-3', 400))),
  sansBold: fontkit.create(await readFile(fontFile('source-sans-3', 600))),
};

/** Measure a single line of text in pixels. */
function measure(font, text, size, tracking = 0) {
  const run = font.layout(text);
  const advance = run.positions.reduce((sum, p) => sum + p.xAdvance, 0);
  return (advance * size) / font.unitsPerEm + tracking * Math.max(0, run.glyphs.length - 1);
}

/** SVG path data for one line of text. `anchor` is start | middle | end. */
function textPath(font, text, size, x, baseline, { anchor = 'start', tracking = 0 } = {}) {
  const run = font.layout(text);
  const scale = size / font.unitsPerEm;
  const width = measure(font, text, size, tracking);
  let pen = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  let d = '';
  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    const gx = pen + pos.xOffset * scale;
    const gy = baseline - pos.yOffset * scale;
    d += glyph.path.scale(scale, -scale).translate(gx, gy).toSVG();
    pen += pos.xAdvance * scale + tracking;
  });
  return d;
}

/** Largest font size (up to `max`) at which `text` fits in `width`. */
function fitSize(font, text, max, width, min = 12) {
  let size = max;
  while (size > min && measure(font, text, size) > width) size -= 1;
  return size;
}

/** Greedy word wrap into lines no wider than `width`. */
function wrap(font, text, size, width) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(font, next, size) > width) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ---------------------------------------------------------------------------
// Output helpers

const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  );

async function save(relative, buffer, { placeholder = false } = {}) {
  const file = path.join(root, relative);
  if (placeholder && !force && (await exists(file))) {
    console.log(`  kept     ${relative}`);
    return;
  }
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, buffer);
  console.log(`  wrote    ${relative}`);
}

const svg = (width, height, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;

const png = (markup) => sharp(Buffer.from(markup)).png({ compressionLevel: 9 }).toBuffer();
const jpg = (markup) => sharp(Buffer.from(markup)).jpeg({ quality: 84, mozjpeg: true }).toBuffer();

/** Wrap a 32px PNG in a minimal .ico container. */
function icoFromPng(data, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0);
  entry.writeUInt8(size, 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, data]);
}

// ---------------------------------------------------------------------------
// Monogram

const letters = initials(site.fullName);

/** Monogram on a 64-unit grid: accent square, paper-coloured serif initials. */
function monogram({ radius = 10, size = 64 } = {}) {
  const fontSize = letters.length > 1 ? 30 : 36;
  const capHeight = (fonts.serif.capHeight / fonts.serif.unitsPerEm) * fontSize;
  const baseline = 32 + capHeight / 2;
  const scale = size / 64;
  return `<g transform="scale(${scale})"><rect width="64" height="64" rx="${radius}" fill="${colours.accent}"/><path fill="${colours.paper}" d="${textPath(fonts.serif, letters, fontSize, 32, baseline, { anchor: 'middle', tracking: 0.6 })}"/></g>`;
}

async function writeMonogramAssets() {
  console.log('Monogram and icons');
  await save('public/favicon.svg', Buffer.from(svg(64, 64, monogram())));
  const ico = await png(svg(32, 32, monogram({ size: 32, radius: 10 })));
  await save('public/favicon.ico', icoFromPng(ico, 32));
  // iOS rounds the corners itself, so the touch icon is full-bleed.
  await save('public/apple-touch-icon.png', await png(svg(180, 180, monogram({ size: 180, radius: 0 }))));
  await save('public/icon-192.png', await png(svg(192, 192, monogram({ size: 192, radius: 0 }))));
  await save('public/icon-512.png', await png(svg(512, 512, monogram({ size: 512, radius: 0 }))));
}

// ---------------------------------------------------------------------------
// Social preview, 1200 × 630

async function writeSocialImage() {
  console.log('Social preview');
  const W = 1200;
  const H = 630;
  const left = 88;
  const maxWidth = W - left * 2;
  const nameSize = fitSize(fonts.serif, site.fullName, 76, maxWidth, 40);
  const roleSize = fitSize(fonts.sans, site.roleTitle, 34, maxWidth, 20);
  const host = /\{\{/.test(site.siteUrl) ? '' : site.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const body = [
    `<rect width="${W}" height="${H}" fill="${colours.paper}"/>`,
    `<rect x="0" y="${H - 14}" width="${W}" height="14" fill="${colours.accent}"/>`,
    `<g transform="translate(${left} 92)">${monogram({ size: 104, radius: 14 })}</g>`,
    `<path fill="${colours.ink}" d="${textPath(fonts.serif, site.fullName, nameSize, left, 344)}"/>`,
    `<path fill="${colours.muted}" d="${textPath(fonts.sans, site.roleTitle, roleSize, left, 404)}"/>`,
    `<rect x="${left}" y="446" width="88" height="3" fill="${colours.accent}"/>`,
    host
      ? `<path fill="${colours.muted}" d="${textPath(fonts.sansBold, host, 26, left, 540)}"/>`
      : `<path fill="${colours.muted}" d="${textPath(fonts.sans, 'Portfolio · Projects · CV', 26, left, 540)}"/>`,
  ].join('');
  await save('public/og/default.png', await png(svg(W, H, body)));
}

// ---------------------------------------------------------------------------
// Placeholders

/** Portrait placeholder: a soft monogram on a muted background. Alt text says "Your photo here". */
async function writePortrait() {
  console.log('Portrait placeholder');
  const S = 800;
  const fontSize = letters.length > 1 ? 250 : 300;
  const capHeight = (fonts.serif.capHeight / fonts.serif.unitsPerEm) * fontSize;
  const body = [
    `<defs><radialGradient id="g" cx="50%" cy="42%" r="70%"><stop offset="0" stop-color="#f1ede6"/><stop offset="1" stop-color="#e2dcd1"/></radialGradient></defs>`,
    `<rect width="${S}" height="${S}" fill="url(#g)"/>`,
    `<circle cx="400" cy="400" r="300" fill="none" stroke="#cfc7b9" stroke-width="3"/>`,
    `<path fill="#a99f8e" d="${textPath(fonts.serif, letters, fontSize, 400, 400 + capHeight / 2, { anchor: 'middle', tracking: 6 })}"/>`,
  ].join('');
  await save('src/assets/images/profile/portrait.jpg', await jpg(svg(S, S, body)), { placeholder: true });
}

/** Centred label block: "Screenshot placeholder", caption and target size. */
function labelBlock(W, H, title, caption, maxWidth) {
  const captionSize = W > 1200 ? 34 : 40;
  const lines = wrap(fonts.sans, caption, captionSize, maxWidth);
  const lineHeight = captionSize * 1.3;
  const blockHeight = 56 + lines.length * lineHeight + 48;
  let y = H / 2 - blockHeight / 2 + 22;
  const parts = [
    `<path fill="${colours.label}" d="${textPath(fonts.sansBold, title.toUpperCase(), 26, W / 2, y, { anchor: 'middle', tracking: 3 })}"/>`,
  ];
  y += 20;
  for (const line of lines) {
    y += lineHeight;
    parts.push(
      `<path fill="${colours.ink}" d="${textPath(fonts.sans, line, captionSize, W / 2, y, { anchor: 'middle' })}"/>`,
    );
  }
  y += 56;
  parts.push(
    `<path fill="${colours.label}" d="${textPath(fonts.sans, `${W} × ${H}`, 26, W / 2, y, { anchor: 'middle' })}"/>`,
  );
  const panelW = maxWidth + 120;
  const panelH = blockHeight + 60;
  return (
    `<rect x="${(W - panelW) / 2}" y="${H / 2 - panelH / 2}" width="${panelW}" height="${panelH}" rx="16" fill="${colours.frame}" stroke="${colours.block}" stroke-width="2"/>` +
    parts.join('')
  );
}

/** Desktop screenshot placeholder, 1600 × 1000: a window frame with wireframe blocks. */
function desktopPlaceholder(caption, kind = 'browser') {
  const W = 1600;
  const H = 1000;
  const m = 56;
  const barH = 52;
  const fw = W - m * 2;
  const fh = H - m * 2;
  const blocks = [
    `<rect x="${m + 40}" y="${m + barH + 36}" width="${fw - 80}" height="64" rx="8" fill="${colours.blockSoft}"/>`,
    kind === 'app'
      ? `<rect x="${m + 40}" y="${m + barH + 124}" width="260" height="${fh - barH - 164}" rx="8" fill="${colours.blockSoft}"/>`
      : `<rect x="${m + 40}" y="${m + barH + 124}" width="${fw - 80}" height="260" rx="8" fill="${colours.blockSoft}"/>`,
    ...[0, 1, 2].map((i) => {
      const x0 = kind === 'app' ? m + 330 : m + 40;
      const cw = ((kind === 'app' ? fw - 370 : fw - 80) - 48) / 3;
      const y0 = kind === 'app' ? m + barH + 124 : m + barH + 412;
      return `<rect x="${x0 + i * (cw + 24)}" y="${y0}" width="${cw}" height="${kind === 'app' ? fh - barH - 164 : fh - barH - 452}" rx="8" fill="${colours.blockSoft}"/>`;
    }),
  ];
  const chrome =
    kind === 'browser'
      ? [0, 1, 2]
          .map((i) => `<circle cx="${m + 30 + i * 26}" cy="${m + barH / 2}" r="7" fill="#cfc8bb"/>`)
          .join('') +
        `<rect x="${m + 130}" y="${m + 14}" width="${fw - 260}" height="24" rx="12" fill="${colours.blockSoft}"/>`
      : `<rect x="${m + 24}" y="${m + 18}" width="180" height="16" rx="8" fill="${colours.blockSoft}"/>`;
  return svg(
    W,
    H,
    [
      `<rect width="${W}" height="${H}" fill="${colours.canvas}"/>`,
      `<rect x="${m}" y="${m}" width="${fw}" height="${fh}" rx="14" fill="${colours.frame}" stroke="#d6d0c4" stroke-width="2"/>`,
      `<path d="M${m} ${m + barH}h${fw}" stroke="#d6d0c4" stroke-width="2"/>`,
      chrome,
      ...blocks,
      labelBlock(W, H, 'Screenshot placeholder', caption, 760),
    ].join(''),
  );
}

/** Phone screenshot placeholder, 1080 × 2400. */
function phonePlaceholder(caption) {
  const W = 1080;
  const H = 2400;
  const m = 90;
  const fw = W - m * 2;
  const fh = H - m * 2;
  const rows = Array.from(
    { length: 7 },
    (_, i) =>
      `<rect x="${m + 60}" y="${m + 260 + i * 250}" width="${fw - 120}" height="200" rx="20" fill="${colours.blockSoft}"/>`,
  ).join('');
  return svg(
    W,
    H,
    [
      `<rect width="${W}" height="${H}" fill="${colours.canvas}"/>`,
      `<rect x="${m}" y="${m}" width="${fw}" height="${fh}" rx="90" fill="${colours.frame}" stroke="#d6d0c4" stroke-width="4"/>`,
      `<rect x="${W / 2 - 90}" y="${m + 40}" width="180" height="36" rx="18" fill="#d6d0c4"/>`,
      `<rect x="${m + 60}" y="${m + 130}" width="${fw - 120}" height="90" rx="16" fill="${colours.blockSoft}"/>`,
      rows,
      labelBlock(W, H, 'Screenshot placeholder', caption, 640),
    ].join(''),
  );
}

/**
 * Placeholder screenshots for projects that do not have real ones yet.
 * Dateroem uses real screenshots, so it is not listed here.
 */
const projectImages = {
  'sample-web-project': [
    ['cover.jpg', 'desktop', 'Sample web project: home page', 'browser'],
    ['screen-1.jpg', 'desktop', 'Sample web project: main page', 'browser'],
    ['screen-2.jpg', 'phone', 'Sample web project: mobile view'],
  ],
  'sample-fullstack-project': [
    ['cover.jpg', 'desktop', 'Sample full-stack project: dashboard', 'app'],
    ['screen-1.jpg', 'desktop', 'Sample full-stack project: list view', 'browser'],
    ['screen-2.jpg', 'desktop', 'Sample full-stack project: detail view', 'browser'],
  ],
};

async function writeProjectPlaceholders() {
  console.log('Project placeholders');
  for (const [slug, images] of Object.entries(projectImages)) {
    for (const [file, kind, caption, variant] of images) {
      const markup = kind === 'phone' ? phonePlaceholder(caption) : desktopPlaceholder(caption, variant);
      await save(`src/assets/images/projects/${slug}/${file}`, await jpg(markup), { placeholder: true });
    }
  }
}

/**
 * Title cards for real projects that have no screenshots yet: the project name over a
 * stylised contour map. An honest illustration, never made to look like a screen.
 */
const titleCards = {
  'dateroem-ai': { title: 'Dateroem AI', subtitle: 'Timber intelligence for sourcing decisions' },
};

function titleCard({ title, subtitle }) {
  const W = 1600;
  const H = 1000;
  let rings = '';
  for (let r = 0; r < 10; r++) {
    const points = [];
    for (let a = 0; a <= 360; a += 6) {
      const rad = (a * Math.PI) / 180;
      const wobble = 1 + 0.09 * Math.sin(3 * rad + r * 0.9) + 0.05 * Math.cos(5 * rad - r * 0.6);
      const x = 1180 + (150 + r * 80) * wobble * Math.cos(rad);
      const y = 520 + (100 + r * 58) * wobble * Math.sin(rad);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    const opacity = (0.6 - r * 0.045).toFixed(2);
    rings += `<polyline points="${points.join(' ')}" fill="none" stroke="#3f7d61" stroke-opacity="${opacity}" stroke-width="2"/>`;
  }
  const titleSize = fitSize(fonts.serif, title, 124, 1000, 60);
  return svg(
    W,
    H,
    [
      `<rect width="${W}" height="${H}" fill="#123326"/>`,
      rings,
      `<rect x="0" y="${H - 14}" width="${W}" height="14" fill="#7cc4a0"/>`,
      `<path fill="${colours.paper}" d="${textPath(fonts.serif, title, titleSize, 110, 500)}"/>`,
      `<path fill="#bcd8c9" d="${textPath(fonts.sans, subtitle, 46, 110, 580)}"/>`,
    ].join(''),
  );
}

async function writeTitleCards() {
  console.log('Project title cards');
  for (const [slug, card] of Object.entries(titleCards)) {
    await save(`src/assets/images/projects/${slug}/cover.jpg`, await jpg(titleCard(card)), {
      placeholder: true,
    });
  }
}

await writeMonogramAssets();
await writeSocialImage();
await writePortrait();
await writeProjectPlaceholders();
await writeTitleCards();
console.log(
  force
    ? 'Done (placeholders overwritten).'
    : 'Done. Existing placeholders were kept; pass --force to overwrite them.',
);
