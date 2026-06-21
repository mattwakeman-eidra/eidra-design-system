import React from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
import {
  Title,
  Subtitle,
  Description,
  Primary,
  Controls,
  Stories,
} from '@storybook/addon-docs/blocks';
import { ThemeProvider } from '@eidra/react';
import '@eidra/tokens/fonts.css';

// Custom autodocs page: the default template repeats the first story — once as
// the top `Primary` preview and again in the `Stories` list — which reads as a
// duplicate (most obvious on trigger-only components like Dialog/Toast). Render
// the same blocks but exclude the primary from the Stories list.
const AutodocsPage = () => (
  <>
    <Title />
    <Subtitle />
    <Description />
    <Primary />
    <Controls />
    <Stories includePrimary={false} />
  </>
);

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as 'light' | 'dark') ?? 'light';
  const density = (context.globals.density as 'comfortable' | 'compact') ?? 'comfortable';
  // Stories that render their own ThemeProvider scopes (e.g. the density showcase,
  // which pins comfortable + compact side by side) opt out of the global wrapper so
  // the toolbar density doesn't conflict with the pinned scopes.
  if (context.parameters.selfScoped) {
    return <Story />;
  }
  // In Docs, every story is embedded inline — a `100vh` min-height would balloon
  // each preview with empty space and stop it hugging its content. Only fill the
  // viewport in canvas/story view; in docs just pad lightly.
  const isDocs = context.viewMode === 'docs';
  return (
    <ThemeProvider
      theme={theme}
      density={density}
      style={
        isDocs
          ? { padding: 'var(--eidra-space-4)' }
          : { minHeight: '100vh', padding: 'var(--eidra-space-6)' }
      }
    >
      <Story />
    </ThemeProvider>
  );
};

const preview: Preview = {
  // Default the a11y addon to manual mode: don't auto-run axe (and outline
  // elements on the canvas) every time a story opens — run it on demand from the
  // Accessibility panel. `manual` is an addon *global* (not a parameter); users can
  // still toggle it per session. The Vitest/CI run is unaffected — that's the
  // separate `parameters.a11y.test` setting below.
  initialGlobals: { a11y: { manual: true } },
  parameters: {
    layout: 'fullscreen',
    // Order the sidebar by the docs taxonomy (docs/STORYBOOK.md): the welcome page
    // first, then the rendered markdown docs (Docs/*), then the cross-cutting
    // Foundations, then the per-component functional categories, then (via the
    // `*` wildcard) anything unlisted, with the multi-component Patterns recipes
    // pinned last.
    options: {
      storySort: {
        order: [
          'Introduction',
          'Docs',
          ['Consuming', 'Choosing Components', 'Glossary'],
          'Foundations',
          'Actions',
          'Forms',
          'Navigation',
          'Overlays',
          'Layout',
          'Data Display',
          'Feedback',
          '*',
          'Patterns',
        ],
      },
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // In the Vitest/CI run, report accessibility violations as warnings, not hard
    // failures (independent of the manual auto-run setting above).
    a11y: { test: 'todo' },
    docs: { page: AutodocsPage },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: 'UI density',
      defaultValue: 'comfortable',
      toolbar: {
        title: 'Density',
        icon: 'component',
        items: [
          { value: 'comfortable', title: 'Comfortable' },
          { value: 'compact', title: 'Compact' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
