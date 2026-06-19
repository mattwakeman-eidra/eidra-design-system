import { resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const root = process.cwd();

const config: StorybookConfig = {
  stories: ['../packages/*/src/**/*.stories.@(ts|tsx)', '../packages/*/src/**/*.mdx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-vitest'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: 'react-docgen' },
  staticDirs: ['../static'],
  managerHead: (head) => `${head}<link rel="icon" href="./favicon.ico" />`,
  viteFinal: async (cfg) => {
    cfg.resolve ??= {};
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
