import type { ComponentPropsWithoutRef } from 'react';
import { CodeOrSourceMdx } from '@storybook/addon-docs/blocks';
import { Mermaid } from './Mermaid.js';

// A mermaid fence (```mermaid) becomes a rendered diagram; every other code
// block falls through to Storybook's own styled renderer (CodeOrSourceMdx).
function Code({ className, children, ...rest }: ComponentPropsWithoutRef<'code'>) {
  const language = /language-(\w+)/.exec(className ?? '')?.[1];
  if (language === 'mermaid' && typeof children === 'string') {
    return <Mermaid chart={children} />;
  }
  return (
    <CodeOrSourceMdx className={className} {...rest}>
      {children}
    </CodeOrSourceMdx>
  );
}

// Passed to the compiled <Content> pages; merges over (and otherwise inherits)
// the components Storybook's DocsRenderer already provides for links/headings.
export const mdxComponents = { code: Code };
