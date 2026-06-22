import { readFile } from 'node:fs/promises';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import type { Plugin } from 'vite';

// Compiles `import Doc from './thing.md?mdxdoc'` into a real MDX component at
// build time, so the repo's canonical markdown docs (CONTEXT.md, CONSUMING.md)
// render as rich Storybook pages. `format: 'md'` keeps GitHub-lenient parsing
// (bare `<` / `{` in prose stay literal); `providerImportSource` wires the
// component up to Storybook's DocsRenderer <MDXProvider>, so code blocks,
// links, and headings inherit Storybook's styled components automatically.
// Mermaid fences are handled by the `code` override in docs/mdxComponents.tsx.
const QUERY = '?mdxdoc';

export function markdownDocPlugin(): Plugin {
  return {
    name: 'eidra:markdown-doc',
    enforce: 'pre',
    async load(id) {
      if (!id.endsWith(`.md${QUERY}`)) return null;
      const file = id.slice(0, -QUERY.length);
      this.addWatchFile(file);
      const source = await readFile(file, 'utf8');
      const compiled = await compile(source, {
        format: 'md',
        remarkPlugins: [remarkGfm],
        providerImportSource: '@mdx-js/react',
      });
      return { code: String(compiled), map: null };
    },
  };
}
