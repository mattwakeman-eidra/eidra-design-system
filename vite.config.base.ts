import dts from 'vite-plugin-dts';

// Shared Vite library-build config for every @eidra/* package, so all three build the
// same way. Vite is the common tool because @eidra/react needs native CSS Modules scoping
// (which tsup/esbuild did not provide); tokens/icons have no CSS but build identically.
export function libConfig(opts: {
  /** Pass `import.meta.url` from the package's vite.config.ts. */
  root: string;
  /** Dependencies to keep out of the bundle. */
  external: (string | RegExp)[];
  /** Keep pre-existing dist files (e.g. tokens' generated CSS). Defaults to true (clean). */
  emptyOutDir?: boolean;
}) {
  return {
    plugins: [dts({ include: ['src'], exclude: ['src/**/*.stories.tsx'] })],
    esbuild: { jsx: 'automatic' as const, jsxImportSource: 'react' },
    build: {
      lib: {
        entry: new URL('./src/index.ts', opts.root).pathname,
        formats: ['es' as const],
        fileName: () => 'index.js',
        cssFileName: 'index',
      },
      emptyOutDir: opts.emptyOutDir ?? true,
      sourcemap: true,
      rollupOptions: { external: opts.external },
    },
  };
}
