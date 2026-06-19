import { resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';
import { stripPlayOnBrowse } from './strip-play.js';

const root = process.cwd();

const config: StorybookConfig = {
  stories: ['../packages/*/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-vitest'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: {
    // Resolve props through the TypeScript type graph (not the AST-only
    // `react-docgen`), so each wrapper's inherited Base UI props — `checked`,
    // `onValueChange`, … — surface in the autodocs table with their own JSDoc,
    // uniformly across every component. The propFilter keeps the table to the
    // meaningful surface: Eidra + Base UI props, dropping the hundreds of raw
    // DOM/aria props that come from `@types/react`.
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules\/@types\/react\//.test(prop.parent.fileName) : true,
    },
  },
  staticDirs: ['../static'],
  managerHead: (head) => `${head}<link rel="icon" href="./favicon.ico" />`,
  viteFinal: async (cfg) => {
    cfg.resolve ??= {};
    // Strip `play` from stories so browsing doesn't auto-run interaction tests
    // (Storybook 10 canvas autoplay has no off switch). Browse build only — the
    // Vitest/CI build sets VITEST and the plugin skips itself there, so tests
    // still run in CI and via the manual "Run component tests" button.
    if (!process.env.VITEST && !process.env.VITEST_STORYBOOK) {
      cfg.plugins ??= [];
      cfg.plugins.push(stripPlayOnBrowse());
    }
    // Resolve the React/icons packages to source so Storybook compiles components and their
    // CSS Modules together (consistent hashes, HMR, and base.css gets injected).
    // @eidra/tokens is left to resolve via package exports so its CSS subpaths
    // (`/css`, `/fonts.css`) keep working.
    cfg.resolve.alias = {
      ...(cfg.resolve.alias as Record<string, string>),
      '@eidra/react': resolve(root, 'packages/react/src/index.ts'),
      '@eidra/icons': resolve(root, 'packages/icons/src/index.ts'),
    };
    return cfg;
  },
};

export default config;
