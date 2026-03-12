import type { Trend } from '../../types/poll.types';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'danger' | 'neutral' | 'trend';
  trend?: Trend;
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    color: '#94a3b8',
  },
  success: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    color: '#22C55E',
  },
  danger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#EF4444',
  },
  neutral: {
    backgroundColor: 'rgba(100, 116, 139, 0.15)',
    color: '#64748B',
  },
};

const TREND_STYLES: Record<Trend, React.CSSProperties> = {
  up: VARIANT_STYLES.success,
  down: VARIANT_STYLES.danger,
  stable: VARIANT_STYLES.neutral,
};

const TREND_ICONS: Record<Trend, string> = {
  up: '▲',
  down: '▼',
  stable: '●',
};

export function Badge({ label, variant = 'default', trend }: BadgeProps) {
  const styles = variant === 'trend' && trend ? TREND_STYLES[trend] : VARIANT_STYLES[variant];
  const icon = variant === 'trend' && trend ? TREND_ICONS[trend] : null;

  return (
    <span
      style={{
        ...styles,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 1.5,
      }}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {label}
    </span>
  );
}
