import { libConfig } from '../../vite.config.base';

// build.mjs (Style Dictionary) writes the CSS + fonts into dist first, so don't wipe it.
export default libConfig({
  root: import.meta.url,
  external: [],
  emptyOutDir: false,
});
