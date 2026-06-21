import { createElement, forwardRef } from 'react';
import type { CSSProperties, ElementType, HTMLAttributes } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './Typography.module.css';

export type TypographyVariant =
  | 'display-2xl'
  | 'display-xl'
  | 'display-lg'
  | 'display-md'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'heading-5'
  | 'heading-6'
  | 'body-lg'
  | 'body'
  | 'body-sm'
  | 'label'
  | 'caption'
  | 'code';

export type TypographyTone = 'default' | 'muted' | 'subtle' | 'accent' | 'danger' | 'inverse';

/** The element each variant renders by default, unless `as` overrides it. */
const DEFAULT_TAG: Record<TypographyVariant, ElementType> = {
  'display-2xl': 'h1',
  'display-xl': 'h1',
  'display-lg': 'h2',
  'display-md': 'h2',
  'heading-1': 'h1',
  'heading-2': 'h2',
  'heading-3': 'h3',
  'heading-4': 'h4',
  'heading-5': 'h5',
  'heading-6': 'h6',
  'body-lg': 'p',
  body: 'p',
  'body-sm': 'p',
  label: 'span',
  caption: 'span',
  code: 'code',
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /** Type style. Drives size, weight, line-height and tracking from tokens. */
  variant?: TypographyVariant;
  /** Override the rendered element (e.g. a `heading-2` style on an `h1`). */
  as?: ElementType;
  /** Semantic colour role. Defaults to inherited `default`. */
  tone?: TypographyTone;
  /** Use tabular figures (for aligned numerals). */
  tabular?: boolean;
  /** Truncate to a single line with an ellipsis. */
  truncate?: boolean;
}

/**
 * Renders brand-correct text. Product variants (`body`, `heading-*`, `label`) are the
 * default; `display-*` variants are the brand's expressive editorial scale.
 */
export const Typography = forwardRef<HTMLElement, TypographyProps>(function Typography(
  {
    variant = 'body',
    as,
    tone = 'default',
    tabular = false,
    truncate = false,
    className,
    ...props
  },
  ref,
) {
  const Tag = as ?? DEFAULT_TAG[variant];
  return createElement(Tag, {
    ref,
    className: cn(
      styles.root,
      styles[variant],
      tone !== 'default' && styles[`tone-${tone}`],
      tabular && 'eidra-tabular',
      truncate && styles.truncate,
      className,
    ),
    ...props,
  } as HTMLAttributes<HTMLElement> & { ref: typeof ref; style?: CSSProperties });
});
