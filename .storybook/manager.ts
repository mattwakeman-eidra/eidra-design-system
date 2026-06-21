import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// Brand the Storybook workshop with Eidra's logo, favicon (see main.ts), and palette.
const eidraTheme = create({
  base: 'light',
  brandTitle: 'Eidra Design System',
  brandUrl: 'https://mattwakeman-eidra.github.io/eidra-design-system/',
  brandImage: './eidra-logo.svg',
  brandTarget: '_self',

  // Brand palette
  colorPrimary: '#faa21b',
  colorSecondary: '#ff6f61',

  // UI
  appBg: '#f5f2ec',
  appContentBg: '#ffffff',
  appBorderColor: '#cbcbcb',
  appBorderRadius: 8,
  textColor: '#2b2b2b',
  textMutedColor: '#6f6f6f',

  // Toolbar
  barBg: '#ffffff',
  barTextColor: '#6f6f6f',
  barSelectedColor: '#faa21b',

  fontBase: '"Eidra Sans", "Helvetica Neue", Arial, sans-serif',
});

addons.setConfig({ theme: eidraTheme });
