import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Toolbar as BaseToolbar } from '@base-ui-components/react/toolbar';
import { cn } from '../../utils/cn.js';
import styles from './Toolbar.module.css';

// ─── Root ──────────────────────────────────────────────────────────────────

export interface ToolbarRootProps extends ComponentPropsWithoutRef<typeof BaseToolbar.Root> {
  className?: string;
}

const ToolbarRoot = forwardRef<HTMLDivElement, ToolbarRootProps>(function ToolbarRoot(
  { className, ...props },
  ref,
) {
  return (
    <BaseToolbar.Root
      ref={ref}
      className={cn(styles.root, className)}
      {...props}
    />
  );
});

// ─── Button ────────────────────────────────────────────────────────────────

export interface ToolbarButtonProps extends ComponentPropsWithoutRef<typeof BaseToolbar.Button> {
  className?: string;
}

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(function ToolbarButton(
  { className, ...props },
  ref,
) {
  return (
    <BaseToolbar.Button
      ref={ref}
      className={cn(styles.button, className)}
      {...props}
    />
  );
});

// ─── Link ──────────────────────────────────────────────────────────────────

export interface ToolbarLinkProps extends ComponentPropsWithoutRef<typeof BaseToolbar.Link> {
  className?: string;
}

const ToolbarLink = forwardRef<HTMLAnchorElement, ToolbarLinkProps>(function ToolbarLink(
  { className, ...props },
  ref,
) {
  return (
    <BaseToolbar.Link
      ref={ref}
      className={cn(styles.link, className)}
      {...props}
    />
  );
});

// ─── Input ─────────────────────────────────────────────────────────────────

export interface ToolbarInputProps extends ComponentPropsWithoutRef<typeof BaseToolbar.Input> {
  className?: string;
}

const ToolbarInput = forwardRef<HTMLInputElement, ToolbarInputProps>(function ToolbarInput(
  { className, ...props },
  ref,
) {
  return (
    <BaseToolbar.Input
      ref={ref}
      className={cn(styles.input, className)}
      {...props}
    />
  );
});

// ─── Group ─────────────────────────────────────────────────────────────────

export interface ToolbarGroupProps extends ComponentPropsWithoutRef<typeof BaseToolbar.Group> {
  className?: string;
}

const ToolbarGroup = forwardRef<HTMLElement, ToolbarGroupProps>(function ToolbarGroup(
  { className, ...props },
  ref,
) {
  return (
    <BaseToolbar.Group
      ref={ref}
      className={cn(styles.group, className)}
      {...props}
    />
  );
});

// ─── Separator ─────────────────────────────────────────────────────────────

export interface ToolbarSeparatorProps extends ComponentPropsWithoutRef<typeof BaseToolbar.Separator> {
  className?: string;
}

const ToolbarSeparator = forwardRef<HTMLDivElement, ToolbarSeparatorProps>(function ToolbarSeparator(
  { className, ...props },
  ref,
) {
  return (
    <BaseToolbar.Separator
      ref={ref}
      className={cn(styles.separator, className)}
      {...props}
    />
  );
});

// ─── Compound namespace export ─────────────────────────────────────────────

/**
 * A toolbar component built on Base UI `Toolbar`. Groups controls such as buttons,
 * links, and inputs with accessible keyboard navigation (arrow keys, Home, End).
 *
 * @example
 * ```tsx
 * <Toolbar.Root>
 *   <Toolbar.Button>Bold</Toolbar.Button>
 *   <Toolbar.Button>Italic</Toolbar.Button>
 *   <Toolbar.Separator />
 *   <Toolbar.Link href="/docs">Docs</Toolbar.Link>
 * </Toolbar.Root>
 * ```
 */
export const Toolbar = {
  Root: ToolbarRoot,
  Button: ToolbarButton,
  Link: ToolbarLink,
  Input: ToolbarInput,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator,
};
