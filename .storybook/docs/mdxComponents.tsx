import type { ComponentPropsWithoutRef } from 'react';
import { CodeOrSourceMdx } from '@storybook/addon-docs/blocks';
import { Mermaid } from './Mermaid.js';

// Fence languages Storybook's syntax highlighter doesn't register, mapped to one
// it does — otherwise the block renders unhighlighted (flat) next to the
// coloured ones. `jsonc` isn't recognised; `json` is.
const LANGUAGE_ALIASES: Record<string, string> = { jsonc: 'json' };

// A mermaid fence (```mermaid) becomes a rendered diagram; every other code
// block falls through to Storybook's own styled renderer (CodeOrSourceMdx).
function Code({ className, children, ...rest }: ComponentPropsWithoutRef<'code'>) {
  const language = /language-(\w+)/.exec(className ?? '')?.[1];
  if (language === 'mermaid' && typeof children === 'string') {
    return <Mermaid chart={children} />;
  }
  const alias = language ? LANGUAGE_ALIASES[language] : undefined;
  const resolvedClassName =
    alias && className ? className.replace(`language-${language}`, `language-${alias}`) : className;
  return (
    <CodeOrSourceMdx className={resolvedClassName} {...rest}>
      {children}
    </CodeOrSourceMdx>
  );
}

// Passed to the compiled <Content> pages; merges over (and otherwise inherits)
// the components Storybook's DocsRenderer already provides for links/headings.
export const mdxComponents = { code: Code };
