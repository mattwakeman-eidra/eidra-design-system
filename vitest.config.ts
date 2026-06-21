// Storybook Vitest addon — runs every story as a test in a real (headless
// Chromium) browser via Playwright, so a story that *renders* but throws at
// runtime (e.g. a decorator/serializer error invisible to `tsc`/`build`) fails
// here instead of in someone's browser. Also runs each story's `play` function
// and enforces the a11y addon (`a11y: { test: 'error' }` in preview.tsx).
//
// Run: `pnpm test-storybook` (needs `pnpm exec playwright install chromium` once).
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';

const storybookDir = fileURLToPath(new URL('./.storybook', import.meta.url));
// Istanbul loads custom coverage reporters via require(), resolved from inside its
// own package — so it needs an absolute path, not a project-relative one.
const brandedHtmlReporter = fileURLToPath(
  new URL('./scripts/eidra-html-reporter.cjs', import.meta.url),
);

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
    // In CI add two extra reporters (keep `default` for the full console output):
    //  - github-actions: annotates a failing assertion inline on its line in the PR diff.
    //  - junit → junit.xml: a machine-readable result file the CI `Publish test report`
    //    step turns into a persistent pass/fail summary (Checks tab + job summary) on
    //    every run, green or red — see .github/workflows/ci.yml.
    reporters: process.env.GITHUB_ACTIONS
      ? ['default', 'github-actions', ['junit', { outputFile: 'junit.xml' }]]
      : ['default'],
    browser: {
      enabled: true,
      // vitest 4 takes a provider factory (was the string 'playwright').
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
    // Coverage (the Storybook addon UI's panel / `--coverage`) scoped to shippable
    // component source — not story files, barrels, or config — so the % measures how
    // well the stories exercise the actual component code. Without this, "All files"
    // counts the large .stories.tsx files and drags the number down misleadingly.
    coverage: {
      provider: 'v8',
      include: ['packages/react/src/components/**/*.{ts,tsx}'],
      exclude: ['**/*.stories.tsx', '**/index.ts'],
      // `text` prints the console summary; the custom reporter emits the HTML
      // report branded to match the Storybook workshop (see the script header).
      reporter: ['text', [brandedHtmlReporter, {}]],
    },
    // No setupFiles needed: since Storybook 10.3 the Vitest addon auto-applies the
    // preview.tsx annotations (ThemeProvider decorator, theme/density globals,
    // a11y config) to every story.
  },
});
