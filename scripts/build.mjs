import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist');

await rm(out, { recursive: true, force: true });
await mkdir(resolve(out, 'assets'), { recursive: true });

for (const file of ['index.html', 'TERMS.md', '.nojekyll']) {
  await cp(resolve(root, file), resolve(out, file));
}
for (const file of ['demo.png', 'demo-report.html']) {
  await cp(resolve(root, 'assets', file), resolve(out, 'assets', file));
}

await writeFile(resolve(out, '404.html'), await (await import('node:fs/promises')).readFile(resolve(root, 'index.html')));
console.log('Built static site in dist/');
