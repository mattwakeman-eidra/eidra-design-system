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
 *
 * When a scope is present it always carries a bare `data-eidra-scope` marker so
 * the box-sizing reset in `base.css` can reach portaled popups (they render
 * outside the `.eidra-root` subtree) without the reset having to be global. Keyed
 * on this Eidra-owned attribute rather than `data-theme` so a consumer's own
 * `data-theme` (e.g. on `<html>`) can't pull the reset back over their whole app.
 */
export function useScopeDataAttrs(): {
  'data-theme'?: string;
  'data-density'?: string;
  'data-accent'?: string;
  'data-eidra-scope'?: string;
} {
  const scope = useContext(ScopeContext);
  if (!scope) return {};
  const attrs: {
    'data-theme'?: string;
    'data-density'?: string;
    'data-accent'?: string;
    'data-eidra-scope'?: string;
  } = { 'data-eidra-scope': '' };
  if (scope.theme) attrs['data-theme'] = scope.theme;
  if (scope.density) attrs['data-density'] = scope.density;
  if (scope.accent) attrs['data-accent'] = scope.accent;
  return attrs;
}
