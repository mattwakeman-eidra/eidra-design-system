// Wraps the built stylesheet in a low-priority cascade layer, `@layer eidra`.
//
// Why: component CSS Modules ship as ordinary (unlayered) rules. Per the cascade,
// unlayered styles ALWAYS beat layered ones — so a consumer's Tailwind utility
// (which lives in `@layer utilities`) or any layered app CSS can't override a DS
// rule of equal specificity (`.trigger { width: 100% }`), forcing inline `style`.
// Putting the whole sheet in `@layer eidra` (registered before the consumer's
// utilities layer) lets consumer className/utilities win, while unlayered consumer
// CSS still beats everything. See ADR-0008.
//
// Safe to wrap the whole file: the Vite output has no leading `@charset`/`@import`
// (tokens are inlined), so nothing must precede the `@layer` block. Idempotent.
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'dist/index.css';
const css = readFileSync(FILE, 'utf8');

if (css.trimStart().startsWith('@layer eidra')) {
  console.log('✓ css layer: dist/index.css already wrapped');
} else {
  writeFileSync(FILE, `@layer eidra {\n${css}\n}\n`);
  console.log('✓ css layer: wrapped dist/index.css in @layer eidra');
}
