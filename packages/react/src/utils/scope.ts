import { createContext, useContext } from 'react';

/**
 * The ambient Eidra theme/density scope, published by `ThemeProvider`. Portaled
 * components (menus, popovers, dialogs, …) read it to replicate the scope onto
 * their popup — which renders outside the `eidra-root` subtree, so it would
 * otherwise miss `data-theme`/`data-density`-driven styling.
 */
export interface EidraScope {
  theme?: 'light' | 'dark';
  density?: 'comfortable' | 'compact';
  accent?: 'brand' | 'finance';
}

const ScopeContext = createContext<EidraScope | null>(null);

/** Provider for the ambient scope. Rendered by `ThemeProvider`. */
export const EidraScopeProvider = ScopeContext.Provider;

/** Read the ambient scope (or `null` when no `ThemeProvider` is above). */
export function useEidraScope(): EidraScope | null {
  return useContext(ScopeContext);
}

/**
 * Data attributes that replicate the ambient theme/density scope, for spreading
 * onto a portaled element (a Positioner/Popup/Viewport). Returns an empty object
 * when there is no scope, so behaviour is unchanged without a `ThemeProvider`.
 */
export function useScopeDataAttrs(): {
  'data-theme'?: string;
  'data-density'?: string;
  'data-accent'?: string;
} {
  const scope = useContext(ScopeContext);
  if (!scope) return {};
  const attrs: { 'data-theme'?: string; 'data-density'?: string; 'data-accent'?: string } = {};
  if (scope.theme) attrs['data-theme'] = scope.theme;
  if (scope.density) attrs['data-density'] = scope.density;
  if (scope.accent) attrs['data-accent'] = scope.accent;
  return attrs;
}
