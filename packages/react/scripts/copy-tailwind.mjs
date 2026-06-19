// Re-ship the generated Tailwind v4 theme bridge from @eidra/tokens so consumers
// can `@import '@eidra/react/tailwind.css'` as a single entrypoint alongside
// `@eidra/react/styles.css` (mirrors @eidra/tokens/tailwind.css). The file is
// generated upstream — see packages/tokens/build.mjs (`eidra/tailwind-v4`).
import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../../tokens/dist/tailwind.css', import.meta.url));
const dest = fileURLToPath(new URL('../dist/tailwind.css', import.meta.url));

await copyFile(src, dest);
console.log('✓ copied @eidra/tokens tailwind.css → dist/tailwind.css');
