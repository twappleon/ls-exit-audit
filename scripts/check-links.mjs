import { access, readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pages = [
  'index.html',
  'assets/demo-report.html',
  'lemon-squeezy-migration-inventory-checklist/index.html'
];
const failures = [];
let checked = 0;

for (const page of pages) {
  const pagePath = resolve(root, page);
  const html = await readFile(pagePath, 'utf8');
  const attrPattern = /\b(?:href|src)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(attrPattern)) {
    const target = match[1];
    if (target.startsWith('#') || target.startsWith('data:') || target.startsWith('mailto:')) continue;
    checked++;
    if (/^https?:\/\//i.test(target)) continue;
    const clean = target.split('#')[0].split('?')[0];
    const localPath = resolve(dirname(pagePath), clean);
    try { await access(localPath); }
    catch { failures.push(`${page}: missing local target ${target}`); }
  }

  for (const match of html.matchAll(/href=["']#([^"']+)["']/gi)) {
    const id = match[1];
    checked++;
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`\\bid=["']${escaped}["']`).test(html)) failures.push(`${page}: missing anchor #${id}`);
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['.git', 'dist', 'node_modules'].includes(entry.name)) continue;
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else {
      const extension = extname(entry.name).toLowerCase();
      if (['.zip', '.tgz', '.js', '.mjs', '.json'].includes(extension) && !path.includes('/scripts/') && entry.name !== 'package.json') {
        failures.push(`unexpected public package/source-like file: ${path.slice(root.length + 1)}`);
      }
      if ((await stat(path)).size > 8 * 1024 * 1024) failures.push(`oversized public file: ${path.slice(root.length + 1)}`);
    }
  }
}
await walk(root);

const index = await readFile(resolve(root, 'index.html'), 'utf8');
for (const required of [
  'US$29',
  '29 USDT',
  'TRON (TRC20)',
  'TMMJHzDRyBsv6HTmLo9r1QuB7R9Xiu6nu6',
  'Refund boundary',
  'Support boundary',
  'assets/demo-report.html'
]) {
  if (!index.includes(required)) failures.push(`index.html: missing required content: ${required}`);
}
if (/ls-exit-audit-0\.3\.0\.zip|products\/ls-exit-audit\/src/i.test(index)) failures.push('index.html exposes a paid archive or source path');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Checked ${checked} links/anchors and required sales-page content; all local targets resolve.`);
