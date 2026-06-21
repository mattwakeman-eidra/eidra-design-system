// Flat config (ESLint 10). Lints the TS/TSX source across all packages.
// Prettier owns formatting — eslint-config-prettier (last) turns off every
// stylistic rule so the two never fight. Type-aware linting is intentionally
// off to keep CI fast; tsc (`pnpm typecheck`) covers type correctness.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import storybook from 'eslint-plugin-storybook';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    // Generated output, vendored assets, build artifacts, and the workflow
    // orchestration scripts (those run in a bespoke runtime that injects
    // `agent`/`parallel`/`phase`/`log` as globals — not lintable as plain JS).
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/storybook-static/**',
      'coverage/**',
      'releases/**',
      'static/**',
      'storybook-static/**',
      '**/*.workflow.mjs',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Component + app source.
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // Allow deliberate unused args/vars when prefixed with `_`, and the
      // `const { children, ...props }` pattern that omits a prop from a spread.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      // Empty `interface XProps extends BaseUIProps {}` is the house pattern
      // for re-exporting a primitive's props under an Eidra name — allow it.
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
      // `any` shows up in a few chart/AST-tooling seams where precise typing
      // buys little; surface it as a warning rather than blocking CI.
      '@typescript-eslint/no-explicit-any': 'warn',
      // The new react-compiler-adjacent rules (v7) flag intentional escape
      // hatches here — latest-value refs, a sync setState in a one-shot timer
      // effect. Keep them visible as warnings; rules-of-hooks/exhaustive-deps
      // stay errors.
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
  // Story files are demos, not shipped code. Storybook's axe addon a11y-tests
  // them at runtime in CI, so static jsx-a11y findings here are informational.
  {
    files: ['**/*.stories.{ts,tsx}'],
    extends: [storybook.configs['flat/recommended']],
    rules: {
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
    },
  },
  // Build/tooling scripts run in Node.
  {
    files: ['**/*.{mjs,cjs,js}', 'scripts/**/*', '**/*.config.{ts,js,mjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  // CommonJS tooling legitimately uses `require`.
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  prettier,
);
