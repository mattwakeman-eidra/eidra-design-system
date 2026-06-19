import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentType, SVGProps } from 'react';
import * as Flags from 'country-flag-icons/react/3x2';

/** A country-flag SVG component from `country-flag-icons` (accepts standard SVG props). */
type FlagSvg = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;

const FLAGS = Flags as unknown as Record<string, FlagSvg | undefined>;

/** ISO 3166-1 alpha-2 codes that ship a flag (e.g. `'SE'`, `'NO'`, `'US'`). */
export type FlagCode = keyof typeof Flags;

/** Every ISO 3166-1 alpha-2 code that has a flag, sorted. Useful for country pickers. */
export const flagCodes: FlagCode[] = (Object.keys(FLAGS) as FlagCode[])
  .filter((c) => /^[A-Z]{2}$/.test(c))
  .sort();

export type FlagSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE_VAR: Record<FlagSize, string> = {
  xs: 'var(--eidra-size-icon-xs)',
  sm: 'var(--eidra-size-icon-sm)',
  md: 'var(--eidra-size-icon-md)',
  lg: 'var(--eidra-size-icon-lg)',
};

export interface FlagProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  /** ISO 3166-1 alpha-2 country code, e.g. `"SE"`. Case-insensitive. */
  code: string;
  /**
   * Token size keyword (sets the height; width follows the 3:2 ratio), or any CSS
   * length / number. Defaults to `md`.
   */
  size?: FlagSize | (string & {}) | number;
  /**
   * Accessible label, e.g. the country name. When omitted the flag is decorative
   * (`aria-hidden`). Provide it only when the flag conveys meaning with no adjacent text.
   */
  label?: string;
}

/**
 * A country flag, sized from Eidra tokens. Unlike `Icon`, flags are multicolour
 * (they ignore `currentColor`) and 3:2, so they get a hairline border and rounded
 * corners to read cleanly against any surface. Looks the flag up by ISO 3166-1
 * alpha-2 `code`; renders nothing for an unknown code. Decorative by default — pass
 * `label` to expose it to assistive tech.
 *
 * @example
 * ```tsx
 * <Flag code="SE" />
 * <Flag code={row.country} size="sm" label={row.countryName} />
 * ```
 */
export const Flag = forwardRef<HTMLSpanElement, FlagProps>(function Flag(
  { code, size = 'md', label, style, ...props },
  ref,
) {
  const FlagSvgCmp = FLAGS[code?.toUpperCase()];
  if (!FlagSvgCmp) return null;
  const height = typeof size === 'number' ? size : size in SIZE_VAR ? SIZE_VAR[size as FlagSize] : size;
  const a11y = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true };
  return (
    <span
      ref={ref}
      style={{
        // inline-block + aspect-ratio, not inline-flex + width:auto — the latter
        // collapses the SVG to zero width in Chromium (the flag disappears inline).
        display: 'inline-block',
        height,
        aspectRatio: '3 / 2',
        lineHeight: 0,
        overflow: 'hidden',
        borderRadius: 'var(--eidra-radius-sm)',
        boxShadow: 'inset 0 0 0 1px var(--eidra-border)',
        verticalAlign: '-0.15em',
        ...style,
      }}
      {...a11y}
      {...props}
    >
      <FlagSvgCmp style={{ display: 'block', width: '100%', height: '100%' }} aria-hidden focusable={false} />
    </span>
  );
});
