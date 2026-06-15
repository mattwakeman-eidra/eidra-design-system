// Token-aware icon wrapper.
export { Icon } from './Icon.js';
export type { IconProps, IconComponent, IconSize } from './Icon.js';

// Re-export the full Lucide set (tree-shakable). Import named icons directly:
//   import { ChevronDown, Check } from '@eidra/icons';
export * from 'lucide-react';
export type { LucideIcon, LucideProps } from 'lucide-react';
