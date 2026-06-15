// esbuild strips top-level "use client" when bundling, so we prepend it after build.
// This marks the whole library as a client boundary for React Server Components.
import { readFile, writeFile } from 'node:fs/promises';

const file = 'dist/index.js';
const directive = "'use client';\n";
const src = await readFile(file, 'utf8');
if (!src.startsWith("'use client'") && !src.startsWith('"use client"')) {
  await writeFile(file, directive + src);
  console.log('✓ prepended "use client" to', file);
}
