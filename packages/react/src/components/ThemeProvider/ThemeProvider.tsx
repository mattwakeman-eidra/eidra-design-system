import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { CSPProvider } from '@base-ui/react/csp-provider';
import { cn } from '../../utils/cn.js';
import { EidraScopeProvider } from '../../utils/scope.js';

export type Theme = 'light' | 'dark';
export type Density = 'comfortable' | 'compact';
/**
 * Accent palette for the scope. `'brand'` (default) uses the Eidra orange accent;
 * `'finance'` repoints the accent tokens to the financial data-viz blue
 * (`--eidra-finance-accent*`) — chosen because in a financial colour grammar the
 * brand orange reads as caution/at-risk (RAG). Matches `DataGrid`'s `accent` prop,
 * but applied to the whole scope.
 */
export type Accent = 'brand' | 'finance';

export interface ThemeProviderProps extends ComponentPropsWithoutRef<'div'> {
  /** Active theme. Sets `data-theme`. Defaults to `light`. */
  theme?: Theme;
  /** UI density. Sets `data-density`. Defaults to `comfortable`. */
  density?: Density;
  /** Accent palette. Sets `data-accent`. Defaults to `brand`. */
  accent?: Accent;
  /**
   * Nonce applied to the inline `<style>`/`<script>` tags Base UI injects (e.g. for
   * scrollbar locking). Set this when the host enforces a strict Content Security
   * Policy (`style-src 'nonce-…'`) so those tags aren't blocked. Wraps the scope in
   * Base UI's `CSPProvider` when provided.
   */
  nonce?: string;
  /**
   * Prevent Base UI from injecting inline `<style>` elements at all (the strictest
   * CSP option). Components must then be styled entirely via class names. Forwarded
   * to Base UI's `CSPProvider`. Defaults to `false`.
   */
  cspDisableStyleElements?: boolean;
}

/**
 * Establishes the Eidra theme scope: applies `eidra-root`, `data-theme`,
 * `data-density`, and `data-accent` so tokens resolve and brand type/colour are
 * inherited. Wrap your app (or any subtree) in it. You can also apply these
 * attributes to your own root element instead of rendering this wrapper. The scope
 * is also published to portaled components (menus, dialogs, tooltips) so they match.
 */
export const ThemeProvider = forwardRef<HTMLDivElement, ThemeProviderProps>(function ThemeProvider(
  {
    theme = 'light',
    density = 'comfortable',
    accent = 'brand',
    nonce,
    cspDisableStyleElements,
    className,
    ...props
  },
  ref,
) {
  const root = (
    <div
      ref={ref}
      className={cn('eidra-root', className)}
      data-theme={theme}
      data-density={density}
      data-accent={accent}
      {...props}
    />
  );

  // Only introduce a CSPProvider when CSP handling is actually requested, so the
  // default tree stays untouched and a consumer's own CSPProvider isn't overridden.
  const scoped =
    nonce != null || cspDisableStyleElements ? (
      <CSPProvider nonce={nonce} disableStyleElements={cspDisableStyleElements}>
        {root}
      </CSPProvider>
    ) : (
      root
    );

  return <EidraScopeProvider value={{ theme, density, accent }}>{scoped}</EidraScopeProvider>;
});
