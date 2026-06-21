// Re-ship the generated Tailwind v4 theme bridge (and its opt-in reset) from
// @eidra/tokens so consumers can `@import '@eidra/react/tailwind.css'` (and
// optionally '@eidra/react/tailwind-reset.css') as single entrypoints alongside
// `@eidra/react/styles.css` (mirrors @eidra/tokens/*). Both are generated upstream
// — see packages/tokens/build.mjs (`eidra/tailwind-v4`).
import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

for (const file of ['tailwind.css', 'tailwind-reset.css']) {
  const src = fileURLToPath(new URL(`../../tokens/dist/${file}`, import.meta.url));
  const dest = fileURLToPath(new URL(`../dist/${file}`, import.meta.url));
  await copyFile(src, dest);
  console.log(`✓ copied @eidra/tokens ${file} → dist/${file}`);
}
