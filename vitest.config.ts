// Storybook Vitest addon — runs every story as a test in a real (headless
// Chromium) browser via Playwright, so a story that *renders* but throws at
// runtime (e.g. a decorator/serializer error invisible to `tsc`/`build`) fails
// here instead of in someone's browser. Also runs each story's `play` function
// and enforces the a11y addon (`a11y: { test: 'error' }` in preview.tsx).
//
// Run: `pnpm test-storybook` (needs `pnpm exec playwright install chromium` once).
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { fileURLToPath } from 'node:url';

const storybookDir = fileURLToPath(new URL('./.storybook', import.meta.url));

export default defineConfig({
  plugins: [storybookTest({ configDir: storybookDir })],
  // Pre-bundle the JSX runtimes up front. Vite's initial dep scan walks the
  // story entry points and misses these — they only surface once a story module
  // is transformed, so on a cold cache (e.g. a fresh CI runner) Vite re-optimizes
  // mid-run and reloads the browser, which flakes/duplicates tests
  // ("Vite unexpectedly reloaded a test"). Listing them here makes the optimize
  // deterministic on the first pass.
  optimizeDeps: {
    include: ['react/jsx-dev-runtime', 'react/jsx-runtime'],
  },
  test: {
    name: 'storybook',
    // In CI, add the github-actions reporter so a failing assertion is annotated
    // inline on the offending line in the PR diff (and in the run summary), not
    // just buried in the step log. Keep `default` so the full console output stays.
    reporters: process.env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['default'],
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
    // No setupFiles needed: since Storybook 10.3 the Vitest addon auto-applies the
    // preview.tsx annotations (ThemeProvider decorator, theme/density globals,
    // a11y config) to every story.
  },
});
