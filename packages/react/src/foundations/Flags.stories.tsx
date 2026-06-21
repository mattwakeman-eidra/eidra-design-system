import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flag, flagCodes } from '@eidra/icons';
import type { FlagSize } from '@eidra/icons';
import styles from './Flags.module.css';

/** Country name from the platform's Intl data — no extra dependency. Falls back to the code. */
const regionNames =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;
const countryName = (code: string): string => {
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
};

const meta = {
  title: 'Foundations/Flags',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Country flags from `@eidra/icons`. `<Flag code="SE" />` looks a flag up by ISO 3166-1 ' +
          'alpha-2 code (case-insensitive), sizes its height from icon tokens (width follows the 3:2 ' +
          'ratio), and adds rounded corners + a hairline border so it reads on any surface. Flags are ' +
          'multicolour, so unlike `Icon` they ignore `currentColor`. An unknown code renders nothing. ' +
          'Pass `label` (e.g. the country name) when the flag stands alone without adjacent text.',
      },
    },
  },
} satisfies Meta;

export default meta;

const Cell = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.cell}>{children}</div>
);

const SIZE_OPTIONS: FlagSize[] = ['xs', 'sm', 'md', 'lg'];
const sizeControl = { control: 'inline-radio', options: SIZE_OPTIONS } as const;

/** The five regions the monthly financial deck reports on. Toggle the name and code on/off. */
export const RegionSet: StoryObj<{ size: FlagSize; showName: boolean; showCode: boolean }> = {
  argTypes: {
    size: sizeControl,
    showName: { control: 'boolean' },
    showCode: { control: 'boolean' },
  },
  args: { size: 'md', showName: true, showCode: false },
  render: ({ size, showName, showCode }) => (
    <div className={styles.row}>
      {(
        [
          ['SE', 'Sweden'],
          ['NO', 'Norway'],
          ['NL', 'Netherlands'],
          ['DE', 'DACH'],
          ['US', 'USA'],
        ] as const
      ).map(([code, name]) => (
        <Cell key={code}>
          <Flag code={code} size={size} label={name} />
          {showName && <span>{name}</span>}
          {showCode && (
            <code style={{ color: 'var(--eidra-fg-muted)', fontSize: 'var(--eidra-font-size-xs)' }}>
              {code}
            </code>
          )}
        </Cell>
      ))}
    </div>
  ),
};

/**
 * Every token size side by side — `xs` (12px), `sm` (16px), `md` (20px), `lg` (24px). Height
 * comes from `--eidra-size-icon-*`; width follows the 3:2 ratio. Use the **code** control to
 * preview any country across all sizes.
 */
export const Sizes: StoryObj<{ code: string }> = {
  argTypes: { code: { control: 'text' } },
  args: { code: 'SE' },
  render: ({ code }) => (
    <div className={styles.sizes}>
      {SIZE_OPTIONS.map((size) => (
        <Cell key={size}>
          <Flag code={code} size={size} label={`${countryName(code)} (${size})`} />
          <code style={{ color: 'var(--eidra-fg-muted)', fontSize: 'var(--eidra-font-size-xs)' }}>
            {size}
          </code>
        </Cell>
      ))}
    </div>
  ),
};

/** Inline with text — flags sit on the text baseline and ignore `currentColor`. */
export const Inline: StoryObj<{ size: FlagSize }> = {
  argTypes: { size: sizeControl },
  args: { size: 'sm' },
  render: ({ size }) => (
    <p style={{ fontSize: 'var(--eidra-font-size-base)', maxWidth: '52ch', lineHeight: 1.6 }}>
      Top accounts span <Flag code="SE" size={size} label="Sweden" /> Sweden,{' '}
      <Flag code="NO" size={size} label="Norway" /> Norway,{' '}
      <Flag code="NL" size={size} label="Netherlands" /> the Netherlands,{' '}
      <Flag code="DE" size={size} label="Germany" /> Germany and{' '}
      <Flag code="US" size={size} label="United States" /> the United States.
    </p>
  ),
};

interface FlagGalleryArgs {
  /** Flag size — resize the whole gallery. */
  size: FlagSize;
  /** Show the ISO 3166-1 alpha-2 code under each flag. */
  showCode: boolean;
  /** Show the country name under each flag. */
  showName: boolean;
}

/**
 * Every flag in the set ({@link flagCodes}). Use the **size** control to resize the whole
 * gallery, and the **showCode** / **showName** toggles to add or remove the short code and
 * the country name. Filter by code or name to find one.
 */
export const AllFlags: StoryObj<FlagGalleryArgs> = {
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    showCode: { control: 'boolean' },
    showName: { control: 'boolean' },
  },
  args: { size: 'lg', showCode: true, showName: false },
  render: function AllFlagsStory({ size, showCode, showName }) {
    const [q, setQ] = useState('');
    const codes = useMemo(() => {
      const needle = q.trim().toLowerCase();
      if (!needle) return flagCodes;
      return flagCodes.filter(
        (c) => c.toLowerCase().includes(needle) || countryName(c).toLowerCase().includes(needle),
      );
    }, [q]);
    // Wider cells when names are shown so they don't wrap awkwardly.
    const minCol = showName ? 132 : 72;
    return (
      <div className={styles.gallery}>
        <div className={styles.controls}>
          <input
            aria-label="Filter flags by code or name"
            placeholder="Filter by code or name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              height: 'var(--eidra-size-control-sm)',
              paddingInline: 'var(--eidra-gap-2)',
              border: '1px solid var(--eidra-border)',
              borderRadius: 'var(--eidra-radius-md)',
              background: 'var(--eidra-surface)',
              color: 'var(--eidra-fg)',
              fontSize: 'var(--eidra-font-size-sm)',
            }}
          />
          <span style={{ color: 'var(--eidra-fg-muted)', fontSize: 'var(--eidra-font-size-sm)' }}>
            {codes.length} of {flagCodes.length}
          </span>
        </div>
        <div
          className={styles.galleryGrid}
          style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minCol}px, 1fr))` }}
        >
          {codes.map((code) => (
            <div
              key={code}
              style={{
                display: 'grid',
                justifyItems: 'center',
                gap: 'var(--eidra-gap-1)',
                textAlign: 'center',
              }}
            >
              <Flag code={code} size={size} label={countryName(code)} />
              {showName && (
                <span style={{ fontSize: 'var(--eidra-font-size-xs)', color: 'var(--eidra-fg)' }}>
                  {countryName(code)}
                </span>
              )}
              {showCode && (
                <code
                  style={{ fontSize: 'var(--eidra-font-size-xs)', color: 'var(--eidra-fg-muted)' }}
                >
                  {code}
                </code>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
};
