import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Avatar as BaseAvatar } from '@base-ui-components/react/avatar';
import type { AvatarRootProps, AvatarImageProps, AvatarFallbackProps } from '@base-ui-components/react/avatar';
import { cn } from '../../utils/cn.js';
import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

// ─── Root ────────────────────────────────────────────────────────────────────

export interface AvatarRootOwnProps {
  /** Control size. Defaults to `md`. */
  size?: AvatarSize;
  className?: string;
  children?: ReactNode;
}

type RootBaseProps = Omit<AvatarRootProps, 'className' | 'children'>;

export interface AvatarRootCombinedProps extends RootBaseProps, AvatarRootOwnProps {}

const Root = forwardRef<HTMLSpanElement, AvatarRootCombinedProps>(function Root(
  { size = 'md', className, children, ...props },
  ref,
) {
  return (
    <BaseAvatar.Root
      ref={ref}
      className={cn(styles.root, className)}
      data-size={size}
      {...props}
    >
      {children}
    </BaseAvatar.Root>
  );
});

// ─── Image ───────────────────────────────────────────────────────────────────

export interface AvatarImageOwnProps {
  className?: string;
}

type ImageBaseProps = Omit<AvatarImageProps, 'className'>;

export interface AvatarImageCombinedProps extends ImageBaseProps, AvatarImageOwnProps {}

const Image = forwardRef<HTMLImageElement, AvatarImageCombinedProps>(function Image(
  { className, ...props },
  ref,
) {
  return (
    <BaseAvatar.Image
      ref={ref}
      className={cn(styles.image, className)}
      {...props}
    />
  );
});

// ─── Fallback ─────────────────────────────────────────────────────────────────

export interface AvatarFallbackOwnProps {
  className?: string;
  children?: ReactNode;
}

type FallbackBaseProps = Omit<AvatarFallbackProps, 'className' | 'children'>;

export interface AvatarFallbackCombinedProps extends FallbackBaseProps, AvatarFallbackOwnProps {}

const Fallback = forwardRef<HTMLSpanElement, AvatarFallbackCombinedProps>(function Fallback(
  { className, children, ...props },
  ref,
) {
  return (
    <BaseAvatar.Fallback
      ref={ref}
      className={cn(styles.fallback, className)}
      {...props}
    >
      {children}
    </BaseAvatar.Fallback>
  );
});

// ─── Compound export ──────────────────────────────────────────────────────────

/**
 * User avatar built on Base UI Avatar. Displays an image, and gracefully
 * falls back to initials or an icon when the image is unavailable.
 *
 * Usage:
 * ```tsx
 * <Avatar.Root size="md">
 *   <Avatar.Image src={src} alt="Astrid Lindqvist" />
 *   <Avatar.Fallback>AL</Avatar.Fallback>
 * </Avatar.Root>
 * ```
 */
export const Avatar = { Root, Image, Fallback };
