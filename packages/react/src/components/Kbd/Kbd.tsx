import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './Kbd.module.css';

export interface KbdProps extends ComponentPropsWithoutRef<'kbd'> {
  /** Visual size of the key hint. Defaults to `md`. */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Keyboard key hint. Renders a native `<kbd>` styled with Eidra tokens.
 * Uses monospace font, subtle surface, border, and small radius.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { size = 'md', className, children, ...props },
  ref,
) {
  return (
    <kbd
      ref={ref}
      className={cn(styles.root, className)}
      data-size={size}
      {...props}
    >
      {children}
    </kbd>
  );
});
