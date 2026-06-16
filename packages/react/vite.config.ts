import { libConfig } from '../../vite.config.base';

// Vite scopes the CSS Modules natively (the locals/`dist/index.css` contract tsup broke).
export default libConfig({
  root: import.meta.url,
  external: [
    /^react($|\/)/,
    /^react-dom($|\/)/,
    /^@base-ui($|\/)/,
    /^@eidra\//,
    /^recharts($|\/)/,
    'clsx',
  ],
});
