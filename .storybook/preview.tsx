import React from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
import { ThemeProvider } from '@eidra/react';
import '@eidra/tokens/fonts.css';

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as 'light' | 'dark') ?? 'light';
  const density = (context.globals.density as 'comfortable' | 'compact') ?? 'comfortable';
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
    a11y: { test: 'error' },
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
