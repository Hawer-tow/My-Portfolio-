/**
 * Lists every {{TOKEN}} still in use and counts the TODO(owner) notes, file by file.
 *   npm run placeholders
 * Tokens that appear only inside comments (as markers) are not counted.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const extensions = new Set(['.ts', '.astro', '.md', '.mdx']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (extensions.has(path.extname(entry.name))) yield full;
  }
}

/** Strip comments (//, # in YAML, and block-comment lines) so tokens mentioned in comments are ignored. */
const stripComment = (line) =>
  /^\s*(\/\*|\*|<!--)/.test(line) ? '' : line.replace(/(^|\s)(\/\/|#(?!\w)).*$/, '');

const tokens = new Map();
const todos = new Map();
// Values like '{Jane Doe}': a token with one pair of braces removed but not the other.
const halfDone = [];

for await (const file of walk(path.join(root, 'src'))) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const lines = (await readFile(file, 'utf8')).split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const match of stripComment(line).matchAll(/\{\{([A-Z0-9_]+)\}\}/g)) {
      const list = tokens.get(match[0]) ?? [];
      list.push(`${rel}:${i + 1}`);
      tokens.set(match[0], list);
    }
    for (const match of stripComment(line).matchAll(/(['"`])\{(?!\{)[^{}'"`]*\}\1/g)) {
      halfDone.push(`${rel}:${i + 1}  ${match[0]}`);
    }
    if (line.includes('TODO(owner)')) todos.set(rel, (todos.get(rel) ?? 0) + 1);
  });
}

if (tokens.size === 0) {
  console.log('No {{TOKENS}} left. Nice.');
} else {
  console.log(`${tokens.size} placeholder tokens still in use:\n`);
  for (const [token, places] of [...tokens].sort()) {
    console.log(`  ${token}`);
    for (const place of places) console.log(`      ${place}`);
  }
}

if (halfDone.length > 0) {
  console.log('\nValues still wrapped in { } (remove the braces, keep the quotes):');
  for (const place of halfDone) console.log(`  ${place}`);
  process.exitCode = 1;
}

const total = [...todos.values()].reduce((a, b) => a + b, 0);
console.log(`\n${total} TODO(owner) notes:`);
for (const [file, count] of [...todos].sort()) console.log(`  ${String(count).padStart(3)}  ${file}`);
console.log('\nAlso replace the placeholder images and the CV PDF (see the README checklist).');
