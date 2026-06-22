/* eslint-disable @typescript-eslint/no-explicit-any --
   This build-only plugin walks the loosely-typed CSF/Babel AST returned by
   storybook's csf-tools (node.type / node.expression / obj.properties / p.key …),
   which has no practical static type here, so the AST nodes stay `any`. */
import type { Plugin } from 'vite';
import { loadCsf, printCsf } from 'storybook/internal/csf-tools';

const STORY_RE = /\.stories\.tsx?$/;

/**
 * Unwrap `satisfies`/`as`/parenthesised expressions to reach the underlying
 * object literal (`export const X = {…} satisfies Story`).
 */
function unwrap(node: any): any {
  while (
    node &&
    (node.type === 'TSAsExpression' ||
      node.type === 'TSSatisfiesExpression' ||
      node.type === 'ParenthesizedExpression')
  ) {
    node = node.expression;
  }
  return node;
}

/** Remove a `play` property/method from a story or meta object literal. */
function dropPlay(node: any): number {
  const obj = unwrap(node);
  if (!obj || obj.type !== 'ObjectExpression') return 0;
  const before = obj.properties.length;
  obj.properties = obj.properties.filter(
    (p: any) =>
      !(
        (p.type === 'ObjectProperty' || p.type === 'ObjectMethod') &&
        ((p.key.type === 'Identifier' && p.key.name === 'play') ||
          (p.key.type === 'StringLiteral' && p.key.value === 'play'))
      ),
  );
  return before - obj.properties.length;
}

/**
 * Storybook 10 runs a story's `play` function automatically whenever the story
 * is *viewed* in the canvas (core behaviour — the canvas `StoryRender` hardcodes
 * `autoplay: true`, there is no config/global/parameter to disable it). That
 * turns plain browsing into a test run, which isn't what the workshop is for.
 *
 * This plugin strips `play` from story/meta exports **in the browse build only**,
 * so opening a story just renders it. Nothing is removed from source, and the
 * Vitest/CI build is untouched (it sets `VITEST`, which we detect and skip) — so
 * every interaction test still runs in CI and via Storybook's manual
 * "Run component tests" button. See ADR / project memory
 * `eidra-storybook-play-autoruns-onview`.
 */
export function stripPlayOnBrowse(): Plugin {
  return {
    name: 'eidra-strip-play-on-browse',
    enforce: 'pre',
    transform(code, id) {
      // Never strip under the Vitest test runner — CI/manual tests need `play`.
      if (process.env.VITEST || process.env.VITEST_STORYBOOK) return null;
      if (!STORY_RE.test(id) || id.includes('/node_modules/')) return null;
      if (!/(^|[\s,{])play\s*:/m.test(code)) return null;
      try {
        const csf = loadCsf(code, { makeTitle: (t) => t || 'untitled' }).parse();
        let removed = dropPlay(csf._metaNode);
        for (const key of Object.keys(csf._storyExports ?? {})) {
          const decl: any = (csf._storyExports as any)[key];
          removed += dropPlay(decl?.init ?? decl);
        }
        if (removed === 0) return null;
        const out = printCsf(csf as any);
        return { code: out.code, map: null };
      } catch {
        // If a story can't be parsed, leave it untouched rather than break the build.
        return null;
      }
    },
  };
}
