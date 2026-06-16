import { forwardRef } from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type {
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarProps,
  ScrollAreaContentProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
} from '@base-ui/react/scroll-area';
import { cn } from '../../utils/cn.js';
import styles from './ScrollArea.module.css';

// ---- Root ----

export interface ScrollAreaRootOwnProps extends ScrollAreaRootProps {
  className?: string;
}

const Root = forwardRef<HTMLDivElement, ScrollAreaRootOwnProps>(function Root(
  { className, ...props },
  ref,
) {
  return (
    <BaseScrollArea.Root
      ref={ref}
      className={cn(styles.root, className)}
      {...props}
    />
  );
});

// ---- Viewport ----

export interface ScrollAreaViewportOwnProps extends ScrollAreaViewportProps {
  className?: string;
}

const Viewport = forwardRef<HTMLDivElement, ScrollAreaViewportOwnProps>(function Viewport(
  { className, ...props },
  ref,
) {
  return (
    <BaseScrollArea.Viewport
      ref={ref}
      className={cn(styles.viewport, className)}
      {...props}
    />
  );
});

// ---- Content ----

export interface ScrollAreaContentOwnProps extends ScrollAreaContentProps {
  className?: string;
}

const Content = forwardRef<HTMLDivElement, ScrollAreaContentOwnProps>(function Content(
  { className, ...props },
  ref,
) {
  return (
    <BaseScrollArea.Content
      ref={ref}
      className={cn(styles.content, className)}
      {...props}
    />
  );
});

// ---- Scrollbar ----

export interface ScrollAreaScrollbarOwnProps extends ScrollAreaScrollbarProps {
  className?: string;
}

const Scrollbar = forwardRef<HTMLDivElement, ScrollAreaScrollbarOwnProps>(function Scrollbar(
  { className, orientation = 'vertical', ...props },
  ref,
) {
  return (
    <BaseScrollArea.Scrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        styles.scrollbar,
        orientation === 'horizontal' ? styles.scrollbarHorizontal : styles.scrollbarVertical,
        className,
      )}
      {...props}
    />
  );
});

// ---- Thumb ----

export interface ScrollAreaThumbOwnProps extends ScrollAreaThumbProps {
  className?: string;
}

const Thumb = forwardRef<HTMLDivElement, ScrollAreaThumbOwnProps>(function Thumb(
  { className, ...props },
  ref,
) {
  return (
    <BaseScrollArea.Thumb
      ref={ref}
      className={cn(styles.thumb, className)}
      {...props}
    />
  );
});

// ---- Corner ----

export interface ScrollAreaCornerOwnProps extends ScrollAreaCornerProps {
  className?: string;
}

const Corner = forwardRef<HTMLDivElement, ScrollAreaCornerOwnProps>(function Corner(
  { className, ...props },
  ref,
) {
  return (
    <BaseScrollArea.Corner
      ref={ref}
      className={cn(styles.corner, className)}
      {...props}
    />
  );
});

/**
 * A scrollable container with custom-styled scrollbars, built on Base UI ScrollArea.
 * Use the compound parts to compose: Root > Viewport > Content, with Scrollbar + Thumb
 * for each scroll axis and optionally a Corner.
 *
 * @example
 * ```tsx
 * <ScrollArea.Root style={{ height: 300 }}>
 *   <ScrollArea.Viewport>
 *     <ScrollArea.Content>…long content…</ScrollArea.Content>
 *   </ScrollArea.Viewport>
 *   <ScrollArea.Scrollbar orientation="vertical">
 *     <ScrollArea.Thumb />
 *   </ScrollArea.Scrollbar>
 *   <ScrollArea.Scrollbar orientation="horizontal">
 *     <ScrollArea.Thumb />
 *   </ScrollArea.Scrollbar>
 *   <ScrollArea.Corner />
 * </ScrollArea.Root>
 * ```
 */
export const ScrollArea = {
  Root,
  Viewport,
  Content,
  Scrollbar,
  Thumb,
  Corner,
};
