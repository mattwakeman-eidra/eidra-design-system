import React from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
import { ThemeProvider } from '@eidra/react';
import '@eidra/tokens/fonts.css';

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as 'light' | 'dark') ?? 'light';
  const density = (context.globals.density as 'comfortable' | 'compact') ?? 'comfortable';
  // Stories that render their own ThemeProvider scopes (e.g. the density showcase,
  // which pins comfortable + compact side by side) opt out of the global wrapper so
  // the toolbar density doesn't conflict with the pinned scopes.
  if (context.parameters.selfScoped) {
    return <Story />;
  }
  return (
    <ThemeProvider
      theme={theme}
      density={density}
      style={{ minHeight: '100vh', padding: 'var(--eidra-space-6)' }}
    >
      <Story />
    </ThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // Report accessibility violations as warnings in the test run rather than failing it.
    // The a11y addon still surfaces every violation in the Storybook UI; 'todo' keeps
    // them visible without turning each into a hard Vitest failure.
    a11y: { test: 'todo' },
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
