import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { cn } from '../../utils/cn.js';
import styles from './Alert.module.css';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export interface AlertProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Semantic colour role. Defaults to `info`. */
  tone?: AlertTone;
  /** Optional bolded heading inside the alert. */
  title?: ReactNode;
  /** Override the default tone icon. Pass `null` to suppress the icon entirely. */
  icon?: ReactNode | null;
  /** Render a dismiss button. Provide an `onDismiss` handler to respond to it. */
  dismissible?: boolean;
  /** Called when the user clicks the dismiss button. */
  onDismiss?: () => void;
}

const TONE_ICONS: Record<AlertTone, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertCircle,
  neutral: Info,
};

/**
 * Inline callout for feedback messages. Renders a native `<div>` with `role="alert"`
 * (assertive) for danger/warning tones and `role="status"` (polite) for others.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    tone = 'info',
    title,
    icon,
    dismissible = false,
    onDismiss,
    className,
    children,
    ...props
  },
  ref,
) {
  const isAssertive = tone === 'danger' || tone === 'warning';
  const role = isAssertive ? 'alert' : 'status';

  // Resolve the icon: explicit null suppresses it, undefined falls back to tone default
  let resolvedIcon: ReactNode;
  if (icon === null) {
    resolvedIcon = null;
  } else if (icon !== undefined) {
    resolvedIcon = icon;
  } else {
    const ToneIcon = TONE_ICONS[tone];
    resolvedIcon = <Icon icon={ToneIcon} size="md" />;
  }

  return (
    <div
      ref={ref}
      role={role}
      aria-live={isAssertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={cn(styles.root, className)}
      data-tone={tone}
      {...props}
    >
      {resolvedIcon != null && (
        <span className={styles.iconSlot} aria-hidden="true">
          {resolvedIcon}
        </span>
      )}

      <div className={styles.body}>
        {title != null && <p className={styles.title}>{title}</p>}
        {children != null && <div className={styles.content}>{children}</div>}
      </div>

      {dismissible && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <Icon icon={X} size="sm" aria-hidden="true" />
        </button>
      )}
    </div>
  );
});
