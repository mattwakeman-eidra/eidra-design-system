// Token-aware icon wrapper.
export { Icon } from './Icon.js';
export type { IconProps, IconComponent, IconSize } from './Icon.js';

// Country flags (multicolour, 3:2) — wraps the full ISO 3166-1 set from country-flag-icons.
export { Flag, flagCodes } from './Flag.js';
export type { FlagProps, FlagCode, FlagSize } from './Flag.js';

// Re-export the full Lucide set (tree-shakable). Import named icons directly:
//   import { ChevronDown, Check } from '@eidra/icons';
export * from 'lucide-react';
export type { LucideIcon, LucideProps } from 'lucide-react';
