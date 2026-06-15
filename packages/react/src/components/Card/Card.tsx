import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './Card.module.css';

export type CardVariant = 'elevated' | 'outline' | 'subtle';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Visual style. Defaults to `elevated`. */
  variant?: CardVariant;
  /** Inner padding applied uniformly to the card. Defaults to `none` (let subcomponents manage their own padding). */
  padding?: CardPadding;
}

export interface CardHeaderProps extends ComponentPropsWithoutRef<'div'> {
  /** Inner padding. Defaults to `md`. */
  padding?: CardPadding;
}

export interface CardBodyProps extends ComponentPropsWithoutRef<'div'> {
  /** Inner padding. Defaults to `md`. */
  padding?: CardPadding;
}

export interface CardFooterProps extends ComponentPropsWithoutRef<'div'> {
  /** Inner padding. Defaults to `md`. */
  padding?: CardPadding;
}

/**
 * Surface container. Renders a styled `<div>` using Eidra tokens.
 * Compose with `Card.Header`, `Card.Body`, and `Card.Footer` for structured layouts.
 *
 * @example
 * ```tsx
 * <Card variant="elevated">
 *   <Card.Header>Project Alpha</Card.Header>
 *   <Card.Body>Full-stack modernisation for Nordic enterprise clients.</Card.Body>
 *   <Card.Footer><Button>View details</Button></Card.Footer>
 * </Card>
 * ```
 */
const CardRoot = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'elevated', padding = 'none', className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(styles.root, className)}
      data-variant={variant}
      data-padding={padding}
      {...props}
    >
      {children}
    </div>
  );
});

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { padding = 'md', className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(styles.header, className)}
      data-padding={padding}
      {...props}
    >
      {children}
    </div>
  );
});

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
  { padding = 'md', className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(styles.body, className)}
      data-padding={padding}
      {...props}
    >
      {children}
    </div>
  );
});

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { padding = 'md', className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(styles.footer, className)}
      data-padding={padding}
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * Compound Card component. Use `Card.Header`, `Card.Body`, and `Card.Footer`
 * to structure content, or render children directly for custom layouts.
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
