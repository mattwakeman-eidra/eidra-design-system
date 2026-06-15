import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentType, SVGProps } from 'react';

/** A Lucide icon component (or any SVG icon with the same prop shape). */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

export type IconSize = 'sm' | 'md' | 'lg';

const SIZE_VAR: Record<IconSize, string> = {
  sm: 'var(--eidra-size-icon-sm)',
  md: 'var(--eidra-size-icon-md)',
  lg: 'var(--eidra-size-icon-lg)',
};

export interface IconProps extends Omit<ComponentPropsWithoutRef<'svg'>, 'children'> {
  /** The icon to render, e.g. `ChevronDown` from `@eidra/icons`. */
  icon: IconComponent;
  /** Token size keyword, or any CSS length. Defaults to `md` (1.25rem). */
  size?: IconSize | (string & {}) | number;
  /**
   * Accessible label. When omitted the icon is decorative (`aria-hidden`).
   * Provide it only when the icon conveys meaning with no adjacent text.
   */
  label?: string;
}

/**
 * Renders an icon sized and coloured from Eidra tokens. Colour follows `currentColor`,
 * so set `color` on the parent. Decorative by default; pass `label` to expose it to AT.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { icon: IconCmp, size = 'md', label, ...props },
  ref,
) {
  const dimension =
    typeof size === 'number' ? size : size in SIZE_VAR ? SIZE_VAR[size as IconSize] : size;
  const a11y = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true, focusable: false as const };
  return (
    <IconCmp
      ref={ref}
      width={dimension}
      height={dimension}
      strokeWidth={2}
      {...a11y}
      {...props}
    />
  );
});
