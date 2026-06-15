import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

export type Theme = 'light' | 'dark';
export type Density = 'comfortable' | 'compact';

export interface ThemeProviderProps extends ComponentPropsWithoutRef<'div'> {
  /** Active theme. Sets `data-theme`. Defaults to `light`. */
  theme?: Theme;
  /** UI density. Sets `data-density`. Defaults to `comfortable`. */
  density?: Density;
}

/**
 * Establishes the Eidra theme scope: applies `eidra-root`, `data-theme`, and
 * `data-density` so tokens resolve and brand type/colour are inherited. Wrap your app
 * (or any subtree) in it. You can also apply these attributes to your own root element
 * instead of rendering this wrapper.
 */
export const ThemeProvider = forwardRef<HTMLDivElement, ThemeProviderProps>(
  function ThemeProvider({ theme = 'light', density = 'comfortable', className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('eidra-root', className)}
        data-theme={theme}
        data-density={density}
        {...props}
      />
    );
  },
);
