/**
 * Currency formatting helpers shared across the design system (charts, grids,
 * stat strips) so consumers don't re-implement the same `Intl.NumberFormat`
 * calls. All accept an optional `{ currency, locale }`; defaults are EUR / en-US.
 */

export interface CurrencyFormatOptions {
  /** ISO 4217 currency code. Defaults to `'EUR'`. */
  currency?: string;
  /** BCP 47 locale. Defaults to `'en-US'`. */
  locale?: string;
}

/**
 * Full currency, no fraction digits by default — e.g. `€2,916`.
 * (Invoicing's `fmt`.)
 */
export function formatCurrency(
  value: number,
  {
    currency = 'EUR',
    locale = 'en-US',
    maximumFractionDigits = 0,
  }: CurrencyFormatOptions & {
    /** Max fraction digits. Defaults to `0`. */
    maximumFractionDigits?: number;
  } = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Compact currency for axis ticks / labels — e.g. `€1.2M`, `€340K`.
 * (Invoicing's `fmtShort`.)
 */
export function formatCompactCurrency(
  value: number,
  { currency = 'EUR', locale = 'en-US' }: CurrencyFormatOptions = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Currency in thousands with a `k` suffix — e.g. `€2,916k` for `2_916_000`.
 * Useful for dense totals rows. (Invoicing's `fmtK`.)
 */
export function formatCurrencyThousands(
  value: number,
  options: CurrencyFormatOptions = {},
): string {
  return `${formatCurrency(value / 1000, options)}k`;
}
