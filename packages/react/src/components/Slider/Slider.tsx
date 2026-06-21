import { forwardRef } from 'react';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { cn } from '../../utils/cn.js';
import styles from './Slider.module.css';

// ─── Slider.Root ──────────────────────────────────────────────────────────────

export type SliderOrientation = 'horizontal' | 'vertical';
export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderRootProps extends Omit<BaseSlider.Root.Props, 'className'> {
  className?: string;
  /** Control size. Defaults to `md`. */
  size?: SliderSize;
}

const SliderRoot = forwardRef<HTMLDivElement, SliderRootProps>(function SliderRoot(
  { className, size = 'md', ...props },
  ref,
) {
  return (
    <BaseSlider.Root ref={ref} className={cn(styles.root, className)} data-size={size} {...props} />
  );
});

// ─── Slider.Control ───────────────────────────────────────────────────────────

export interface SliderControlProps extends Omit<BaseSlider.Control.Props, 'className'> {
  className?: string;
}

const SliderControl = forwardRef<HTMLDivElement, SliderControlProps>(function SliderControl(
  { className, ...props },
  ref,
) {
  return <BaseSlider.Control ref={ref} className={cn(styles.control, className)} {...props} />;
});

// ─── Slider.Track ─────────────────────────────────────────────────────────────

export interface SliderTrackProps extends Omit<BaseSlider.Track.Props, 'className'> {
  className?: string;
}

const SliderTrack = forwardRef<HTMLDivElement, SliderTrackProps>(function SliderTrack(
  { className, ...props },
  ref,
) {
  return <BaseSlider.Track ref={ref} className={cn(styles.track, className)} {...props} />;
});

// ─── Slider.Indicator ─────────────────────────────────────────────────────────

export interface SliderIndicatorProps extends Omit<BaseSlider.Indicator.Props, 'className'> {
  className?: string;
}

const SliderIndicator = forwardRef<HTMLDivElement, SliderIndicatorProps>(function SliderIndicator(
  { className, ...props },
  ref,
) {
  return <BaseSlider.Indicator ref={ref} className={cn(styles.indicator, className)} {...props} />;
});

// ─── Slider.Thumb ─────────────────────────────────────────────────────────────

export interface SliderThumbProps extends Omit<BaseSlider.Thumb.Props, 'className'> {
  className?: string;
}

const SliderThumb = forwardRef<HTMLDivElement, SliderThumbProps>(function SliderThumb(
  { className, ...props },
  ref,
) {
  return <BaseSlider.Thumb ref={ref} className={cn(styles.thumb, className)} {...props} />;
});

// ─── Slider.Value ─────────────────────────────────────────────────────────────

export interface SliderValueProps extends Omit<BaseSlider.Value.Props, 'className'> {
  className?: string;
}

const SliderValue = forwardRef<HTMLOutputElement, SliderValueProps>(function SliderValue(
  { className, ...props },
  ref,
) {
  return <BaseSlider.Value ref={ref} className={cn(styles.value, className)} {...props} />;
});

// ─── Compound namespace export ────────────────────────────────────────────────

/**
 * A range slider built on Base UI `Slider`. Compose the parts to build your
 * slider layout: `<Slider.Root>` wraps `<Slider.Control>`, which contains
 * `<Slider.Track>` (with `<Slider.Indicator>`) and one or more `<Slider.Thumb>`s.
 * Optionally render `<Slider.Value>` to show the current value as text.
 *
 * @example Single-thumb slider
 * ```tsx
 * <Slider.Root defaultValue={40}>
 *   <Slider.Control>
 *     <Slider.Track>
 *       <Slider.Indicator />
 *     </Slider.Track>
 *     <Slider.Thumb />
 *   </Slider.Control>
 * </Slider.Root>
 * ```
 *
 * @example Range slider
 * ```tsx
 * <Slider.Root defaultValue={[20, 80]}>
 *   <Slider.Value />
 *   <Slider.Control>
 *     <Slider.Track>
 *       <Slider.Indicator />
 *     </Slider.Track>
 *     <Slider.Thumb index={0} />
 *     <Slider.Thumb index={1} />
 *   </Slider.Control>
 * </Slider.Root>
 * ```
 */
export const Slider = {
  Root: SliderRoot,
  Control: SliderControl,
  Track: SliderTrack,
  Indicator: SliderIndicator,
  Thumb: SliderThumb,
  Value: SliderValue,
};
